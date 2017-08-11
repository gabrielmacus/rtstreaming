/**
 * HomeController
 *
 * @description :: Server-side logic for managing Homes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
const async = require('async');
module.exports = {

  index: function(req,res){



    res.view('home/cuerpo', {layout: 'layouts/layout', bodyClasses: ["home"],user:req.session.user});
   },
  login: function(req,res)
  {

      res.view('login/cuerpo',{layout: 'layouts/login-layout', bodyClasses: ["login"],form:'objetos/login-form.ejs'})
  },
  loginAdmin: function(req,res)
  {
    res.view('login/cuerpo',{layout: 'layouts/login-layout', bodyClasses: ["login-admin"],form:'objetos/admin-login-form.ejs'})
  }
  ,admin: function(req,res)
  {
    var templateData={home:'active',layout: 'layouts/admin-layout', bodyClasses: ["admin"], user:req.session.user,active:'inicio'};
    res.view('admin/cuerpo',templateData)
  },
  usuarios: function(req,res)
  {

    User.find().exec(
      function(err,results){


        if(err)
        {
          sails.log.error(err);

          return res.json(500,res.i18n("usuarios.errorListar"));

        }

        var templateData=
        {
          layout: 'layouts/admin-layout',
          bodyClasses: ["admin-usuarios","listado"],
          user:req.session.user,
          users:results,
          top:'objetos/listado/top.ejs',
          cuerpo:'objetos/listado/cuerpo.ejs',
          bottom:'objetos/listado/bottom.ejs'
          ,
          active:'usuarios'
        };

        return res.view('usuarios/cuerpo',templateData)

      });

  }
  ,
  usuario: function(req,res)
  {

    var templateData=
    {
      layout: 'layouts/admin-layout',
      bodyClasses: ["admin-usuarios","guardar"],
      user:req.session.user,
      cuerpo:'objetos/guardar/cuerpo.ejs',
      top:'objetos/guardar/top.ejs',
      bottom:'objetos/guardar/bottom.ejs',
      active:'usuarios'
    };

    async.waterfall([
      function(callback){

        if(req.param("id"))
        {
          //Edicion de usuario

          User.find({id:[req.param("id")]}).exec(
            function(err,results){


              if(err)
              {   sails.log.error(err);
              return  res.json(500,res.i18n("usuarios.errorEditar"));
              }

              var user=results[0];

              console.log(user);
              delete user.password;
              templateData.editUser=user;

              callback();
            }
          )

        }
        else
        {
          //Creacion de usuario
          callback();
        }


      }
    ], function (err, result) {
      // result now equals 'done'
      return res.view('usuarios/cuerpo',templateData)
    });


  },
  transmisiones: function (req,res) {


    Streaming.find().exec(
      function(err,results){


        if(err)
        {
          sails.log.error(err);

          return res.json(500,res.i18n("stream.errorListar"));

        }

        var templateData=
        {
          layout: 'layouts/admin-layout',
          bodyClasses: ["admin-usuarios","guardar"],
          user:req.session.user,
          cuerpo:'objetos/listado/cuerpo.ejs',
          top:'objetos/listado/top.ejs',
          bottom:'objetos/listado/bottom.ejs',
          active:'transmision'
        };
        return res.view('transmisiones/cuerpo',templateData)

      });



  }

};

