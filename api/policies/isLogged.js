/**
 * Created by Gabriel on 04/08/2017.
 */

module.exports = function(req, res, next) {


  var token =req.cookies.user_tk ||req.headers['x-access-token'];

  WebTokenService.verificarToken(token,function(err,result) {

    req.session.user=result;


    if(err)
    {

      if(req.method=='POST')
      {
        return res.forbidden(req.__("usuario.noAutenticado"));
      }
      else
      {

        if(req.path=='/')
        {

          return      res.redirect("/ingresar");
        }
        else
        {
          return      res.redirect("/admin/ingresar");
        }
      }


    }


    return next();
  });



};
