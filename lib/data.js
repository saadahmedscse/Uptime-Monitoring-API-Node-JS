/**
 * Title: Store Data
 * Description: A File to store all data
 * Author: Saad Ahmed
 * Date: 06-Oct-2022
 */

//Dependencies
const fs = require("fs");
const path = require("path");

const lib = {};

//base directory
lib.baseDir = path.join(__dirname, "/../.data/");

//wirte data to file
lib.create = (file, data, callback) => {
  //open file for writing
  fs.open(lib.baseDir + "/" + file + ".json", "wx", (err, fileDescriptor) => {
    if (!err && fileDescriptor) {
      const stringData = JSON.stringify(data);

      fs.writeFile(fileDescriptor, stringData, (err) => {
        if (!err) {
          fs.close(fileDescriptor, (err) => {
            if (!err) {
              callback(false);
            } else {
              callback("Error while closing new file");
            }
          });
        } else {
          callback("Cannot create file, error occurred");
        }
      });
    } else {
      callback("Could not create new file, it may already exist");
    }
  });
};

module.exports = lib;
