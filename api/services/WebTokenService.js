/**
 * Created by Puers on 02/07/2017.
 */
var jwt = require('jsonwebtoken');

module.exports.generarToken = function(payload, options) {
  
  var token = jwt.sign(payload,  sails.config.salt, options);

  return token;
};

module.exports.verificarToken = function(token, callback) {
  return jwt.verify(token, sails.config.salt, {}, callback);
};
