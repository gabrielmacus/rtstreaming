/**
 * Created by Gabriel on 07/08/2017.
 */

const path = require('path');
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
              sails.log.error(err);
              return  callback({error:"stream.errorTransmitir",code:500});
            }

            var cmd='ffmpeg';

            if(streaming.inputCmd && streaming.inputCmd.length)
            {

              cmd+= ' '+streaming.inputCmd.join(" ");

            }

            var outFile =path.join(savePath,fileName);

            cmd+=' -i "'+streaming.url+'"';

            cmd+='  -timeout '+sails.config.streamingTimeout+' '+streaming.outputCmd.join(" ");

            cmd+= ' '+outFile;

            sails.log.debug(cmd);

            var child = exec(cmd);

            streamingProcesses[streaming.id]={pid:child.pid,status:'loading'};

            Streaming.message(streaming.id,{streaming:streaming,status:'loading'});

            child.stdout.on('data', function(data) {
            });

            child.stderr.on('data', function(data) {
            });

            child.on('close', function(code) {


              sails.log.debug('Killing Streaming '+ streaming.id+'. Closing code: ' + code);

              if( streamingProcesses[streamingId])
              {

                Streaming.message(streaming.id,{streaming:streaming,status:'stopped'});
                delete streamingProcesses[streamingId];
              }

              try
              {
                fs.remove(savePath);
              }
              catch(e)
              {}


            });


            FileService.watch('exists',outFile,(sails.config.streamingTimeout+10),function () {


                Streaming.message(streaming.id,{streaming:streaming,status:'playing'});
                streamingProcesses[streaming.id].status='playing';


            });



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

        for(var k in results)
        {
          results[k].status = streamingProcesses[results[k].id].status;
        }


        callback(results);

      }
    );



  }
}
