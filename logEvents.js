// node perkage maniger

// to instal NPM packages, we need nmp -y

const { format } = require("date-fns");
const { v4: uuid } = require("uuid");

const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");

const logEvents = async (message, logName) => {
  const dateTime = `${format(new Date(), "yyyyMMdd\tHH:mm:ss")}`;
  const logItem = `${dateTime}\t${uuid()}\t${message}}`;

  console.log(logItem);

  try {
    if (!fs.existsSync(path.join(__dirname, "logs"))) {
      await fsPromises.mkdir(path.join(__dirname, "logs"));
    }
    await fsPromises.appendFile(path.join(__dirname, "logs", logName),logItem)

    // testing
  } catch (error) {
    console.log(error);
  }
};

module.exports = logEvents;

// console.log(format(new Date(), "'Today is a' eee"));
//OR
// console.log(format(new Date(), "yyyy-MM-dd HH:mm:ss"));
// console.log(uuid());
