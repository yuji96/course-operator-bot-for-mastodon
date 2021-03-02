module.exports = (axios, accountID) => {
  axios
    .post(`/v1/accounts/${accountID}/follow`)
    .then(() => {
      console.log(
        `${new Date().toUTCString()} | app/follow: followed the account-${accountID}`
      );
    })
    .catch((err) => {
      console.error("error", err);
    });
};
