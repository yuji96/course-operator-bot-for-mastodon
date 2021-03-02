const getDMNortifications = require("../api/dm_notifications");

module.exports = async (axios, botStatus) => {
  let _operationListenerStatus = botStatus.operation_listener;
  let operations = [];

  const hasPreviousDMNotificationsEndID = botStatus.operation_listener.hasOwnProperty(
    "previous_dm_notifications_end_id"
  );
  const dmNotifications = await getDMNortifications(
    axios,
    hasPreviousDMNotificationsEndID
      ? botStatus.operation_listener.previous_dm_notifications_end_id
      : null
  );
  if (dmNotifications === null) return _subscriberManagerStatus;
  // notification api のmin_idクエリが効かないのでここで対応
  const directTimeline = dmNotifications
    .filter(
      (notification) =>
        !hasPreviousDMNotificationsEndID ||
        notification.id >
          botStatus.operation_listener.previous_dm_notifications_end_id
    )
    .map((notification) => notification.status);

  if (!directTimeline.length)
    return { status: _operationListenerStatus, operations };
  _operationListenerStatus.previous_dm_notifications_end_id =
    dmNotifications[0].id;

  directTimeline.forEach((toot) => {
    const operationString = toot.content
      .replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, "")
      .match(/\\(.*)/);
    console.log(operationString);
    if (operationString === null) return;
    const operationDatas = operationString[1].split(/\s/);
    const operation = operationDatas[0];
    const options =
      operationDatas.length > 1
        ? operationDatas
            .slice(1)
            .filter((str) => str.match(/^--.*$/))
            .map((str) => str.slice(2))
        : [];
    const args =
      operationDatas.length > 1
        ? operationDatas.slice(1).filter((str) => str.match(/^--.*$/) === null)
        : [];
    operations.push({
      operation: operation,
      options: options,
      args: args,
      toot_id: toot.id,
      account: toot.account,
    });
  });

  return { status: _operationListenerStatus, operations: operations };
};
