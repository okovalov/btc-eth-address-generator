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

app.listen(port, () => {
	console.log(`Listening on port ${port}...`)
})
