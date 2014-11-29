
/**
 * Module dependencies.
 */

var Hai = require('../')
  , should = require('should')
  , express = require('express')
  , http = require('http');

Hai.version.should.match(/^\d+\.\d+\.\d+$/);

describe('Hai', function() {
  var app = express()
    , server = http.Server(app)
    , port
    , myHaiPath = '/hai';

  app.use(app.router);

  before(function(done) {
    server.listen(function() {
      port = this.address().port
      done();
    });
  });

  after(function(done) {
    server.close(done);
  });

  it('should say things to to other things... periodically', function(done) {
    var hai = new Hai({
      app: app,
      maxInterval: 5 * 1000,
      otherHais: ['http://localhost:' + port + myHaiPath],
      myHaiPath: myHaiPath
    });

    this.timeout = hai.maxInterval * 2;

    var hais = 0;

    hai.on('hai', function(body) {
      should.exist(body.hai);
      if(++hais === 2) {
        hai.bai();
        done();
      }
      (hais > 2).should.not.be.ok;
    });
  });
});