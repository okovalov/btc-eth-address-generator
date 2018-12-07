import dotenv from 'dotenv'
dotenv.config();

import express from 'express'
import { addressCreator } from './components/address-creator'

const port = process.argv[2]
const app = express()

app.post('/newbtc', (req, res) => {
    addressCreator.generateBTCAddress().then( function (result)  {
        res.json(result)
    })
});

app.post('/neweth', (req, res) => {
	res.json(
		addressCreator.generateETHAddress()
	);
});

app.listen(port, () => {
	console.log(`Listening on port ${port}...`)
})
