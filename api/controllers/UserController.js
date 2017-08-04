/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {


  login:function (req,res) {


    var userEmail =(req.param("user"))?req.param("user"):"";
    var password = req.param("password");

    UserService.ingresar(userEmail,password,function (result) {


      if(result.error)
      {
        return res.json(result.code,res.i18n(result.error));
      }

      res.cookie('user_tk',result);

      return res.json(result);


    })

  }


};

