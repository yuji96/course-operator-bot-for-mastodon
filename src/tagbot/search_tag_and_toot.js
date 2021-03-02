const createToot = require("../api/create_toot");
const getTagTimeline = require("../api/tag_timeline");
const favourite = require("../api/favourite");

module.exports = async (axios, env, tagbotConfig, tagbotStatus) => {
  const hasPreviousTagTimelineEndID = tagbotStatus.hasOwnProperty(
    "previous_tag_timeline_end_id"
  );
  let _tagbotStatus = { ...tagbotStatus };

  const timeline = await getTagTimeline(axios, tagbotConfig.target_tag);
  if (timeline === null) return;
  const newToots = timeline.filter((toot) =>
    hasPreviousTagTimelineEndID
      ? tagbotStatus.previous_tag_timeline_end_id < toot.id
      : true
  );
  if (!newToots.length) return _tagbotStatus;
  _tagbotStatus.previous_tag_timeline_end_id = newToots[0].id;

  newToots.forEach((toot) => {
    const url = `https://${env.HOST}/web/statuses/${toot.id}`;
    const mentions = tagbotConfig.transfar_groups.reduce((acc, group) => {
      const groupState = tagbotStatus.transfar_groups.filter(
        (element) => element.id === group.id
      )[0];
      if (groupState === null || groupState === undefined) return acc;
      return acc + `@${group.members[groupState.index]} `;
    }, "");
    const tootContent = tagbotConfig.transfar_comment
      .replace("<name>", toot.account.username)
      .replace("<content>", url)
      .replace("<mentions>", mentions);
    createToot(axios, tootContent, tagbotConfig.visibility);
    favourite(axios, toot.id);
  });

  return _tagbotStatus;
};
