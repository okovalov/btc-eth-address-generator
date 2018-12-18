'use strict';

const supertest = require('supertest');
const test = require('unit.js');
const app = require('../dist/index.js');

const request = supertest(app);

describe('Tests app', function() {
    it('verifies post to newbtc', function(done) {
        // console.log('aa')
        request.post('/newbtc').expect(200).end(function(err, result) {
            test.value(result.body).hasOwnProperties(['address', 'privateKey', 'additionalData', 'walletId'])
            // test.value(result.body).hasNotOwnProperty('error')
            // test.value(result).hasHeader('content-type', 'application/json; charset=utf-8');
            done(err);
        });
    });
    // it('verifies post to ethbalance', function(done) {
    //     request.post('/ethbalance').expect(200).end(function(err, result) {
    //         test.value(result.body).hasOwnProperties(['ethWalletId', 'balance'])
    //         test.value(result.body).hasNotOwnProperty('error')
    //         test.value(result).hasHeader('content-type', 'application/json; charset=utf-8');
    //         done(err);
    //     });
    // });
    // it('verifies post to btcbalance', function(done) {
    //     request.post('/btcbalance').expect(200).end(function(err, result) {
    //         test.value(result.body).hasOwnProperties(['walletId', 'walletLabel','walletBalance','walletReceiveAddress'])
    //         test.value(result.body).hasNotOwnProperty('error')
    //         test.value(result).hasHeader('content-type', 'application/json; charset=utf-8');
    //         done(err);
    //     });
    // });

});
