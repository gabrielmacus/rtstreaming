/**
 * Created by Gabriel on 04/08/2017.
 */
module.exports=
{
    ingresar:function(userEmail,password,callback)
    {

      if(!password)
      {
        return callback({code:400,error:"login.noPassword"});
      }

        //Si es nivel 1, puede acceder solo con contraseña
        var query={ or: [{username:userEmail},{email:userEmail},{level:1}],password:password};
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
    }
}
