import dotenv from 'dotenv'
dotenv.config();

import uuid from 'uuid/v1'
import Web3 from 'web3'
import bitcoin from 'bitcoinjs-lib'
import bip32 from 'bip32'
import BitGoJS from 'bitgo'
import Promise from 'bluebird'
import axios from 'axios'
import babelpolyfill from 'babel-polyfill'

class AddressCreator {
    constructor(addressCreatorParams) {
        this.web3 = addressCreatorParams.web3
        this.bitcoin = addressCreatorParams.bitcoin
        this.bip32 = addressCreatorParams.bip32
        this.bitGoJs = addressCreatorParams.bitGoJs
        this.bitGoToken = addressCreatorParams.bitGoToken
        this.bitGoCoin = addressCreatorParams.bitGoCoin
        this.bitGoEnv = addressCreatorParams.bitGoEnv
        this.bitGoPassphrase = addressCreatorParams.bitGoPassphrase
        this.ethScanToken = addressCreatorParams.ethScanToken

        this.rng = this.rng.bind(this)
        this.now = this.now.bind(this)
        this.getEntropy = this.getEntropy.bind(this)
    }

    generateBTCAddressOld() {
        const keyPair = this.bitcoin.ECPair.makeRandom({rng: this.rng})
        const { address } = this.bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey })
        const pkey = keyPair.toWIF()

        if (!!address && !!pkey) {
            return {
                address: address,
                privateKey: pkey
            }
        }

        return {
            error: 'Could not generateBTCAddress'
        }
    }

    generateETHAddress() {
        const ethWallet = this.web3.eth.accounts.wallet.create(1, this.getEntropy())

        if (!!ethWallet[0]) {
            return {
                address: ethWallet[0].address,
                privateKey: ethWallet[0].privateKey
            }
        }

        return {
            error: 'Could not generateETHAddress'
        }
    }

    generateBTCAddress() {
        const bitgo = new this.bitGoJs.BitGo({ env: this.bitGoEnv })
        const coin = this.bitGoCoin
        const accessToken = this.bitGoToken
        const now = this.now
        const bip32 = this.bip32
        const passphrase = this.bitGoPassphrase

        const promise = Promise.coroutine(function *() {
            bitgo.authenticateWithAccessToken({ accessToken })

            const label = 'BTC Wallet - ' + now()

            const walletOptions = {
                label,
                passphrase
            };

            const wallet = yield bitgo.coin(coin).wallets().generateWallet(walletOptions)

            const walletInstance = wallet.wallet

            let additionalData = ''
            const walletId = walletInstance.id()

            additionalData += `Wallet ID: ${walletInstance.id()} \n `
            additionalData += `Wallet Label: ${walletInstance.label()} \n `
            additionalData += "Balance is: " + (walletInstance.balance() / 1e8).toFixed(4) + " \n "
            additionalData += `Receive address: ${walletInstance.receiveAddress()} \n `

            const xprv = wallet.backupKeychain.prv
            const node = bip32.fromBase58(xprv, bitcoin.networks.bitcoin)

            additionalData += 'BACK THIS UP:  \n '
            additionalData += `User keychain encrypted xPrv: ${wallet.userKeychain.encryptedPrv} \n `
            additionalData += `Backup keychain xPrv: ${xprv} \n `

            additionalData += `Private Key in WIF ${node.toWIF()} \n `

            return {
                address: walletInstance.receiveAddress(),
                private_key: node.toWIF(),
                additional_data : additionalData,
                wallet_id: walletId
            }
        })()

        return promise
    }

    getBTCWalletInfo(btcWalletId) {
        const bitgo = new this.bitGoJs.BitGo({ env: this.bitGoEnv })
        const coin = this.bitGoCoin
        const accessToken = this.bitGoToken

        const promise = Promise.coroutine(function *() {
            bitgo.authenticateWithAccessToken({ accessToken })

            const id = btcWalletId
            const wallet = yield bitgo.coin(coin).wallets().get({ id })
            const walletId = wallet.id()
            const walletLabel = wallet.label()
            const balance =  (wallet.balance() / 1e8).toFixed(4)
            const walletReceiveAddress = wallet.receiveAddress()

            let additionalData = ''

            additionalData += `Wallet ID: ${walletId} \n `
            additionalData += `Wallet label: ${walletLabel} \n `
            additionalData += `Balance is:  ${balance} \n `
            additionalData += `Receive address: ${walletReceiveAddress} \n `

            return {
                walletId,
                walletLabel,
                balance,
                walletReceiveAddress
            }
        })();

        return promise
    }

    getETHWalletInfo(ethWalletId) {
        const accessToken = this.ethScanToken

        const promise = Promise.coroutine(function *() {
            const params = {
                module: 'account',
                action: 'balance',
                tag: 'latest',
                apikey: accessToken,
                address: ethWalletId
            }

            const ethScanResponse = yield axios.get('https://api.etherscan.io/api', {params})

            if (ethScanResponse.data.message === 'OK') {
                const balance = parseFloat(parseInt(ethScanResponse.data.result) * 0.000000000000000001)

                return {
                    ethWalletId,
                    balance
                }
            }

            return {
                error: ethScanResponse.data
            }
        })()

        return promise
    }

    getEntropy() {
        return  uuid().split('-').join('')
    }

    now() {
        const date = new Date()
        const aaaa = date.getFullYear()
        let gg = date.getDate()
        let mm = (date.getMonth() + 1)

        if (gg < 10) {
            gg = "0" + gg
        }

        if (mm < 10) {
            mm = "0" + mm
        }

        const cur_day = aaaa + "-" + mm + "-" + gg

        let hours = date.getHours()
        let minutes = date.getMinutes()
        let seconds = date.getSeconds();

        if (hours < 10) {
            hours = "0" + hours
        }

        if (minutes < 10) {
            minutes = "0" + minutes
        }

        if (seconds < 10) {
            seconds = "0" + seconds
        }

        return cur_day + "_" + hours + "-" + minutes + "-" + seconds
    }

    rng() {
        return Buffer.from(this.getEntropy())
    }
}

const web3 = new Web3(Web3.givenProvider || "ws://localhost:8546")

const addressCreatorParams = {
    web3, bitcoin, bip32,
    bitGoJs: BitGoJS,
    bitGoToken: process.env.bitGoTokenProd,
    bitGoCoin: process.env.bitGoCoinProd,
    bitGoEnv: 'prod',
    bitGoPassphrase: process.env.passphrase,
    ethScanToken: process.env.ethScanTokenProd
}

const addressCreator = new AddressCreator(addressCreatorParams)

export {
    addressCreator
}
