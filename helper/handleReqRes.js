/**
 * Title: Handle Request Response
 * Description: Handle Request and Response
 * Author: Saad Ahmed
 * Date: 04-Oct-2022
 */

//dependencies
const url = require("url");
const { StringDecoder } = require("string_decoder");
const routes = require("../routes");
const {
  notFoundHandler,
} = require("../handlers/routeHandlers/notFoundHandler");

//handle object - module scaffolding
const handler = {};

handler.handleReqRes = (req, res) => {
  //request handle
  //get url and parse
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, "");
  const method = req.method.toLowerCase();
  const queryObject = parsedUrl.query;
  const headersObject = req.headers;

  const requestProperties = {
    parsedUrl,
    path,
    trimmedPath,
    method,
    queryObject,
    headersObject,
  };

  const decoder = new StringDecoder("utf-8");
  let realData = "";

  const chosenHandler = routes[trimmedPath]
    ? routes[trimmedPath]
    : notFoundHandler;

  chosenHandler(requestProperties, (statusCode, body) => {
    statusCode = typeof statusCode === "number" ? statusCode : 500;
    body = typeof body === "object" ? body : {};

    const bodyString = JSON.stringify(body);
    res.writeHead(statusCode);
    res.end(bodyString);
  });

  req.on("data", (buffer) => {
    realData += decoder.write(buffer);
  });

  req.on("end", () => {
    realData += decoder.end();
    console.log(realData);
    //response handle
    res.end("Hello World");
  });
};

module.exports = handler;
