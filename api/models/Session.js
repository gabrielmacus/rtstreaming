/**
 * Created by Gabriel on 14/09/2017.
 */

module.exports=
{
  attributes:
  {
    user:
    {
     type:'json'
    },
    userId:
    {
      type:'objectid',
      required:true
    },
    connections:
    {
      type:'array'
    }
  },
  connection:"mongodMem"
}
