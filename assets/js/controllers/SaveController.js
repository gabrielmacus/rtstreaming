/**
 * Created by Puers on 12/08/2017.
 */
app.controller('saveController', function($rootScope,$http) {

  $rootScope.save=function(model)
  {

    var object = $rootScope[model];
var url='/'+model;
    if(object.id)
    {
      url+=+'/'+object.id;
    }
    $http.post(url,object)
      .then(function(res) {

        console.log(res);
        location.reload();
      }, error);
  }

});
