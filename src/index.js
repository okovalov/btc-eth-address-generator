import express from 'express'
import { addressCreator } from './components/address-creator'

const port = process.argv[2]
const app = express()

app.post('/newbtc', (req, res) => {
	res.json(
		addressCreator.generateBTCAddress()
	);
});

app.post('/neweth', (req, res) => {
	res.json(
		addressCreator.generateETHAddress()
	);
});

app.listen(port, () => {
	console.log(`Listenening on port ${port}...`)
})
