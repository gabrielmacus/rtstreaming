/**
 * Created by Gabriel on 11/09/2017.
 */
const fs=require('fs-extra');
module.exports= {


  watch:function (type,path,timeout,callback,timedOutCallback) {

    if(typeof type != 'string')
    {
      return false;
    }

    var i=0;

    timeout = timeout*1000;


  var interval= setInterval(
    function () {

      switch (type)
      {
        case 'exists':



          fs.pathExists(path).then(function (exists) {

            if( exists && typeof callback == 'function')
            {


              callback();
              return clearInterval(interval);

            }

          });

          break;
      }
      i+=1000;

      if(i >= timeout)
      {

        if(typeof timedOutCallback == 'function')
        {
          timedOutCallback();
        }
        return clearInterval(interval);
      }


    },1000);




  }


}
