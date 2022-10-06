/**
 * Title: Not Found Handler
 * Description: 404 Not Found Handler
 * Author: Saad Ahmed
 * Date: 04-Oct-2022
 */

//module scaffolding
const handler = {};

handler.notFoundHandler = (requestProperties, callback) => {
  callback(404, {
    status: "Failed",
    message: "Your requested url was not found",
  });
};

module.exports = handler;
