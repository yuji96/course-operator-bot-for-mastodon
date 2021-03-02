const createToot = require("../api/create_toot");

module.exports = async (axios, bot, status, now) => {
  let _status = { ...status };
  let bio = `${bot.bio_title}\n`;

  const previousDate = new Date(status.updated_at);
  let limitDate = new Date(0);
  limitDate.setFullYear(
    previousDate.getFullYear() +
      parseInt((previousDate.getMonth() + bot.frequency_month) / 12)
  );
  limitDate.setMonth((previousDate.getMonth() + bot.frequency_month) % 12);
  limitDate.setDate(previousDate.getDate() + bot.frequency_date);
  limitDate.setHours(previousDate.getHours() + bot.frequency_hour);
  limitDate.setMinutes(previousDate.getMinutes() + bot.frequency_minute);
  limitDate.setSeconds(previousDate.getSeconds() + bot.frequency_second);

  if (limitDate - now <= 0) {
    let recentLimit,
      turnCount = 0;
    do {
      recentLimit = limitDate;
      turnCount++;
      limitDate.setFullYear(
        recentLimit.getFullYear() +
          parseInt((recentLimit.getMonth() + bot.frequency_month) / 12)
      );
      limitDate.setMonth((recentLimit.getMonth() + bot.frequency_month) % 12);
      limitDate.setDate(recentLimit.getDate() + bot.frequency_date);
      limitDate.setHours(recentLimit.getHours() + bot.frequency_hour);
      limitDate.setMinutes(recentLimit.getMinutes() + bot.frequency_minute);
      limitDate.setSeconds(recentLimit.getSeconds() + bot.frequency_second);
    } while (limitDate - now <= 0);

    let mentions = "",
      ccMentions = "";
    bot.transfar_groups.forEach((group) => {
      let presentMemberIndex, newMemberIndex;
      status.transfar_groups.forEach((element, index) => {
        if (element.id === group.id) {
          presentMemberIndex =
            (element.index + turnCount - 1) % group.members.length;
          newMemberIndex = (element.index + turnCount) % group.members.length;
          _status.transfar_groups[index].index = newMemberIndex;
          return false;
        }
      });
      mentions += `${group.group_name}: @${group.members[newMemberIndex]}\n`;
      ccMentions += `@${group.members[presentMemberIndex]} `;
      bio += `- ${group.group_name}: @${group.members[newMemberIndex]}\n`;
    });
    mentions = mentions.slice(0, mentions.length - 3);
    const tootContent = bot.take_turn_comment
      .replace("<content>", mentions)
      .replace("<mentions>", ccMentions);
    createToot(axios, tootContent, bot.visibility);
    _status.updated_at = recentLimit.toUTCString();
  } else {
    bot.transfar_groups.forEach((group) => {
      const groupStatus = status.transfar_groups.filter(
        (element) => element.id === group.id
      )[0];
      bio += `- ${group.group_name}: @${group.members[groupStatus.index]}\n`;
    });
  }

  return { status: _status, bio: bio };
};
