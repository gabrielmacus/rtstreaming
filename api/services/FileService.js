/**
 * Created by Gabriel on 11/09/2017.
 */
const fs=require('fs-extra');
const path = require('path');
module.exports= {


  watch: function (type, path, timeout, callback, timedOutCallback) {

    if (typeof type != 'string') {
      return false;
    }

    var i = 0;

    timeout = timeout * 1000;


    var interval = setInterval(
      function () {

        switch (type) {
          case 'exists':


            fs.pathExists(path).then(function (exists) {

              if (exists && typeof callback == 'function') {


                callback();
                return clearInterval(interval);

              }

            });

            break;
        }
        i += 1000;

        if (i >= timeout) {

          if (typeof timedOutCallback == 'function') {
            timedOutCallback();
          }
          return clearInterval(interval);
        }


      }, 1000);


  },
  uploadTmp: function (files, callback) {
    files.upload({
      maxBytes: sails.config.maxFileSize
    }, function (err, uploadedFiles) {
      if (err) {
        if (callback) {
          return callback({"error": "file.tmpUploadError", code: 500});
        }

      }

      // If no files were uploaded, respond with an error.
      if (uploadedFiles.length === 0) {
        return callback({"error": "file.noFilesUploaded", code: 500});
      }

      var uploaded= [];

      for(var k in uploadedFiles)
      {
        var file = uploadedFiles[k];
        uploaded.push(path.basename(file.fd));
      }
     return callback(uploaded);

    });


  }
}
