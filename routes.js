/**
 * Title: API Routes
 * Description: API Routes has been declared here
 * Author: Saad Ahmed
 * Date: 04-Oct-2022
 */

//dependencies
const {
  sampleHandler,
} = require("./handlers/routeHandlers/sampleRouteHandler");

const { userHandler } = require("./handlers/routeHandlers/userHandler");

const routes = {
  "api/sample": sampleHandler,
  "api/user": userHandler,
};

module.exports = routes;
