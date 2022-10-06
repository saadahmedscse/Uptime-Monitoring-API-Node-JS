/**
 * Title: Uptime Monitoring Application
 * Description: A RESTFul API to monitor up or down time of user defined links
 * Author: Saad Ahmed
 * Date: 04-Oct-2022
 */

//Dependencies
const http = require("http");
const { handleReqRes } = require("./helper/handleReqRes");
require("dotenv").config();

//app object - module scaffolding
const app = {};

//Port
const port = process.env.PORT || 3000;

//Create server
app.createServer = () => {
  const server = http.createServer(app.handleReqRes);
  server.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
};

//Handle Request Response
app.handleReqRes = handleReqRes;

app.createServer();
