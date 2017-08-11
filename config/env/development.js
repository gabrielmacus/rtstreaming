/**
 * Development environment settings
 *
 * This file can include shared settings for a development team,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 */

module.exports = {

  /***************************************************************************
   * Set the default database connection for models in the development       *
   * environment (see config/connections.js and config/models.js )           *
   ***************************************************************************/

  // models: {
  //   connection: 'someMongodbServer'
  // }

  model:
  {
    connection:'sails-mongo'
  },
  port:2000,
  hashAlgo:'sha256',
  salt:'qwerty',

  //Niveles minimos segun modelo
    minimumLevels:
    {
      create:{user:6,streaming:10},
      read:{user:6,panel:4,streaming:4},
      delete:{user:10,streaming:10}
    },
    //Niveles de usuario existentes
    userLevels:
    {
      standardLevel:1,
      operatorLevel:4,
      superAdminLevel:10,
      testLevel:6
    },
    //Barras de navegacion
    navbar:
    {

      "inicio":{text:"navbar.irHome",level:4,url:'/admin/'},
      "transmision":{text:"navbar.transmisiones",level:4,url:'/admin/transmisiones'},
      "usuarios":{text:"navbar.gestionUsuarios",level:6,url:'/admin/usuarios'},
      "salir":{text:"navbar.salir",level:1,url:'/salir'}

    }




};
