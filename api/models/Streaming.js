/**
 * Created by Gabriel on 07/08/2017.
 */
module.exports=
{
  attributes:
  {
     title:
     {
       type:'string',
       size:60,
       required:true
     },
    inputCmd:
    {
      type:'json'
    },
outputCmd:{

  type:'json',
  required:true
},
    url:
    {
      type:'string',
      required:true
    },
    startStreamingSpan:
    {
      type:'json'
      ,
      required:true
    }
  }
}
