module.exports = async (axios, statusID) => {
  let response;

  await axios
    .get(`/v1/statuses/${statusID}/favourited_by`)
    .then((res) => {
      response = res.data;
    })
    .catch((err) => {
      response = null;
      console.error("error", err);
    });

  return response;
};
