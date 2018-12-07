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
    addressCreator.generateBTCAddress().then( function (result)  {
        res.json(result)
    })
});

app.post('/neweth', (req, res) => {
	res.json({
        error: 'temporary disabled'
    }
    // addressCreator.generateETHAddress()
	);
});

app.post('/btcbalance', (req, res) => {
    const btcWalletId = req.body.btcWalletId

    if (!btcWalletId) {
        res.json({
            error: 'bitgo btcWalletId must be provided'
        })
    }

    addressCreator.getBTCWalletInfo(btcWalletId).then( function (result)  {
        res.json(result)
    })
});

app.listen(port, () => {
	console.log(`Listening on port ${port}...`)
})
