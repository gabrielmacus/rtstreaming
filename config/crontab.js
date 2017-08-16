/**
 * Created by Gabriel on 16/08/2017.
 */
module.exports.crontab = {

  /*
   * The asterisks in the key are equivalent to the
   * schedule setting in crontab, i.e.
   * minute hour day month day-of-week year
   * so in the example below it will run every minute
   */

  '*/3 * * * *': function(){
    require('../crontab/streaming.js').run();
  }
};
