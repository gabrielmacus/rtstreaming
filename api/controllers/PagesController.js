/**
 * HomeController
 *
 * @description :: Server-side logic for managing Homes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
const async = require('async');
module.exports = {

  index: function(req,res){

    var templateData={layout: 'layouts/layout', bodyClasses: ["home"],user:req.session.user};
    var s= req.param("s");
    templateData.s = s;

    return     res.view('home/cuerpo', templateData);


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
          bodyClasses: ["admin-usuarios","listado","user"],
          user:req.session.user,
          items:usuarios,
          top:'../templates/listado/top.ejs',
          cuerpo:'../templates/listado/cuerpo.ejs',
          bottom:'../templates/listado/bottom.ejs'
          ,model:'user',
          active:'usuarios'
        };

        return res.view('usuarios/cuerpo',templateData)

      });

  }
  ,
  usuario: function(req,res)
  {

    /*
    var templateData=
    {
      layout: 'layouts/admin-layout',
      bodyClasses: ["admin-usuarios","guardar"],
      user:req.session.user,
      cuerpo:'objetos/guardar/cuerpo.ejs',
      top:'objetos/guardar/top.ejs',
      bottom:'objetos/guardar/bottom.ejs',
      active:'usuarios'
    };*/

    var templateData=
    {
      layout: 'layouts/admin-layout',
      bodyClasses: ["admin-usuarios","guardar"],
      user:req.session.user,
      cuerpo:'../templates/form/cuerpo.ejs',
      active:'usuarios',
      top:'../templates/form/top.ejs',
      form:
      {

        id:'save-user',
        model:'user',
        components: [

          {
            element: 'input',
            type: 'text',
            label: req.__("usuarios.username"),
            attribute: "username",
            ngIf:"!user.level || user.level > 1"
          },
          {
            ngIf:"user.level == 1",
            element: 'select',
            multiple:true,
            options:
              [
                {dia: res.__("lun") ,id:1},
                {dia: res.__("mar"),id:2},
                {dia:res.__("mie"),id:3},
                {dia: res.__("jue"),id:4},
                {dia: res.__("vie"),id:5},
                {dia: res.__("sab"),id:6},
                {dia:res.__("dom"),id:7}
              ],
            shownData:'dia',
            label: req.__("usuarios.generateEvery"),
            attribute: "autogenerateSpan"
          }
          ,
          {
            element: 'input',
            type: 'password',
            label: req.__("usuarios.contrasena"),
            attribute: "password",
            ngIf:"user.level > 1"
          }
          ,
          {
            element: 'input',
            type: 'email',
            label: req.__("usuarios.email"),
            attribute: "email"
          }
          ,
          {
            element: 'input',
            type: 'text',
            label: req.__("usuarios.nombre"),
            attribute: "name"
          }
          ,
          {
            element: 'input',
            type: 'text',
            label: req.__("usuarios.apellido"),
            attribute: "surname"
          },
          {
            element: 'select',
            options:UserService.getLevels(req),
            shownData:'nombre',
            label: req.__("usuarios.niveles"),
            attribute: "level",
            saveId:true
          }
        ]

      }
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
      return res.view('usuarios/cuerpo',templateData)
    });


  },
  transmisiones: function (req,res) {
var d=    {
  1:res.__("lun"),
  2:res.__("mar"),
  3:res.__("mie"),
  4:res.__("jue"),
  5:res.__("vie"),
  6:res.__("sab"),
  7:res.__("dom")
  };

    Streaming.find().exec(
      function(err,results){


        if(err)
        {
          sails.log.error(err);

          return res.json(500,res.i18n("stream.errorListar"));

        }

        var transmisiones=[];


        for (var k in results)
        {
          var transmision ={};

          transmision.p1= results[k].title || "&nbsp;";
          transmision.p2= "&nbsp;";


          var days="&nbsp;";

          if(results[k].startStreamingSpan && results[k].startStreamingSpan.length)
          {

            days =results[k].startStreamingSpan.map(
              function (el) {

                return d[el.day]+" ";
              }
            );
          }

          transmision.p3 =days;

          transmision.id=results[k].id;
          transmision.type='streaming';

          transmisiones.push(transmision);

        }




        var templateData=
        {
          layout: 'layouts/admin-layout',
          bodyClasses: ["admin-usuarios","listado","streaming"],
          user:req.session.user,
          top:'../templates/listado/top.ejs',
          cuerpo:'../templates/listado-streamings/cuerpo.ejs',
          bottom:'../templates/listado/bottom.ejs',
          active:'transmision',
          items:transmisiones,
          model:'streaming'
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
                attribute: "title"
              },
              {
                element: 'select',
                label: req.__("comandos.entrada"),
                attribute: "inputCmd",
                multiple:true,
                oiOptions:{
                  newItem: true
                }
              },

              {

                element: 'select',
                label: req.__("comandos.salida"),
                attribute: "outputCmd",
                multiple:true,
                oiOptions:{
                  newItem: true
                }

              },
              {
                element: 'input',
                type:'text',
                label: req.__("stream.url"),
                attribute: "url"
              },

              {
                element: 'period',
                label: req.__( "stream.diasActiva"),
                attribute: "startStreamingSpan"
              }
              ,
              /*
              {
                element: 'select',
                multiple:true,
                options:
                  [
                    {dia: res.__("lun") ,id:1},
                    {dia: res.__("mar"),id:2},
                    {dia:res.__("mie"),id:3},
                    {dia: res.__("jue"),id:4},
                    {dia: res.__("vie"),id:5},
                    {dia: res.__("sab"),id:6},
                    {dia:res.__("dom"),id:7}
                  ],
                shownData:'dia',
                label: req.__("stream.diasActiva"),
                attribute: "startStreamingSpan"
              }*/

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

              templateData.item=streaming;

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

