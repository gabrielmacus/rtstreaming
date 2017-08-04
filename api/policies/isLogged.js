/**
 * Created by Gabriel on 04/08/2017.
 */

module.exports = function(req, res, next) {


  var token =req.cookies.user_token ||req.headers['x-access-token'];

  WebTokenService.verificarToken(token,function(err,result) {



    if(err)
    {


      if(req.method=='POST')
      {
        return res.forbidden(req.__("usuario.noAutenticado"));
      }
      else
      {
        return      res.redirect("/ingresar");
      }


    }


    return next();
  });



};
