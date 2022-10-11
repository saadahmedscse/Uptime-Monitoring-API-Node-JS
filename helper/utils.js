/**
 * Title: Utilities
 * Description: Utility functions
 * Author: Saad Ahmed
 * Date: 07-Oct-2022
 */

//dependencies
const crypto = require("crypto");

//module scaffolding
const utilities = {};

//Parse JSON from String
utilities.parseJson = (jsonString) => {
  let output;

  try {
    output = JSON.parse(jsonString);
  } catch {
    output = {};
  }

  return output;
};

//String to Hash
utilities.getHash = (str) => {
  const hash = crypto
    .createHmac("sha256", process.env.PASSWORD_SECRET_KEY)
    .update(str)
    .digest("hex");

  return hash;
};

//get random token
utilities.getRandomToken = (size) => {
  let res = "";
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  const len = characters.length;
  for (let i = 0; i < size; i++) {
    res += characters.charAt(Math.floor(Math.random() * len));
  }
  return res;
};

module.exports = utilities;
