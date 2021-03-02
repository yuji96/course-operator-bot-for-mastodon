module.exports = (axios, listID, account_ids) => {
  const qs = {
    account_ids: account_ids,
  };

  axios
    .post(`/v1/lists/${listID}/accounts`, qs)
    .then((res) => {
      console.log(
        `${new Date().toUTCString()} | api/add_accounts_to_list: added the account-${account_ids} to the list-${listID}`
      );
    })
    .catch((err) => {
      console.error("error", err);
    });
};
