/**
 * Title: Token Handler
 * Description: Handle token creation, get, update and delete requests
 * Author: Saad Ahmed
 * Date: 11-Oct-2022
 */

//dependencies
const data = require("../../lib/data");
const utils = require("../../helper/utils");

//module scaffolding
handler = {};

handler.tokenHandler = (requestProperties, callback) => {
  const acceptedMethods = ["post", "get", "put", "delete"];
  if (acceptedMethods.indexOf(requestProperties.method) > -1) {
    handler._user[requestProperties.method](requestProperties, callback);
  } else {
    callback(405, {
      status: "Failed",
      message: "Method not allowed",
    });
  }
};

handler._token = {};

handler._token.post = (requestProperties, callback) => {};

handler._token.get = (requestProperties, callback) => {};

handler._token.put = (requestProperties, callback) => {};

handler._token.delete = (requestProperties, callback) => {};

module.exports = handler;
