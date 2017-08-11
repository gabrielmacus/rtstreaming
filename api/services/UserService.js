/**
 * Created by Gabriel on 04/08/2017.
 */
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
    cambiarEstadoDeConexion:function (sessionId,userId,connected,callback) {
      //Busco todos los usuarios, me sirve para mas adelante, si tengo amigos por ej, solo enviarle el msg de conexion a ellos y no a todos los sockets
      User.find( {}).exec(
        function (err,result) {
          if(err)
          {
            sails.log.error(err);
            callback({error:'usuario.errorConectar',code:500});

          }
          var type = (connected)?'connected':'disconnected';

          /*** Guardo/Elimino mi conexion, por ahora en la db, deberia usar redis si tengo mejor infraestructura***/

          var me  = result.filter(
            function (el) {
              return el.id == userId;
            }
          );


          if(!me.connections[sessionId] && connected) {
            //No existe la sesion

            result.connections.push({id:sessionId});
          }
          else if(me.connections[sessionId] && !connected)
          {
            //Existe y me desconecto
          }


          User.update({id:userId},me).exec(
            function (err,updatedUser) {
              if(err)
              {
                sails.log.error(err);
               return  callback({error:'usuario.errorConectar',code:500});

              }


              /*** **/
              for(var k in result)
              {//Notifico a los usuarios pertinentes de mi conexion (excepto a mi)
                var user  = result[k];

                if(user.id != userId)
                {

                  User.message(user.id, {type:type,user:userId});
                }

              }


              if(callback)
              {
                callback({});
              }



            }
          );


        }
      );
    }

}
