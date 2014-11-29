var request = require('request')
  , Emitter = require('events').EventEmitter;

function Hai(params) {
  var app = params.app
    , maxInterval = params.maxInterval || 5 * 60 * 1000
    , myHaiPath = params.myHaiPath || '/hai'
    , otherHais = params.otherHais || []
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
          try {
            self.emit('hai', JSON.parse(body));
          }
          catch(err) {
            // crappy html or something got sent back
            console.error(err, body);
          }
        });
    });

    self.moarHai = setTimeout(hai, Math.floor(Math.random() * maxInterval));
  }

  if(otherHais && otherHais.length > 0) hai();

  console.log('hai');
}

Hai.prototype.__proto__ = Emitter.prototype;

/**
 * Library version.
 */

Hai.version = require('../package').version;

Hai.prototype.bai = function() {
  clearTimeout(this.moarHai);
};

Hai.me = function(app) {
  var otherHais = [];
  while(process.env['OTHER_HAI' + otherHais.length]) otherHais.push(process.env['OTHER_HAI' + otherHais.length]);

  var params = {
    app: app,
    maxInterval: process.env.HAI_MAX_INTERVAL,
    otherHais: otherHais,
    myHaiPath: process.env.MY_HAI_PATH
  };

  return new Hai(params);
}

module.exports = Hai;