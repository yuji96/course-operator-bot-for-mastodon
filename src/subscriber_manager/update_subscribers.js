const favourite = require("../api/favourite");
const follow = require("../api/follow");
const addAccountsToList = require("../api/add_accounts_to_list");

module.exports = async (
  axios,
  subscriberManagerConfig,
  subscriberManagerStatus,
  operations
) => {
  let accountIDs = [];
  for (let i = 0; i < subscriberManagerConfig.subscriber_lists.length; i++)
    accountIDs.push([]);
  operations.forEach((operation) => {
    const listIndex = subscriberManagerConfig.subscriber_lists.reduce(
      (acc, list, index) => (list.name === operation.args[0] ? index : acc),
      -1
    );
    if (!~listIndex) return;
    favourite(axios, operation.toot_id);
    follow(axios, operation.account.id);
    accountIDs[listIndex].push(operation.account.id);
  });

  accountIDs
    .filter((ids) => ids.length)
    .forEach((ids, index) =>
      addAccountsToList(
        axios,
        subscriberManagerStatus.subscriber_lists[index].list_id,
        ids
      )
    );
};
