/**
 * Created by Puers on 18/09/2017.
 */
const path = require('path');
module.exports=
{
  tmpUpload: function (req, res) {


    ArchivoService.uploadTmp(req.file("file"),req.param("name"),function (result) {

      if(result.error)
      {
        return res.json(result.code,res.i18n(result.error));
      }

      return res.json(result);
    })

  },
  getTmpFile: function (req,res) {
    var file = req.param("name");
    if(!file || file.trim() == "" )
    {
      return res.badRequest(res.i18n("file.notTmpName"));
    }
   var dir =  path.join(".tmp/uploads",file);

    return res.sendfile(dir);


  }
}
