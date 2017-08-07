/**
 * User.js
 *
 * Un usuario, por mas que tenga permisos de edicion/creacion, no puede:
 * - Crear/Editar un usuario con mas o iguales permisos q el
 *
 *
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
const crypto = require('crypto');
const shortid = require('shortid');
module.exports = {

  attributes: {

    level:
    {
      type:'integer',
      required:true
     // defaultsTo:1 //Usuario estandar
    },
    username:
    {
      type:'string',
      required:true,
      unique:true
    },
    /* Atributo solo para usuarios que se les autogenera el username cada cierto tiempo*/
  autogenerateSpan:
  {
    type:'json'
  },
    name:
    {
      type:'string'
    },
    surname:
    {
      type:'string'
    },
    password:
    {
      type:'string'
    },
    email:
    {
      type:'string'
      ,
      unique: true
    },
    phones:
    {
      type:'json'
    }
  }
  ,

  beforeValidate:function(values,callback)
  {
    if(values.level==1)
    {
      //Si es nivel 1, genero el usuario

      values.username=shortid.generate().toLowerCase();

    }


    callback();
  },
  beforeCreate:function (values,callback) {
    if(values.password) {
      var hash = crypto.createHash(sails.config.hashAlgo);
      hash.update(values.password);
      values.password = hash.digest('hex');
    }
    //calling cb() with an argument returns an error. Useful for canceling the entire operation if some criteria fails.
    callback();

  }
  ,
  beforeUpdate:function (values,callback) {

    this.beforeCreate(values,callback);

  }
};

