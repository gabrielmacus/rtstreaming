/**
 * Created by Gabriel on 04/08/2017.
 */

var connectedUsers={};
const crypto = require('crypto');
module.exports=
{
    ingresar:function(userEmail,password,callback)
    {
      if(!userEmail)
      {
        return callback({code:400,error:"login.noUsername"});
      }

        //Si es nivel 1, puede acceder solo con el usuario, q es generado automaticamente
        var query={ or: [{username:userEmail},{email:userEmail}]};


        if(password)
        {
          var hash = crypto.createHash(sails.config.hashAlgo);
          hash.update(password);
          password = hash.digest('hex');

          query.password=password;
        }
        else
        {
          query.level=1;
        }


        User.find(query).
            exec(function (err,results) {


            if(err)
            {
                sails.log.error(err);

              return callback({code:500,error:"login.queryError"});

            }

          if(results.length)
          {
            return  callback(results);
          }
          else
          {
            return  callback({code:403,error:'login.wrongParams'});
          }



        });
    },
  /**
   *
   * @param connected Indico si mi estado es conectado/desconectado (true/false)
   * @param callback
     */
  cambiarEstadoDeConexion:function (userId,connected,callback) {
    //Busco todos los usuarios, me sirve para mas adelante, si tengo amigos por ej, solo enviarle el msg de conexion a ellos y no a todos los sockets
    User.find( {}).exec(
      function (err,result) {
        if(err)
        {
          sails.log.error(err);
          callback({error:'usuario.errorConectar',code:500});

        }
        var type = (connected)?'connected':'disconnected';


        var me  = result.filter(
          function (el) {
            return el.id == userId;
          }
        )[0];


        var connectionChanged= false;
        if(connected && !connectedUsers[me.id])
        {
          //Si me estoy conectando
           connectedUsers[me.id] = me;
           connectionChanged = true;
        }

        if(!connected && connectedUsers[me.id])
        {
          //si me estoy desconectando
          delete connectedUsers[me.id];
          connectionChanged = true;
        }



      if(connectionChanged)
      {
        for(var k in result)
        {//Notifico a los usuarios pertinentes de mi conexion (excepto a mi)
          var user  = result[k];

          if(user.id != userId)
          {

            User.message(user.id, {type:type,user:userId});
          }

        }
      }



      }
    );
  },

  getTokenFromHeader:function (header) {

    userTk=false;
    if(header)
    {
      userTk = header.split(";");

      userTk = userTk.map(function (el) {

        var split = el.split("=");

        return {key:split[0],value:split[1]};

      });

      userTk = userTk.filter(function (el) {
        return el.key == 'user_tk';
      });

      if(userTk && userTk.length >0)
      {
        userTk = userTk[0].value;
      }
    }
    return userTk;

  },

  getConnectedUsers:function () {

  
    return connectedUsers;

  },

  getLevels:function (req) {


    var userLevels=[];

    for (k in sails.config.userLevels)
    {
      var level={};

      level.nombre = req.__("usuarios.niveles."+k);
      level.id=req.__(sails.config.userLevels[k]);

      userLevels.push(level);
    }


    return userLevels;
  }

}
