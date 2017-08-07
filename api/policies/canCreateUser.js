/**
 * Created by Puers on 06/08/2017.
 */
module.exports = function(req, res, next) {

  var canCreate=(req.session.user && req.session.user.level>=sails.config.publicData.canCreateUserLevel);

  if(canCreate)
  {
    return  next();
  }

    return res.json(403,res.i18n("usuario.areaNotAuthorized"));


};
