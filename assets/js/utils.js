/**
 * Created by Gabriel on 04/08/2017.
 */
function error(e) {
  console.log(e);
  var responseText = e.responseJSON || e.data;
  alert(responseText);

}

$(document).on("click",".hamburger",function(){

  $("header").toggleClass("active");

});
function empty(obj) {

 if(typeof obj === "object" && Object.keys(obj).length > 0)
 {
   return false;
 }
  else if(typeof obj === "array" && obj.length > 0)
  {
    return false;
  }


  return true;

}
