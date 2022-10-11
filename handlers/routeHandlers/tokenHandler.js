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

          data.create(token, tokenObj, (err) => {
            if (!err) {
              callback(200, {
                status: "Success",
                data: tokenObj,
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

handler._token.get = (requestProperties, callback) => {
  const queryObj = requestProperties.queryObject;

  const token =
    typeof queryObj.token === "string" && queryObj.token.length === 16
      ? queryObj.token
      : false;

  if (token) {
    data.read(token, (err, tokenData) => {
      if (!err) {
        const token = utils.parseJson(tokenData);
        callback(200, {
          status: "Success",
          data: token,
        });
      } else {
        callback(400, {
          status: "Failed",
          message: "No token data found using this id",
        });
      }
    });
  } else {
    callback(400, {
      status: "Failed",
      message: "Invalid token",
    });
  }
};

handler._token.put = (requestProperties, callback) => {
  const body = requestProperties.body;

  const token =
    typeof body.token === "string" && body.token.trim().length === 16
      ? body.token
      : false;

  const extend =
    typeof body.extend === "boolean" && body.extend === true ? true : false;

  if (token && extend) {
    data.read(token, (err, tokenData) => {
      if (!err) {
        const tokenObj = utils.parseJson(tokenData);
        if (tokenObj.expires > Date.now()) {
          tokenObj.expires = Date.now() * 60 * 60 * 1000;

          data.update(token, tokenObj, (err) => {
            if (!err) {
              callback(200, {
                status: "Success",
                message: "Token has been updated successfully",
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
            message: "Token already expired",
          });
        }
      } else {
        callback(400, {
          status: "Failed",
          message: "No token found with this token",
        });
      }
    });
  } else {
    callback(400, {
      status: "Failed",
      message: "There was a problem in your request",
    });
  }
};

handler._token.delete = (requestProperties, callback) => {
  const body = requestProperties.body;

  const token =
    typeof body.token === "string" && body.token.length === 16
      ? body.token
      : false;

  if (token) {
    data.read(token, (err, tokenData) => {
      if (!err) {
        data.delete(token, (err) => {
          if (!err) {
            callback(200, {
              status: "Success",
              message: "Token Deleted successfully",
            });
          } else {
            callback(400, {
              status: "Failed",
              message: "An error occurred while deleting your data",
            });
          }
        });
      } else {
        callback(400, {
          status: "Failed",
          message: "No token data found with this token",
        });
      }
    });
  } else {
    callback(400, {
      status: "Failed",
      message: "Invalid token",
    });
  }
};

handler._token.verify = (token, phone, callback) => {
  data.read(token, (err, tokenData) => {
    if (!err) {
      const tokenObj = utils.parseJson(tokenData);

      if (tokenObj.phone === phone && tokenObj.expires > Date.now()) {
        callback(true);
      } else callback(false);
    } else {
      callback(false);
    }
  });
};

module.exports = handler;
