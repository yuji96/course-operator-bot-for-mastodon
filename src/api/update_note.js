module.exports = (axios, note) => {
  const qs = {
    note: note,
  };

  axios
    .patch("/v1/accounts/update_credentials", qs)
    .then(() => {
      console.log(
        `${new Date().toUTCString()} | app/update_note: updated the note\n"${note}"`
      );
    })
    .catch((err) => {
      console.error("error", err);
    });
};
