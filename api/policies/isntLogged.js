/**
 * Created by Gabriel on 04/08/2017.
 */
//Si no estoy logueado....
module.exports = function(req, res, next) {

  var token =req.cookies.user_tk ||req.headers['x-access-token'];

  WebTokenService.verificarToken(token,function(err,result) {


    if(err)
    {
      return next();

    }
    console.log(result);
    if(result.nivel > 1)
    {
      return res.redirect('/');
    }
    else
    {
      return res.redirect('/admin');
    }

  });



};
