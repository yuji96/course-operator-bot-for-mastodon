const createList = require("../api/create_list");

const updateSubscribers = require("./update_subscribers");

module.exports = async (axios, botConfig, botStatus, operations) => {
  let _subscriberManagerStatus = botStatus.subscriber_manager;
  const subscriberManagerConfig = botConfig.subscriber_manager;

  await Promise.all(
    subscriberManagerConfig.subscriber_lists.map(
      async (subscriberListConfig) => {
        let _subscriberListStatus = botStatus.subscriber_manager.subscriber_lists.reduce(
          (acc, element) =>
            element.id === subscriberListConfig.id ? element : acc,
          {}
        );
        if (!Object.keys(_subscriberListStatus).length) {
          const res = await createList(axios, subscriberListConfig.name);
          _subscriberListStatus = {
            id: subscriberListConfig.id,
            list_id: res.id,
          };
          _subscriberManagerStatus.subscriber_lists.push(_subscriberListStatus);
        }
      }
    )
  );

  const subscribeOperations = operations.filter(
    (operation) => operation.operation === "subscribe"
  );
  if (subscribeOperations.length) {
    await updateSubscribers(
      axios,
      subscriberManagerConfig,
      _subscriberManagerStatus,
      subscribeOperations
    );
  }

  return _subscriberManagerStatus;
};
