/**
 * Created by Puers on 07/08/2017.
 */
//Chequeo si el usuario que edito/creo tiene menor nivel que el logueado, o es administrador
//TODO refactor code
const async= require('async');
module.exports=
  function(req, res, next) {
  //Si estoy creando un usuario con un rango menor al mio, o si soy superadmnistrador
  var lessLevel= (req.session.user  && ( req.param("level") && req.param("level") < req.session.user.level ||req.session.user.level >= sails.config.publicData.userLevels.superAdminLevel));
    if(!lessLevel)
    {
      return res.json(400,res.i18n("usuario.shouldBeLessLevel"));
    }

    async.waterfall([
      function(callback)
      {
        if(req.param("id"))
        {

          User.find({id:[req.param("id")]}).exec(function(err,result)
          {

            //Chequeo si el usuario que edito tiene menor nivel que el logueado o si soy administrador
            var  canEdit=req.session.user && result[0].level< req.session.user.level  ||req.session.user.level >= sails.config.publicData.userLevels.superAdminLevel;

            if(!canEdit)
            {
              return res.json(400,res.i18n("usuario.shouldBeLessLevel"));
            }
            callback();

          });

        }
        else
        {
          callback();
        }
      }

    ], function (err, result) {
      // result now equals 'done'
      next();
    });






}
