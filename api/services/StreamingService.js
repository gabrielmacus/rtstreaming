/**
 * Created by Gabriel on 07/08/2017.
 */

module.exports=
{
  stream:function(streamUrl,callback)
  {
    if(!streamUrl)
    {
    return callback({error:'stream.noUrl',code:400});
    }
   
  }
}
