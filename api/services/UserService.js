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
  cambiarEstadoDeConexion:function (user,sessionId,connected,callback) {
    //Busco todos los usuarios, me sirve para mas adelante, si tengo amigos por ej, solo enviarle el msg de conexion a ellos y no a todos los sockets


   var  userId = user.id;


    var connectionChanged= false;

    if(connected)
    {
      //Si me estoy conectando

      if(!connectedUsers[userId])
      {
        connectedUsers[userId]={};
      }

      if(!connectedUsers[userId]["sessions"]) {
        connectedUsers[userId]["sessions"] = [];
      }

      delete user.password;
      connectedUsers[userId]["user"]=user;
      connectedUsers[userId]["sessions"].push({date:TimeService.now(),id:sessionId});

      connectionChanged = true;
    }
    else if(connectedUsers[userId] &&  connectedUsers[userId]["sessions"] )
    {
      //si me estoy desconectando

      var _session =  connectedUsers[userId]["sessions"].findIndex(function (el) {

        return el.id == sessionId;
      });

      if(_session > -1)
      {
        connectedUsers[userId]["sessions"].splice(_session,1);
      }

      if( connectedUsers[userId]["sessions"].length ==0)
      {
        sails.log.info("No estoy en ninguna otra sesión");
        //No estoy conectado en ninguna otra sesion
        delete  connectedUsers[userId];

        connectionChanged = true;
      }


    }

    if(connectionChanged)
    {
      for(var u in connectedUsers)
      {//Notifico a los usuarios pertinentes de mi conexion (excepto a mi)

        if(u != userId)
        {

          User.message(u, {type:'status',user:user,status:connected});
        }

      }
    }

    if(typeof callback === "function"){
      return callback(true);
    }


  },

  desconectarSesiones:function (user) {

    delete connectedUsers[user.id];

    for(var u in connectedUsers)
    {//Notifico a los usuarios pertinentes de mi conexion (excepto a mi)

      if(u != user.id)
      {

        User.message(u, {type:'status',user:user,status:false});
      }

    }

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
