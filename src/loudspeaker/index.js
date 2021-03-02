const createToot = require("../api/create_toot");
const getAccountsInList = require("../api/get_accounts_in_list");
const favorite = require("../api/favourite");

module.exports = async (axios, botConfig, botStatus, operations, now) => {
  const subscriberManagerConfig = botConfig.subscriber_manager;
  const subscriberManagerStatus = botStatus.subscriber_manager;
  const loudspeakerOperations = operations.filter(
    (operation) => operation.operation === "loudspeaker"
  );

  await Promise.all(
    loudspeakerOperations.map(async (operation) => {
      const isRemindMode = operation.options.some(
        (option) => option === "remind"
      );
      let index = 0;
      let scheduleDate;
      if (isRemindMode) {
        const date = operation.args[index++].split("-");
        if (date.length !== 5) return;
        const presentYear = now.getFullYear();
        scheduleDate = new Date(
          presentYear,
          date[0] - 1,
          date[1],
          date[2],
          date[3],
          date[4]
        );
        if (scheduleDate - now <= 0) scheduleDate.setFullYear(presentYear + 1);
      }
      const targetListName = operation.args[index++];
      const body = operation.args.slice(index).join(" ");
      if (body === "") return;

      const targetListConfigID = subscriberManagerConfig.subscriber_lists.reduce(
        (acc, list) => (list.name === targetListName ? list.id : acc),
        ""
      );
      const targetListDBID = subscriberManagerStatus.subscriber_lists.reduce(
        (acc, list) => (list.id === targetListConfigID ? list.list_id : acc),
        ""
      );
      if (targetListDBID === "") return;
      const accounts = await getAccountsInList(axios, targetListDBID);
      if (accounts === null) return;
      const mentions = accounts.reduce(
        (acc, account) => `@${account.username} `,
        ""
      );

      const tootContent = body + "\n" + mentions;
      createToot(
        axios,
        tootContent,
        "direct",
        isRemindMode ? scheduleDate.toUTCString() : null
      );
      favorite(axios, operation.toot_id);
    })
  );
};
