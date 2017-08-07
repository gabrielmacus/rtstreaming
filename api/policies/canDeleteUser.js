/**
 * Created by Puers on 06/08/2017.
 */
module.exports = function(req, res, next) {

if(req.session.user && req.session.user.level>=sails.config.publicData.canDeleteUserLevel)
{
  return  next();
}

return res.json(403,res.i18n("usuario.areaNotAuthorized"));

};
