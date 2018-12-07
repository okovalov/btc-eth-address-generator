import dotenv from 'dotenv'
dotenv.config();

import uuid from 'uuid/v1'
import Web3 from 'web3'
import bitcoin from 'bitcoinjs-lib'
import bip32 from 'bip32'
import BitGoJS from 'bitgo'
import Promise from 'bluebird'

class AddressCreator {
    constructor(web3, bitcoin, bip32, bitGoJs, bitGoToken, bitGoCoin, bitGoEnv, passphrase) {
        this.web3 = web3
        this.bitcoin = bitcoin
        this.bip32 = bip32
        this.bitGoJs = bitGoJs
        this.bitGoToken = bitGoToken
        this.bitGoCoin = bitGoCoin
        this.bitGoEnv = bitGoEnv
        this.passphrase = passphrase
        this.rng = this.rng.bind(this)
    }

    rng() {
        return Buffer.from(this.getEntropy())
    }

    generateBTCAddressOld() {
        const keyPair = this.bitcoin.ECPair.makeRandom({rng: this.rng});
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
        const now = this.now.bind(this)
        const bip32 = this.bip32
        const passphrase = this.passphrase

        const promise = Promise.coroutine(function *() {
            bitgo.authenticateWithAccessToken({ accessToken })

            const label = 'BTC Wallet - ' + now()

            const walletOptions = {
                label,
                passphrase
            };

            const wallet = yield bitgo.coin(coin).wallets().generateWallet(walletOptions)

            const walletInstance = wallet.wallet

            console.log(`Wallet ID: ${walletInstance.id()}`)
            console.log(`Wallet Label: ${walletInstance.label()}`)
            console.log("Balance is: " + (walletInstance.balance() / 1e8).toFixed(4))
            console.log(`Receive address: ${walletInstance.receiveAddress()}`)

            const xprv = wallet.backupKeychain.prv
            const node = bip32.fromBase58(xprv, bitcoin.networks.bitcoin)

            console.log('BACK THIS UP: ');
            console.log(`User keychain encrypted xPrv: ${wallet.userKeychain.encryptedPrv}`)
            console.log(`Backup keychain xPrv: ${xprv}`)

            console.log(`Private Key in WIF ${node.toWIF()}`)

            return {
                address: walletInstance.receiveAddress(),
                privateKey: node.toWIF()
            }
        })();

        return promise
    }

    getWalletIndfo() {
        const bitgo = new this.bitGoJs.BitGo({ env: this.bitGoEnv });
        const coin = this.bitGoCoin;
        const accessToken = this.bitGoToken;

        Promise.coroutine(function *() {
            bitgo.authenticateWithAccessToken({ accessToken });

            const id = 'ID_OF_THE_WALLET'
            const wallet = yield bitgo.coin(coin).wallets().get({ id });

            console.log(`Wallet ID: ${wallet.id()}`);
            console.log(`Wallet label: ${wallet.label()}`);
            console.log("Balance is: " + (wallet.balance() / 1e8).toFixed(4));
            console.log(`Receive address: ${wallet.receiveAddress()}`);

        })();
    }

    getEntropy() {
        return  uuid().split('-').join('')
    }

    now() {
        const date = new Date();
        const aaaa = date.getFullYear();
        let gg = date.getDate();
        let mm = (date.getMonth() + 1);

        if (gg < 10) {
            gg = "0" + gg;
        }

        if (mm < 10) {
            mm = "0" + mm;
        }

        const cur_day = aaaa + "-" + mm + "-" + gg;

        let hours = date.getHours()
        let minutes = date.getMinutes()
        let seconds = date.getSeconds();

        if (hours < 10) {
            hours = "0" + hours;
        }

        if (minutes < 10) {
            minutes = "0" + minutes;
        }

        if (seconds < 10) {
            seconds = "0" + seconds;
        }

        return cur_day + "_" + hours + "-" + minutes + "-" + seconds;
    }
}

const web3 = new Web3(Web3.givenProvider || "ws://localhost:8546")

const addressCreator = new AddressCreator(web3, bitcoin, bip32, BitGoJS, process.env.bitGoTokenProd, process.env.bitGoCoinProd, 'prod', process.env.passphrase)

export {
    addressCreator
}
