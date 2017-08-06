/**
 * Created by Puers on 06/08/2017.
 */

//No me puedo eliminar a mi mismo
module.exports = function(req, res, next) {


  if(!req.session.user || req.param('id') == req.session.user.id)
  {
    return res.json(400,res.__("usuarios.cantDeleteSelf"));
  }

  return next();



};
