const updateNote = require("../api/update_note");

const searchTagAndToot = require("./search_tag_and_toot");
const checkTakeTurn = require("./check_take_turn");

module.exports = async (axios, botConfig, botStatus, now) => {
  let _tagbotStatuses = botStatus.tagbot;
  const tagbotConfigs = botConfig.tagbots;
  let bio = botConfig.description + "\n\n";

  await Promise.all(
    tagbotConfigs.map(async (tagbotConfig) => {
      if (tagbotConfig.is_active === "false") return;
      let statusIndex;
      const tagbotStatus = botStatus.tagbot.tagbots.filter((value, index) => {
        if (value.id === tagbotConfig.id) {
          statusIndex = index;
          return true;
        }
      })[0];
      if (tagbotStatus === undefined || tagbotStatus === null) return;
      let _tagbotStatus = { ...tagbotStatus };

      await checkTakeTurn(axios, tagbotConfig, _tagbotStatus, now).then(
        (value) => {
          _tagbotStatus = value.status;
          bio += value.bio + "\n";
        }
      );
      await searchTagAndToot(
        axios,
        process.env,
        tagbotConfig,
        _tagbotStatus
      ).then((value) => {
        _tagbotStatus = value;
      });

      _tagbotStatuses.tagbots[statusIndex] = _tagbotStatus;
    })
  );

  if (botStatus.tagbot.hasOwnProperty("recent_bio")) {
    if (botStatus.tagbot.recent_bio !== bio) updateNote(axios, bio);
  } else {
    updateNote(axios, bio);
  }
  _tagbotStatuses.recent_bio = bio;

  return _tagbotStatuses;
};
