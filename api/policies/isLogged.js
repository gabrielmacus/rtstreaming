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
        
       res.cookie('_r',req.path );
        
        var path= req.path.split("/")[1];

        if(path=='admin')
        {
          return      res.redirect("/admin/ingresar");

        }
        else
        {
          return      res.redirect("/ingresar");
        }
      }


    }


    if(!req.isSocket)
    {
      var clientIp=req.connection.remoteAddress;

      if(clientIp != result.ip)
      {

        return res.forbidden(req.__("usuario.noAutenticado"));
      }

    }



    return next();
  });



};
