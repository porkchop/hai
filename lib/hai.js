var request = require('request')
  , Emitter = require('events').EventEmitter;

function Hai(params) {
  var app = params.app
    , maxInterval = params.maxInterval || 5 * 60 * 1000
    , myHaiPath = params.myHaiPath || '/hai'
    , otherHais = params.otherHais || [myHaiPath]
    , self = this;

  app.get(myHaiPath, function(req, res, next) {
    res.json(200, {hai: req.query.hai});
  });

  function hai() {
    otherHais.forEach(function(otherHai) {
      request
        .get({
          url: otherHai,
          qs: {hai: Math.floor(Math.random() * 1000000)}
        }, function(err, response, body) {
          self.emit('hai', JSON.parse(body));
        });
    });

    self.moarHai = setTimeout(hai, Math.floor(Math.random() * maxInterval));
  }

  hai();
}

Hai.prototype.__proto__ = Emitter.prototype;

/**
 * Library version.
 */

Hai.version = require('../package').version;

Hai.prototype.bai = function() {
  clearTimeout(this.moarHai);
};

module.exports = Hai;