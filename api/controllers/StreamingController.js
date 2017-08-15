/**
 * Created by Gabriel on 07/08/2017.
 */



var url = require('url');
var zlib = require('zlib');
var fs = require('fs');
var path = require('path');
module.exports = {



  getStreaming:function (req,res) {

   // var streamingUrl = 'rtsp://jmarti.info.tm:555/user=admin&password=&channel=1&stream=0.sdp';

    var streamingId= req.param("id");
    var file = req.param('file');
    var filename =path.join(process.cwd(),"/assets/streaming/"+streamingId+"/"+file);


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

  },

  start: function (req, res) {


    var streamingId =req.param("id");

    StreamingService.start(streamingId,function (result) {

      if(result.error)
      {
        return res.json(result.code,res.__(result.error));
      }

      return res.json(result);


    })

  },
  stop: function (req,res) {

    var streamingId =req.param("id");

    StreamingService.stop(streamingId,function (result) {

      if(result.error)
      {
        return res.json(result.code,res.__(result.error));
      }

      return res.json(result);


    })

  },
  getLiveStreamingList:function (req,res) {

    StreamingService.getLiveStreamingList(function (result) {


      if(result.error)
      {
        return res.json(result.code,res.__(result.error));
      }

      return res.json(result);

    });


  }
}
