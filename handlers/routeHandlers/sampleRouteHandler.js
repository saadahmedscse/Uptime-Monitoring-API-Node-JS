/**
 * Title: Sample Handler
 * Description: Sample Handler
 * Author: Saad Ahmed
 * Date: 04-Oct-2022
 */

//module scaffolding
const handler = {};

handler.sampleHandler = (requestProperties, callback) => {
  console.log("Entered in sample");
  callback(200, {
    status: "Success",
    message: "Node JS is great",
  });
};

module.exports = handler;
