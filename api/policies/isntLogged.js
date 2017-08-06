/**
 * Created by Gabriel on 04/08/2017.
 */
//Si no estoy logueado....
module.exports = function(req, res, next) {

  var token =req.cookies.user_tk ||req.headers['x-access-token'];

  WebTokenService.verificarToken(token,function(err,result) {


    if(err)
    {
    //Si no estoy logueado, sigo al login
      return next();

    }

    if(result.level >= sails.config.publicData.panelLevel)
    {
      return res.redirect('/admin');
    }
    else
    {
      return res.redirect('/');
    }

  });



};
