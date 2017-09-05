/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  enviarMensaje:function (req,res) {

    if(req.isSocket)
    {



   var data  =req.allParams();

      User.message(data.to,{text:data.text,to:data.to,from:req.session.user.id,type:'msg',time:Date.now()});

      return res.ok();

    }
    else {
      return res.badRequest();
    }
  }
  ,
  usuariosOnline:function (req,res) {

    if(req.isSocket)
    {

      var _users = UserService.getConnectedUsers();



      User.message(req.session.user.id,{type:'online-users',users:_users});

      return res.ok();

    }
    else {
      return res.badRequest();
    }
  },
  login:function (req,res) {


    var userEmail =(req.param("user"))?req.param("user"):"";
    var password = req.param("password");

    UserService.ingresar(userEmail,password,function (result) {


      if(result.error)
      {
        return res.json(result.code,res.i18n(result.error));
      }

      var user=result[0];

      delete user.password;

      //Guardo la ip del cliente en el token para mayor seguridad
      user.ip=req.connection.remoteAddress;

      var token=WebTokenService.generarToken(user);
      res.cookie('user_tk',token);





      return res.json(result);


    })

  },
  salir:function(req,res)
  {

   var sid = ParseService.getValueFromHeader(req.headers.cookie,'sails.sid');


    UserService.cambiarEstadoDeConexion(req.session.user,sid,false,function () {
      res.clearCookie("user_tk");
      return res.redirect("/");


    })
  },
  connect:function(req,res)
  {
    // Make sure this is a socket request (not traditional HTTP)
    if (!req.isSocket) {
      return res.badRequest();
    }

    if(req.session.user.id)
    {
      UserService.cambiarEstadoDeConexion(req.session.id,req.session.user.id,true,function (result) {

      if(result.error)
      {
        return   res.json(result.code,res.i18n(result.error));
      }

      return res.ok();

    });

    }
    else
    {
      return res.json(403,res.__( "usuario.noAutenticado"));
    }



  }


};

