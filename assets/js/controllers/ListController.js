/**
 * Created by Puers on 12/08/2017.
 */
app.controller('listController', function($rootScope,$http) {

  $rootScope.delete=function(id,model)
  {


    $http.delete('/'+model+'/'+id)
      .then(function(res) {

        console.log(res);
        location.reload();
      }, error);
  }

});
