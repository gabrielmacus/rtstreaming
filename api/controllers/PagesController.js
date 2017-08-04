/**
 * HomeController
 *
 * @description :: Server-side logic for managing Homes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  index: function(req,res){
   
    res.view('home/cuerpo', {layout: 'layouts/layout', bodyClasses: ["home"]});
   },
  login: function(req,res)
  {
      res.view('login/cuerpo',{layout: 'layouts/login-layout', bodyClasses: ["login"]})
  }
};

