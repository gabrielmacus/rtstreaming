/**
 * Created by Gabriel on 07/08/2017.
 */

var path = require('path');
const fs = require('fs-extra')

var streamingProcesses = {};

module.exports=
{
  start:function(streamingId,callback)
  {
    var exec = require('child_process').exec;
    Streaming.find(
      {
        id:[streamingId]
      }
    ).exec(
      function (err, results) {

        if(err || !results.length)
        {
          return  callback({error:"stream.errorTransmitir",code:500});
        }

        var streaming = results[0];

        try
        {
          if(  streamingProcesses[streaming.id])
          {

            CommandService.kill(   streamingProcesses[streaming.id].pid);
          }

        }
        catch(e)
        {
          return  callback({error:"stream.errorTransmitir",code:500});

        }

        var savePath=path.join("assets/streaming/",streaming.id+'/');
        //var savePath=streaming.id+'/';

        var fileName='out.m3u8';



        fs.remove(savePath,function(err) {
          if (err) return sails.log.error(err)


          fs.ensureDir(savePath, function(err) {

            if(err)
            {
              sails.log.err(err);
              return  callback({error:"stream.errorTransmitir",code:500});
            }

            var cmd='ffmpeg';

            if(streaming.inputCmd && streaming.inputCmd.length)
            {

              cmd+= ' '+streaming.inputCmd.join(" ");

            }

            cmd+=' -i "'+streaming.url+'"';

            cmd+=' '+streaming.outputCmd.join(" ");

            cmd+= ' '+savePath+fileName;

            var child = exec(cmd);

            sails.log.info(cmd);

            child.stdout.on('data', function(data) {
              //console.log('stdout: ' + data);
            });

            child.stderr.on('data', function(data) {
              // console.log('stdout: ' + data);
            });

            child.on('close', function(code) {


              console.log('Killing Streaming '+ streaming.id+'. Closing code: ' + code);

              if( streamingProcesses[streamingId])
              {
                delete streamingProcesses[streamingId];
              }

              try
              {
                fs.remove(savePath);
              }
              catch(e)
              {}


            });

            streamingProcesses[streaming.id]=child;

            return callback(true);
          })


        })






      }
    );

  },
  stop:function(streamingId,callback)
  {

    console.log('Stopping');
    if(streamingProcesses[streamingId])
    {
      CommandService.kill(   streamingProcesses[streamingId].pid);



      return  callback(true);


    }
    else {
      return  callback({error:"stream.transmisionNoEjecutandose",code:500});

    }

  },

  getLiveStreamingList:function (callback) {

    var ids = Object.keys(streamingProcesses);
    Streaming.find(
      {id:ids}
    )
    .exec(
      function (err,results) {


        if(err)
        {       sails.log.error(err);
          callback({error:"stream.errorListingLive",code:500});
        }

        callback(results);

      }
    );



  }
}
