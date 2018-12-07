import dotenv from 'dotenv'
dotenv.config();

import express from 'express'
import { addressCreator } from './components/address-creator'
import bodyParser from 'body-parser'

const port = process.argv[2]
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.post('/newbtc', (req, res) => {
    addressCreator.generateBTCAddress()
        .then((result) => {
            res.json(result)
        })
        .catch((error) => {
            res.json({
                error
            })
        });
});

app.post('/neweth', (req, res) => {
	res.json({
        error: 'temporary disabled'
    });
});

app.post('/btcbalance', (req, res) => {
    const btcWalletId = req.body.btcWalletId

    if (!btcWalletId) {
        res.json({
            error: 'bitgo btcWalletId must be provided'
        })
    } else {
        addressCreator.getBTCWalletInfo(btcWalletId)
            .then((result) => {
                res.json(result)
            })
            .catch((error) => {
                res.json({
                    error
                })
            });
    }
});

app.listen(port, () => {
	console.log(`Listening on port ${port}...`)
})
