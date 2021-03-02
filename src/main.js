require("dotenv").config();
const axios = require("axios").create({
  baseURL: `https://${process.env.HOST}/api/`,
  timeout: 5000,
  headers: {
    Authorization: `Bearer ${process.env.BEARER_AUTHORIZATION_CODE}`,
  },
});
const fs = require("fs");

const tagbot = require("./tagbot");
const reminder = require("./reminder");
const subscriberManager = require("./subscriber_manager");
const operationListener = require("./operation_listener");
const loudspeaker = require("./loudspeaker");

module.exports = async () => {
  console.log(`${new Date().toUTCString()} | main: loop start`);
  const botConfig = JSON.parse(fs.readFileSync("./bot-config.json", "utf8"));
  let _botStatus = JSON.parse(fs.readFileSync("./bot-status.json", "utf8"));
  const now = new Date();

  let operations;
  await Promise.all([
    tagbot(axios, botConfig, _botStatus, now).then((value) => {
      _botStatus.tagbot = value;
    }),
    operationListener(axios, _botStatus).then((value) => {
      _botStatus.operation_listener = value.status;
      operations = value.operations;
    }),
  ]);
  await subscriberManager(axios, botConfig, _botStatus, operations).then(
    (value) => {
      _botStatus.subscriber_manager = value;
    }
  );
  await Promise.all([
    reminder(axios, botConfig, _botStatus, now).then((value) => {
      _botStatus.reminder = value;
    }),
    loudspeaker(axios, botConfig, _botStatus, operations, now),
  ]);

  _botStatus.updated_at = now.toUTCString();
  fs.writeFileSync("./bot-status.json", JSON.stringify(_botStatus, null, "  "));
};
