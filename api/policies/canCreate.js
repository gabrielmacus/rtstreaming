/**
 * Created by Puers on 06/08/2017.
 */
module.exports = function(req, res, next) {


  var permissions =  req.options.permissions || req.options.model  || false;

  /*
  console.log(permissions);
  console.log(req.session.user);
  console.log( sails.config.minimumLevels.create[permissions]);*/
  if(!permissions || req.session.user && req.session.user.level >= sails.config.minimumLevels.create[permissions])
  {
    return  next();
  }

    return res.json(403,res.i18n("usuario.areaNotAuthorized"));


};
