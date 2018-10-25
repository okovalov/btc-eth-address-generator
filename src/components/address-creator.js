import uuid from 'uuid/v1'
import Web3 from 'web3'
import bitcoin from 'bitcoinjs-lib'

class AddressCreator {
    constructor(web3, bitcoin) {
        this.web3 = web3
        this.bitcoin = bitcoin
        this.rng = this.rng.bind(this)
    }

    rng() {
        return Buffer.from(this.getEntropy())
    }

    generateBTCAddress() {
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

    getEntropy() {
        return  uuid().split('-').join('')
    }
}

const web3 = new Web3(Web3.givenProvider || "ws://localhost:8546")

const addressCreator = new AddressCreator(web3, bitcoin)

export {
    addressCreator
}
