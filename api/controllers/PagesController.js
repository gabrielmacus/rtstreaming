/**
 * HomeController
 *
 * @description :: Server-side logic for managing Homes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

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
    var templateData={layout: 'layouts/admin-layout', bodyClasses: ["admin"], user:req.session.user, publicData:sails.config.publicData};
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
          bodyClasses: ["admin-usuarios"],
          user:req.session.user,
          users:results,
          publicData:sails.config.publicData
        };

        return res.view('usuarios/cuerpo',templateData)

      });

  }
};

