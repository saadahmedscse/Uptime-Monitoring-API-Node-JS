/**
 * Title: Utilities
 * Description: Utility functions
 * Author: Saad Ahmed
 * Date: 07-Oct-2022
 */

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

module.exports = utilities;
