/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  'GET /':{controller:'PagesController',action:'index'},

  'GET /ingresar':{controller:'PagesController',action:'login'},

  'GET /admin/ingresar':{controller:'PagesController',action:'loginAdmin'},

  'GET /admin':{controller:'PagesController',action:'admin',permissions:'panel'},

  /** Streamings **/

  'GET /admin/streamings':{controller:'PagesController',action:'transmisiones',permissions:'streaming'},
  'GET /admin/streaming':{controller:'PagesController',action:'transmision',permissions:'streaming'},
  'GET /admin/streaming/:id':{controller:'PagesController',action:'transmision',permissions:'streaming'},
  //TODO setear permisos
  'GET /admin/start/streaming/:id':{controller:'StreamingController',action:'start',permissions:'streaming'},
  'GET /admin/stop/streaming/:id':{controller:'StreamingController',action:'stop',permissions:'streaming'},
  'GET /live/streamings':{controller:'StreamingController',action:'getLiveStreamingList',permissions:'streaming'},
  'GET /get/streaming/:id/:file':{controller:'StreamingController',action:'getStreaming'},


  /** **/

  /** Users **/

  'GET /admin/users':{controller:'PagesController',action:'usuarios',permissions:'user'},

  'GET /admin/user/:id':{controller:'PagesController',action:'usuario',permissions:'user'},

  'GET /admin/user/':{controller:'PagesController',action:'usuario',permissions:'user'},

  'GET /online/users':{controller:'UserController',action:'usuariosOnline',permissions:'user'},

  'POST /send/msg':{controller:'UserController',action:'enviarMensaje',permissions:'chat'},

  'POST /mark/seen':{controller:'UserController',action:'marcarLeido',permissions:'chat'},

  'GET /salir':{controller:'UserController',action:'salir'},

  'POST /ingresar':{controller:'UserController',action:'login'},
  /** **/

  /*** Files**/


  'POST /file':{controller:'ArchivoController',action:'tmpUpload'},
  'GET /file/:name':{controller:'ArchivoController',action:'getTmpFile'}

  /*** ***/
  /***************************************************************************
  *                                                                          *
  * Custom routes here...                                                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the custom routes above, it   *
  * is matched against Sails route blueprints. See `config/blueprints.js`    *
  * for configuration options and examples.                                  *
  *                                                                          *
  ***************************************************************************/

};
