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

  publicData:
  {  //Niveles minimos
    canDeleteUserLevel:10,
    canCreateUserLevel:6,
    canReadUserLevel:6,
    userLevels:
    {
      standardLevel:1,
      panelLevel:4,
      superAdminLevel:10,
      testLevel:6
    }

  }


};
