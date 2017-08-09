/**
 * Created by Gabriel on 09/08/2017.
 */
var webdriverio = require('webdriverio');


module.exports=
{
  index:function()
  {
    var options = {
      desiredCapabilities: {
        browserName: 'firefox'
      }
    };
    webdriverio
      .remote(options)
      .init()
      .url('http://www.google.com')
      .getTitle().then(function(title) {
        console.log('Title was: ' + title);
      })
      .end();
  }

}
