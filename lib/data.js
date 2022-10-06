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

//read data from file
lib.read = (file, callback) => {
  fs.readFile(lib.baseDir + "/" + file + ".json", "utf8", (err, data) => {
    callback(err, data);
  });
};

//update existing data
lib.update = (file, data, callback) => {
  //Open file
  fs.open(lib.baseDir + "/" + file + ".json", "r+", (err, fileDescriptor) => {
    if (!err && fileDescriptor) {
      const stringData = JSON.stringify(data);

      fs.truncate(fileDescriptor, (err) => {
        if (!err) {
          //write file and close it
          fs.watchFile(fileDescriptor, stringData, (err) => {
            if (!err) {
              fs.close(fileDescriptor, (err) => {
                if (!err) {
                  callback(false);
                } else {
                  callback("Error while closing file");
                }
              });
            } else {
              callback("Error while writing file");
            }
          });
        } else {
          callback("Error while truncating file");
        }
      });
    } else {
      callback("Error while updating file. File may not exist");
    }
  });
};

module.exports = lib;
