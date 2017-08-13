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

        var usuarios=[];


        for (var k in results)
        {
          var usuario ={};

          usuario.p1= results[k].name || "&nbsp;";
          usuario.p2= results[k].surname || "&nbsp;";
          usuario.p3 = results[k].username;
          usuario.id=results[k].id;
          usuario.type='user';

          usuarios.push(usuario);

        }




        var templateData=
        {
          layout: 'layouts/admin-layout',
          bodyClasses: ["admin-usuarios","listado"],
          user:req.session.user,
          items:usuarios,
          top:'../templates/listado/top.ejs',
          cuerpo:'../templates/listado/cuerpo.ejs',
          bottom:'../templates/listado/bottom.ejs'
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
          active:'transmision',
          transmisiones:results
        };
        return res.view('transmisiones/cuerpo',templateData)

      });



  },
  transmision: function(req,res)
  {
    var templateData=
    {
      layout: 'layouts/admin-layout',
      bodyClasses: ["admin-transmision","guardar"],
      user:req.session.user,
      cuerpo:'../templates/form/cuerpo.ejs',
      active:'transmision',
      top:'../templates/form/top.ejs',
      form:
          {

            id:'save-streaming',
            model:'streaming',
            components: [

              {
                element: 'input',
                type: 'text',
                label: req.__("titulo"),
                attribute: "titulo"
              }

            ]

           }

    };

    async.waterfall([
      function(callback){

        if(req.param("id"))
        {
          //Edicion de usuario

          Streaming.find({id:[req.param("id")]}).exec(
            function(err,results){


              if(err)
              {   sails.log.error(err);
                return  res.json(500,res.i18n("transmision.errorEditar"));
              }

              var streaming=results[0];

              templateData.item=user;

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
      return res.view('transmisiones/cuerpo',templateData)
    });

  }
  /*,
  test:function (req,res) {

        var items=
      [
        {
          type:'user',
          p1:'Martin',
          p2:'Martinez',
          p3:'tinchoou2'
        },
        {
          type:'user',
          p1:'Gabriel',
          p2:'Macs',
          p3:'gamac'
        }
      ];
    res.view('templates/listado/cuerpo', {layout: 'layouts/admin-layout', bodyClasses: ["home"],user:req.session.user,items:items});

  }*/

};

