'use strict';

const supertest = require('supertest');
const test = require('unit.js');
const app = require('../dist/index.js');

const request = supertest(app);

describe('Tests app', function() {
    // it('verifies get', function(done) {
    //     request.get('/').expect(200).end(function(err, result) {
    //         test.string(result.body.Output).contains('BTC/ETH');
    //         test.value(result).hasHeader('content-type', 'application/json; charset=utf-8');
    //         done(err);
    //     });
    // });
    it('verifies get to newbtc', function(done) {
        request.get('/newbtc').expect(200).end(function(err, result) {
            test.value(result.body).hasOwnProperties(['address', 'privateKey', 'additionalData'])
            test.value(result.body).hasNotOwnProperty('error')
            test.value(result).hasHeader('content-type', 'application/json; charset=utf-8');
            done(err);
        });
    });
    // it('verifies get to neweth', function(done) {
    //     request.get('/neweth').expect(200).end(function(err, result) {
    //         test.value(result.body).hasOwnProperties(['address', 'privateKey'])
    //         test.value(result.body).hasNotOwnProperty('error')
    //         test.value(result).hasHeader('content-type', 'application/json; charset=utf-8');
    //         done(err);
    //     });
    // });
});
