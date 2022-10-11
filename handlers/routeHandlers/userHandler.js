/**
 * Title: User Handler
 * Description: Handle user creation, get, update and delete requests
 * Author: Saad Ahmed
 * Date: 07-Oct-2022
 */

//dependencies
const data = require("../../lib/data");
const utils = require("../../helper/utils");
const tokenHandler = require("./tokenHandler");

//module scaffolding
handler = {};

handler.userHandler = (requestProperties, callback) => {
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

handler._user = {};

handler._user.post = (requestProperties, callback) => {
  const body = requestProperties.body;

  const firstName =
    typeof requestProperties.body.firstName === "string" &&
    requestProperties.body.firstName.trim().length > 0
      ? requestProperties.body.firstName
      : false;

  const lastName =
    typeof body.lastName === "string" && body.lastName.trim().length > 0
      ? body.lastName
      : false;

  const phone =
    typeof body.phone === "string" && body.phone.trim().length === 11
      ? body.phone
      : false;

  const password =
    typeof body.password === "string" && body.password.trim().length > 0
      ? body.password
      : false;

  const tosAgreement =
    typeof body.tosAgreement === "boolean" && body.password.trim().length > 0
      ? body.tosAgreement
      : false;

  if (!firstName) {
    callback(400, {
      status: "Failed",
      message: "Invalid First Name",
    });
  } else if (!lastName) {
    callback(400, {
      status: "Failed",
      message: "Invalid Last Name",
    });
  } else if (!phone) {
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
    data.read(phone, (err, _) => {
      if (err) {
        const fullName = `${firstName} ${lastName}`;
        const userObj = {
          firstName,
          lastName,
          fullName,
          phone,
          password: utils.getHash(password),
          tosAgreement,
        };
        data.create(phone, userObj, (err) => {
          if (!err) {
            callback(200, {
              status: "Success",
              message: "User created successfully",
            });
          } else {
            callback(500, {
              status: "Failed",
              message: "Unable to create user, try again later",
            });
          }
        });
      } else {
        callback(400, {
          status: "Failed",
          message: "User already created",
        });
      }
    });
  }
};

handler._user.get = (requestProperties, callback) => {
  const queryObj = requestProperties.queryObject;

  const phone =
    typeof queryObj.phone === "string" && queryObj.phone.length === 11
      ? queryObj.phone
      : false;

  if (phone) {
    const headers = requestProperties.headersObject;
    const token =
      typeof headers.token === "string" && headers.token.length === 16
        ? headers.token
        : false;

    tokenHandler._token.verify(token, phone, (_) => {
      if (_) {
        data.read(phone, (err, userData) => {
          if (!err) {
            const user = utils.parseJson(userData);
            delete user.password;
            callback(200, {
              status: "Success",
              data: user,
            });
          } else {
            callback(400, {
              status: "Failed",
              message: "No user found with this number",
            });
          }
        });
      } else {
        callback(403, {
          status: "Failed",
          message: "You are unauthenticated",
        });
      }
    });
  } else {
    callback(400, {
      status: "Failed",
      message: "Invalid Phone number",
    });
  }
};

handler._user.put = (requestProperties, callback) => {
  const body = requestProperties.body;

  const firstName =
    typeof requestProperties.body.firstName === "string" &&
    requestProperties.body.firstName.trim().length > 0
      ? requestProperties.body.firstName
      : false;

  const lastName =
    typeof body.lastName === "string" && body.lastName.trim().length > 0
      ? body.lastName
      : false;

  const phone =
    typeof body.phone === "string" && body.phone.trim().length === 11
      ? body.phone
      : false;

  const password =
    typeof body.password === "string" && body.password.trim().length > 0
      ? body.password
      : false;

  if (phone) {
    const headers = requestProperties.headersObject;
    const token =
      typeof headers.token === "string" && headers.token.length === 16
        ? headers.token
        : false;

    tokenHandler._token.verify(token, phone, (_) => {
      if (_) {
        if (firstName || lastName || password) {
          data.read(phone, (err, userData) => {
            if (!err && userData) {
              const user = utils.parseJson(userData);

              if (firstName) user.firstName = firstName;
              if (lastName) user.lastName = lastName;
              if (password) user.password = utils.getHash(password);

              user.fullName = `${user.firstName} ${user.lastName}`;

              data.update(phone, user, (err) => {
                if (!err) {
                  callback(200, {
                    status: "Success",
                    message: "User updated successfully",
                  });
                } else {
                  callback(400, {
                    status: "Failed",
                    message: "User upadte failed, try again later",
                  });
                }
              });
            } else {
              callback(400, {
                status: "Failed",
                message: "No user found with this number",
              });
            }
          });
        } else {
          callback(500, {
            status: "Failed",
            message: "Server error, try again later",
          });
        }
      } else {
        callback(403, {
          status: "Failed",
          message: "You are unauthenticated",
        });
      }
    });
  } else {
    callback(400, {
      status: "Failed",
      message: "Invalid Phone number length",
    });
  }
};

handler._user.delete = (requestProperties, callback) => {
  const body = requestProperties.body;

  const phone =
    typeof body.phone === "string" && body.phone.length === 11
      ? body.phone
      : false;

  if (phone) {
    const headers = requestProperties.headersObject;
    const token =
      typeof headers.token === "string" && headers.token.length === 16
        ? headers.token
        : false;

    tokenHandler._token.verify(token, phone, (_) => {
      if (_) {
        data.read(phone, (err, userData) => {
          if (!err) {
            data.delete(phone, (err) => {
              if (!err) {
                callback(200, {
                  status: "Success",
                  message: "User Deleted successfully",
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
              message: "No user found with this number",
            });
          }
        });
      } else {
        callback(403, {
          status: "Failed",
          message: "You are unauthenticated",
        });
      }
    });
  } else {
    callback(400, {
      status: "Failed",
      message: "Invalid Phone number",
    });
  }
};

module.exports = handler;
