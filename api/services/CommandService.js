/**
 * Created by Gabriel on 15/08/2017.
 */
var psTree = require('ps-tree');

module.exports=
{
 

  kill:function (pid, signal, callback) {
    signal   = signal || 'SIGKILL';
    callback = callback || function () {};
    var killTree = true;
    if(killTree) {
      psTree(pid, function (err, children) {
        [pid].concat(
          children.map(function (p) {
            return p.PID;
          })
        ).forEach(function (tpid) {
          try { process.kill(tpid, signal) }
          catch (ex) { }
        });
        callback();
      });
    } else {
      try { process.kill(pid, signal) }
      catch (ex) { }
      callback();
    }
  }

}
