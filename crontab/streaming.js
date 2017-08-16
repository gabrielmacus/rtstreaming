/**
 * Created by Gabriel on 16/08/2017.
 */




module.exports = {



  run:function () {
    var now = new Date();

    sails.log.info("Checking streamings programmed execution ");
    Streaming.find({}).exec(
      function (err,results) {

        if(results && results.length)
        {

          for(var k in results)
          {
            var streaming= results[k];



            StreamingService.getLiveStreamingList(function (liveStreamings) {

              var idx = liveStreamings.findIndex(
                function (el) {

                  return el.id == streaming.id

                }
              );

              console.log(liveStreamings);

              if(streaming.startStreamingSpan && streaming.startStreamingSpan.length && idx == -1)
              {
                for(var j in streaming.startStreamingSpan)
                {
                  try
                  {
                    var span = streaming.startStreamingSpan[j];
                    var day = span.day;
                    var time = span.from.split(":");





                    var date = new Date(now.getFullYear(), now.getMonth(), now.getDate(), parseInt(time[0]), parseInt(time[1]), 0, 0); // today 9:30:00:000


                    console.log(date.getTime()+" "+now.getTime());

                      /**
                       * Chequeo si la hora es mayor o igual a la de inicio, y si estoy en el dia correcto
                       */
                    if(date.getTime() <= now.getTime() && day == now.getDay())
                    {
                      StreamingService.start(streaming.id,function (result) {
                        if(result.error)
                        {
                          sails.log.error("Streaming "+streaming.id+" failed execution");

                        }

                      });

                      sails.log.info("Streaming "+streaming.id+" executed");
                    }


                  }
                  catch(e)
                  {

                  }


                }
              }




            });



          }

        }
      }
    );

  }


}
