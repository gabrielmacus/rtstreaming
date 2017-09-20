/**
 * Created by Gabriel on 04/08/2017.
 */

//var ObjectID = require('mongodb').ObjectID;
var async = require('async');
const crypto = require('crypto');
var asyncLoop = require('node-async-loop');

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
      var session={};

      async.waterfall([
        function (cb) {
          Session.findOrCreate({userId:userId},{userId: userId,connections:[]}).exec(
            function (err,result) {

              if(err)
              {

                if(callback){

                  return callback({error:"usuarios.sessionError",code:500});
                }
                else
                {
                  return false;
                }

              }


              var fetchedSession = (typeof result == 'object')?result : result[0];

              if(connected)
              {
                //Si me estoy conectando

                delete user.password;

                fetchedSession["user"]=user;
                fetchedSession["connections"].push({date:new Date(),id:sessionId});
                connectionChanged = true;


                Session.update({id: fetchedSession.id},fetchedSession).exec(
                  function (err,result) {

                    if(err)
                    {

                      if(callback){
                        return callback({error:"usuarios.sessionError",code:500});
                      }
                      else
                      {
                        return false;
                      }

                    }

                    cb();

                  }
                );

              }
              else
              {
                //si me estoy desconectando

                var _session = fetchedSession["connections"].findIndex(function (el) {

                  return el.id == sessionId;
                });

                if(_session > -1)
                {
                  fetchedSession["connections"].splice(_session,1);

                  Session.update({id: fetchedSession.id},fetchedSession).exec(
                    function (err,result) {


                      if(err)
                      {

                        if(callback){
                          return callback({error:"usuarios.sessionDisconnectError",code:500});
                        }
                        else
                        {
                          return false;
                        }

                      }


                      return cb();

                    }
                  );


                }

                if( fetchedSession["connections"].length ==0)
                {
                  //No estoy conectado en ninguna otra sesion

                  Session.destroy({id: fetchedSession.id}).exec(
                    function (err,result) {

                      if(err)
                      {

                        if(callback){
                          return callback({error:"usuarios.sessionDisconnectError",code:500});
                        }
                        else
                        {
                          return false;
                        }

                      }

                      callback();

                    }
                  );

                  connectionChanged = true;
                }


              }





            }
          );

        },
        function () {


          UserService.getConnectedUsers(
            function (err,result) {


              if(err)
              {

                if( callback){
                  return callback({error:"usuarios.sessionError",code:500});
                }
                else
                {
                  return false;
                }

              }



              if(result.length)
              {
                for(var u in result)
                {//Notifico a los usuarios pertinentes de mi conexion (excepto a mi)

                  var r = result[u];
                  if(r.userId != userId)
                  {

                    User.message(r.userId, {type:'status',user:user,status:connected});
                  }

                }
              }

              if(callback){
                return callback(true);
              }


            },user.id
          );




        }
      ]);




  }

/*  cambiarEstadoDeConexion:function (user,sessionId,connected,callback) {
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


  }*/,

  desconectarSesiones:function (user) {

    Session.destroy({userId:user.id}).exec(
      function (err,result) {

        if(err)
        {
          sails.log.error(err);
        }

        UserService.getConnectedUsers(
          function(err,results){

            if(!err)
            {
              for(var u in results)
              {//Notifico a los usuarios pertinentes de mi conexion (excepto a mi)

                  User.message(results[u].userId, {type:'status',user:user,status:false});


              }

            }

          },user.id
        );


      }
    );


  },

  getConnectedUsers:function (callback,me) {

    var filter={ };//Aca deberia filtrar por mis contactos o amigos

    if(me)
    {
      filter.userId =  { '!' : me };
    }
    Session.find(filter).exec(
      function (err,results) {

        if(callback)
        {
         return callback(err,results);
        }

      }
    );



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
  },

  /**
   *
   * @param userId
   * @param to
   * @param data
   * @param type En memoria 1/En disco 2
   * @param callback
   */
  saveConversation: function (userId,to,data,type,callback) {

    c = (type && type == 2)?Conversation:_Conversation;

    c.findOrCreate({or:[{user1:userId},{user2:userId}]}, {data:[],user1:userId,user2:to})
      .exec(function (err, results){
        if(err)
        {
          sails.log.debug(err);
          return callback({error:"chat.errorSaving",code:500});
        }
        var conversation = (results.length)?results[0]:results;

        if(data.length)
        {
          conversation.data=conversation.data.concat(data);
        }
        else
        {
          conversation.data.push(data);
        }




        c.update({id:conversation.id},conversation).exec(
          function (err,result) {

            console.log(result);
            if(err)
            {      sails.log.debug(err);
              return callback({error:"chat.errorSaving",code:500});
            }
            if(callback)
            {
              return callback(result)
            }
          }
        );

      });
  },
  loadConversations: function (userId,callback) {

    var filter ={or:[{user1:userId},{user2:userId}]};

    _Conversation.find(filter)
      .exec(function(err,results)
    {


      if(err)
      {
        sails.log.debug(err);
      return  callback({error:"chat.errorRetrievingChats",code:500});
      }


      async.waterfall(
        [
          function (callback) {

            if(results.length)
            {
              asyncLoop(results, function (item, next)
                {

                  var to = (item.user1==userId)?item.user2:item.user1;
                  UserService.saveConversation(userId,to,item.data,2, function (result) {

                    if(result.error)
                    {
                      return  callback({error:"chat.errorRetrievingChats",code:500});
                    }

                    next();


                  });

                },
                function (err) {
                  if(err)
                  {
                    return  callback({error:"chat.errorRetrievingChats",code:500});
                  }

                  callback();

                });
            }
            else
            {
              callback();
            }

          },
          function () {
            Conversation.find(filter)
              .exec(
              function (err,results) {
                if(err)
                {
                  return  callback({error:"chat.errorRetrievingChats",code:500});
                }

                _Conversation.destroy(filter).exec(
                  function () {
                    return callback(results);
                  }
                );

              }
            );

          }
        ]
      );





    });



  },
  markAsSeen:function (userId,to,msgId,callback) {
var queryCallback = function (err, results, c) {

    if(err)
    {
      callback({error:"chat.errorSeen",code:500});
    }

    if(results.length)
    {
     var idx= results[0].data.findIndex(function (el) {
        return el.id == msgId;
      })

      results[0].data[idx].seen = TimeService.now();

      c.update({id:results[0].id},results[0]).
        exec(
        function (err,results2) {

          if(err)
          {
            callback({error:"chat.errorSeen",code:500});
          }

          return callback(results2);
        }
      );


    }


}
    var filter = {or:[{user1:to,user2:userId},{user1:userId,user2:to}]};
    _Conversation.find(filter)
      .exec(
      function(err,results)
      {
        queryCallback(err,results,_Conversation);

      }
    );

    Conversation.find(filter)
      .exec(
      function(err,results)
      {
        queryCallback(err,results,Conversation);

      }
    );
  }

}
