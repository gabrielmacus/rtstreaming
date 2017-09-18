/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  enviarMensaje:function (req,res) {

    //TODO
    if(req.isSocket)
    {

      var data  =req.allParams();

      var msg={id:Date.now(),text:data.text,to:data.to,from:req.session.user.id,type:'msg',time:TimeService.now()};
      User.message(data.to,msg);
      User.message(req.session.user.id,msg);



      return res.ok();

    }
    else {
      return res.badRequest();
    }
  }
  ,
  marcarLeido:function (req,res) {

    if(req.isSocket)
    {

      var data  =req.allParams();

      var msg={seen:data.seen,to:data.to,from:req.session.user.id,type:'seen',time:TimeService.now()};
      User.message(data.to,msg);

      return res.ok();

    }
    else {
      return res.badRequest();
    }


  },
  usuariosOnline:function (req,res) {

    if(req.isSocket)
    {

  UserService.getConnectedUsers(function (err,_users) {

    if(err)
    {
      _users=[];
    }
    sails.log.info("--- Enviando usuarios en linea "+req.session.user.id+" ---");

    console.log(_users);

    sails.log.info("----------------------------------------------------------");


    User.message(req.session.user.id,{type:'online-users',users:_users});

    return res.ok();

      },req.session.user.id);



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


      var redirect=(req.cookies['_r'])?req.cookies['_r']:false;

        res.clearCookie("_r");


      return res.json({user:result,redirect:redirect});


    })

  },
  salir:function(req,res)
  {

   var sid = ParseService.getValueFromHeader(req.headers.cookie,'sails.sid');

    UserService.desconectarSesiones(req.session.user);

    res.clearCookie("user_tk");

    return res.redirect("/");
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

