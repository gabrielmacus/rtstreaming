/**
 * Created by Gabriel on 07/08/2017.
 */


//var http = require('http');
var fs = require('fs');
var url = require('url');
var path = require('path');
var zlib = require('zlib');
module.exports = {


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

  }


}
