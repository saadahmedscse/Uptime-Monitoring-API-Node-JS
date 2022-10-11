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
    handler._token[requestProperties.method](requestProperties, callback);
  } else {
    callback(405, {
      status: "Failed",
      message: "Method not allowed",
    });
  }
};

handler._token = {};

handler._token.post = (requestProperties, callback) => {
  const body = requestProperties.body;

  const phone =
    typeof body.phone === "string" && body.phone.trim().length === 11
      ? body.phone
      : false;

  const password =
    typeof body.password === "string" && body.password.trim().length > 0
      ? body.password
      : false;

  if (!phone) {
    callback(400, {
      status: "Failed",
      message: "Invalid Phone number length",
    });
  } else if (!password) {
    callback(400, {
      status: "Failed",
      message: "Password is required",
    });
  } else {
    data.read(phone, (err, userData) => {
      if (!err) {
        let hashedPass = utils.getHash(password);
        let userPass = utils.parseJson(userData).password;
        if (hashedPass === userPass) {
          let token = utils.getRandomToken(16);
          const expires = Date.now() * 60 * 60 * 1000;
          const tokenObj = {
            phone,
            token,
            expires,
          };

          data.create("token " + phone, tokenObj, (err) => {
            if (!err) {
              callback(200, {
                status: "Success",
                message: "Token has been created successfully",
              });
            } else {
              callback(500, {
                status: "Failed",
                message: err,
              });
            }
          });
        } else {
          callback(400, {
            status: "Failed",
            message: "The password you entered is invalid",
          });
        }
      } else {
        callback(400, {
          status: "Failed",
          message: "No user found with this phone number",
        });
      }
    });
  }
};

handler._token.get = (requestProperties, callback) => {};

handler._token.put = (requestProperties, callback) => {};

handler._token.delete = (requestProperties, callback) => {};

module.exports = handler;
