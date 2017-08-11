/**
 * Created by Puers on 06/08/2017.
 */
module.exports = function(req, res, next) {

  var permissions = req.options.model || req.options.permissions || false;

  if(!permissions || req.session.user && req.session.user.level >= sails.config.minimumLevels.delete[permissions])
  {
    return  next();
  }
return res.json(403,res.i18n("usuario.areaNotAuthorized"));

};
