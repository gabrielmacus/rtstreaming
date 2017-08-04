/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    level:
    {
      type:'integer',
      required:true,
      defaultsTo:1 //Usuario estandar
    },
    username:
    {
      type:'string',
      required:true
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
      type:'string',
      required:true
    },
    email:
    {
      type:'string'
    },
    phones:
    {
      type:'json'
    }
  }
};

