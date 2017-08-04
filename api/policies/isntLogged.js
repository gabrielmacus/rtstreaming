/**
 * Created by Gabriel on 04/08/2017.
 */
//Si no estoy logueado....
module.exports = function(req, res, next) {

  var token =req.cookies.user_token ||req.headers['x-access-token'];

  WebTokenService.verificarToken(token,function(err,result) {



    if(err)
    {
      return next();
      
    }

    return res.redirect('/');
  });


  
};
