/**
 * Created by Gabriel on 07/08/2017.
 */


//var http = require('http');
  /*
var fs = require('fs');
var url = require('url');
var path = require('path');*/
var zlib = require('zlib');
//const cmd=require('node-cmd');
var ffmpeg = require('fluent-ffmpeg');
var streamingProcesses = {};
var path = require('path');
module.exports = {


/*
  index:function (req,res) {

   // var streamingUrl = 'rtsp://jmarti.info.tm:555/user=admin&password=&channel=1&stream=0.sdp';

    filename ="C:\\Users\\Gabriel\\Downloads\\tests\\"+req.param("ts");

    fs.exists(filename, function (exists) {

        switch (path.extname(filename)) {
          case '.m3u8':
            fs.readFile(filename, function (err, contents) {
              if (err) {
                res.writeHead(500);
                res.end();
              } else if (contents) {
                res.set('Content-Type','application/vnd.apple.mpegurl');

                var ae = req.headers['accept-encoding'];


                if (ae.match(/\bgzip\b/)) {
                  zlib.gzip(contents, function (err, zip) {
                    if (err) throw err;

                    res.set('content-encoding', 'gzip');
                    res.end(zip);
                  });
                } else {
                  res.end(contents, 'utf-8');
                }
              } else {
                console.log('emptly playlist');

                res.end();
              }
            });
            break;
          case '.ts':
            res.set('Content-Type','video/MP2T' );
            var stream = fs.createReadStream(filename,
              { bufferSize: 64 * 1024 });
            stream.pipe(res);
            break;
          default:

            res.writeHead(500);
            res.end();
        }

    });

  }*/

  start: function (req, res) {


    var streamingId =req.param("id");

    Streaming.find(
      {
        id:[streamingId]
      }
    ).exec(
      function (err, results) {

        if(err || !results.length)
        {
        return  res.__("stream.errorTransmitir");
        }

        var streaming = results[0];

        try
        {
          if(   streamingProcesses[streaming.id])
          {
            streamingProcesses[streaming.id].kill();
          }

        }
        catch(e)
        {

        }




        var proc = new ffmpeg({ source: streaming.url });

        var savePath=path.join(process.cwd()+"/assets/streaming/",streaming.id+'.m3u8');

        for(k in streaming.cmd){

          var commmand = streaming.cmd[k];

          commmand= commmand.split(" ");
          proc.addOption(commmand[0], commmand[1]);

        }

          proc.on('start', function(commandLine) {
            //console.log('Spawned Ffmpeg with command: ' + commandLine);
            sails.log.info("Transmision "+streaming.id+" comenzada");
          });
          proc.on('error', function () {

            sails.log.info("Transmision "+streaming.id+" finalizada");

          });
          proc.save(savePath);


        streamingProcesses[streaming.id]=proc;



        res.ok();
      }
    );


    /*
    var proc = new ffmpeg({ source: "rtsp://jmarti.info.tm:555/user=admin&password=&channel=1&stream=0.sdp" })
      .addOption('-rtsp_transport', 'tcp')
      .addOption('-hls_time','10')
      .addOption('-hls_list_size','6')
      .addOption('-hls_wrap','10')
      .addOption('-start_number','1')
      .on('start', function(commandLine) {
      //console.log('Spawned Ffmpeg with command: ' + commandLine);
    })
      .on('error', function () {

      })
      .save('out.m3u8');

    */


  }

}
