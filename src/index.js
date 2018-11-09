import express from 'express'
import { addressCreator } from './components/address-creator'

const port = process.argv[2]
const app = express()

app.get('/', function(req, res) {
  res.send({
    "Output": "Hello World from BTC/ ETH !"
  });
});

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

//app.listen(port, () => {
//	console.log(`Listenening on port number ${port}...`)
//})

// Export your Express configuration so that it can be consumed by the Lambda handler
module.exports = app
