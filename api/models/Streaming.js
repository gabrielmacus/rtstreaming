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
    cmd:
    {
      type:'text',
      required:true
    },
    startStreamingSpan:
    {
      type:'json'
    }
  }
}
