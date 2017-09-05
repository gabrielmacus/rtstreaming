/**
 * Created by Gabriel on 05/09/2017.
 */
module.exports=
{
  parseHeader:function (header) {

    if(header)
    {
      header = header.split(";");

      header = header.map(function (el) {

        var split = el.split("=");

        return {key:split[0].trim(),value:split[1]};

      });


    }
    else
    {
      header =[];
    }
    return header;


  },
  getValueFromHeader:function (header,key) {

    value=false;

    header = ParseService.parseHeader(header);


    value = header.filter(function (el) {
      return el.key == key;
    });

    if(value && value.length >0)
    {
      value = value[0].value;
    }


    return value;

  }
}
