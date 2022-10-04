/**
 * Title: Uptime Monitoring Application
 * Description: A RESTFul API to monitor up or down time of user defined links
 * Author: Saad Ahmed
 * Date: 04-Oct-2022
 */

//Dependencies
const http = require("http");

//app object - module scaffolding
const app = {};

//Configuration
app.config = {
  port: 3000,
};

//Create server
app.createServer = () => {
  const server = http.createServer(app.handleReqRes);
  server.listen(app.config.port, () => {
    console.log(`Listening on port ${app.config.port}`);
  });
};

//Handle Request Response
app.handleReqRes = (req, res) => {
  //response handle
  res.end("Hello World");
};

app.createServer();
