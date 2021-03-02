const createToot = require("../api/create_toot");
const getAccountsInList = require("../api/get_accounts_in_list");

module.exports = async (
  axios,
  reminderConfig,
  reminderStatus,
  now,
  subscriberListStatuses
) => {
  if (
    reminderStatus.hasOwnProperty("scheduled_at") &&
    now - new Date(reminderStatus.scheduled_at) < 0
  )
    return { ...reminderStatus };

  const restDay = (reminderConfig.day - now.getDay() + 7) % 7;
  const scheduleDate = new Date(0);
  scheduleDate.setFullYear(now.getFullYear());
  scheduleDate.setMonth(now.getMonth());
  scheduleDate.setDate(now.getDate() + (restDay === 0 ? 7 : restDay));
  scheduleDate.setHours(reminderConfig.hour);
  scheduleDate.setMinutes(reminderConfig.minute);

  const subscriberList = subscriberListStatuses.filter(
    (listStatus) => listStatus.id === reminderConfig.target_subscriber_list_id
  )[0];
  const accountsRes = await getAccountsInList(axios, subscriberList.list_id);
  const targetAccountUsernames = accountsRes.map((account) => account.username);
  const mentions = targetAccountUsernames.reduce(
    (acc, username) => acc + `@${username} `,
    ""
  );

  const tootContent = reminderConfig.text.replace("<mentions>", mentions);
  const scheduleDateString = scheduleDate.toUTCString();
  const scheduledTootRes = await createToot(
    axios,
    tootContent,
    reminderConfig.visibility,
    scheduleDateString
  );
  if (scheduledTootRes === null) return { ...reminderStatus };

  const scheduleNotice = `a toot "${tootContent.replace(
    /@/g,
    "@ "
  )}" has been scheduled at ${scheduleDateString}.`;
  createToot(axios, scheduleNotice, "unlisted");

  return {
    ...reminderStatus,
    scheduled_at: scheduleDateString,
  };
};
