/**
 * Created by Gabriel on 16/08/2017.
 */



var async = require('async');
module.exports = {



  run:function () {
    var now = new Date();
    sails.log.info("Checking streamings programmed execution "+new Date());
 /*   Streaming.find({}).exec(
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


              if(streaming.startStreamingSpan  )
              {
                sails.log.info("streaming span here");
                for(var j in streaming.startStreamingSpan)
                {
                  try
                  {
                    var span = streaming.startStreamingSpan[j];
                    var day = span.day;

                    var timeFrom = span.from.split(":");
                    var date = new Date(now.getFullYear(), now.getMonth(), now.getDate(), parseInt(timeFrom[0]), parseInt(timeFrom[1]), 0, 0);

                    sails.log.info(span);

                    if(span.to)
                    {
                      var timeTo = span.to.split(":");
                      var dateEnd =  new Date(now.getFullYear(), now.getMonth(), now.getDate(), parseInt(timeTo[0]), parseInt(timeTo[1]), 0, 0);


                      console.log(now);
                      console.log(dateEnd);

                      if(now.getTime() >= dateEnd.getTime())
                      {

                        //Detengo la transmision
                        return StreamingService.stop(streaming.id,function () {

                        });


                      }


                    }



                    if(date.getTime() <= now.getTime() && day == now.getDay() && idx == -1)
                    {
                      //Inicio la transmision
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
                    sails.log.error(e);
                  }


                }
              }




            });



          }

        }
      }
    );*/


    async.waterfall([
      function (callback) {

        StreamingService.getLiveStreamingList(function (liveStreamings) {

          if(!liveStreamings.error)
          {
            Streaming.find({}).exec(
              function (err,results) {

                if(results && results.length) {
                  callback(null,results,liveStreamings);

                }
              }
            );
          }



        });

          },
      function (streamings,liveStreamings,callback) {

        console.log(streamings);
        console.log(liveStreamings);

        for(var k in streamings) {
          var streaming = streamings[k];


          var idx = liveStreamings.findIndex(
            function (el) {

              return el.id == streaming.id

            }
          );


          if(streaming.startStreamingSpan  )
          {
            sails.log.info("streaming span here");
            for(var j in streaming.startStreamingSpan)
            {
              try
              {
                var span = streaming.startStreamingSpan[j];
                var day = span.day;

                var timeFrom = span.from.split(":");
                var date = new Date(now.getFullYear(), now.getMonth(), now.getDate(), parseInt(timeFrom[0]), parseInt(timeFrom[1]), 0, 0);

                sails.log.info(span);

                if(span.to)
                {
                  var timeTo = span.to.split(":");
                  var dateEnd =  new Date(now.getFullYear(), now.getMonth(), now.getDate(), parseInt(timeTo[0]), parseInt(timeTo[1]), 0, 0);

                  /**
                   * Chequeo si la hora es mayor o igual a la de finalización
                   */

                  console.log(now);
                  console.log(dateEnd);

                  if(now.getTime() >= dateEnd.getTime())
                  {

                    //Detengo la transmision
                    return StreamingService.stop(streaming.id,function () {

                    });


                  }


                }


                /**
                 * Chequeo si la hora es mayor o igual a la de inicio, y si estoy en el dia correcto y si no esta iniciada la transmision
                 */
                if(date.getTime() <= now.getTime() && day == now.getDay() && idx == -1)
                {
                  //Inicio la transmision
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
                sails.log.error(e);
              }


            }
          }



        }


        }
    ])







  }


}
