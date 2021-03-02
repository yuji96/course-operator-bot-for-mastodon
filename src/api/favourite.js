module.exports = (axios, statusID) => {
  axios
    .post(`/v1/statuses/${statusID}/favourite`)
    .then(() => {
      console.log(
        `${new Date().toUTCString()} | app/favourite: made a toot-${statusID} favourite`
      );
    })
    .catch((err) => {
      console.error("error", err);
    });
};
