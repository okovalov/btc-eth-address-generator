# btc-eth-address-generator

This is a small project to generate BTC or ETH addresses by a single API call

This repository is a small **node.js** project which provides two end-points, by calling those you would receive either a BTC or an ETH wallet address, which are generated on the fly.

## Purpose

There is a lot of different libraries, utilites you could use to get those addresses generated, however I could not find any where this piece of functionality was wrapped and put in place to be available by a single API call, so that is why I decided to create this mini-project mostly for myself, to make my life (when I need to create lots of wallets) a bit more easier.

## Getting Started

The first step in running this project is to run `npm install`.

The second step is to start a **node.js** web-server by running `npm start`.

## Notes

By default the web-server would be availabe on `http://localhost:3000/`

To change the default port, please update "start" and "debug" scripts in the package.json (and replace 3000 with the port you'd like to use)

###### Copyright Disclaimer
###### The code in this repository is property of Oleksandr Kovalov (owner). The code, all or portions of it, is not to be distributed in any way without written permission from the owner.
