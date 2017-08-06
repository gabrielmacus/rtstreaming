/**
 * Created by Puers on 05/08/2017.
 */
/**
 * Created by Puers on 05/08/2017.
 */

/**
 * Chequeo si soy  superadministrador
 * @param req
 * @param res
 * @param next
 */
module.exports = function(req, res, next) {


  if(req.session.user && req.session.user.level>=sails.config.publicData.userLevels.superAdminLevel)
  {
    return  next();
  }

  return res.json(403,res.i18n("usuario.areaNotAuthorized"));

};
