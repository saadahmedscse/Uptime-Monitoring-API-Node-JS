/**
 * Title: User Handler
 * Description: Handle user creation, get, update and delete requests
 * Author: Saad Ahmed
 * Date: 07-Oct-2022
 */

//dependencies
const data = require("../../lib/data");

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
    requestProperties.body.firstName.trim().lenght > 0
      ? requestProperties.body.firstName
      : false;

  const lastName =
    typeof body.lastName === "string" && body.lastName.trim().lenght > 0
      ? body.lastName
      : false;

  const phone =
    typeof body.phone === "string" && body.phone.trim().lenght === 11
      ? body.phone
      : false;

  const password =
    typeof body.password === "string" && body.password.trim().lenght > 0
      ? body.password
      : false;

  const tosAgreement =
    typeof body.tosAgreement === "boolean" && body.password.trim().lenght > 0
      ? body.tosAgreement
      : false;

  console.log(!firstName);

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
  } else if (!tosAgreement) {
    callback(400, {
      status: "Failed",
      message: "Invalid terms of service agreement",
    });
  } else {
    data.read(phone, (err, user) => {
      if (err) {
        const fullName = `${firstName} ${lastName}`;
        const userObj = {
          firstName,
          lastName,
          fullName,
          phone,
          password,
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
  callback(200, {
    status: "Success",
    message: "This is a get method",
  });
};

handler._user.put = (requestProperties, callback) => {
  callback(200, {
    status: "Success",
    message: "This is a put method",
  });
};

handler._user.delete = (requestProperties, callback) => {
  callback(200, {
    status: "Success",
    message: "This is a delete method",
  });
};

module.exports = handler;
