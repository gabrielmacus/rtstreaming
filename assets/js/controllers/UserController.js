/**
 * Created by Gabriel on 11/08/2017.
 */

app.controller('userController', function($rootScope,$http) {

  $rootScope.deleteuser=function(id)
  {


    $http.delete('/user/'+id)
      .then(function(res) {

        console.log(res);
        location.reload();
      }, error);
  }

});
