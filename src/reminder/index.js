const checkDateAndToot = require("./check_date_and_toot");

module.exports = async (axios, botConfig, botStatus, now) => {
  let _reminderStatuses = botStatus.reminder;
  const reminderConfigs = botConfig.reminders;
  const subscriberListStatuses = botStatus.subscriber_manager.subscriber_lists;

  await Promise.all(
    reminderConfigs.map(async (reminderConfig) => {
      if (reminderConfig.is_active === "false") return;
      const {
        index: reminderStatusIndex,
        status: reminderStatus,
      } = botStatus.reminder.reminders.reduce((acc, element, index) => {
        if (element.id === reminderConfig.id) {
          return { index: index, status: element };
        }
        return acc;
      }, {});
      let _reminderStatus = { ...reminderStatus };
      await checkDateAndToot(
        axios,
        reminderConfig,
        _reminderStatus,
        now,
        subscriberListStatuses
      ).then((value) => (_reminderStatus = value));
      _reminderStatuses.reminders[reminderStatusIndex] = _reminderStatus;
    })
  );

  return _reminderStatuses;
};
