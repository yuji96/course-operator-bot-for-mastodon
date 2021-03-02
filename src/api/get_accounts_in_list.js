module.exports = async (axios, listID) => {
  let response;

  await axios
    .get(`/v1/lists/${listID}/accounts`)
    .then((res) => {
      response = res.data;
    })
    .catch((err) => {
      console.error("error", err);
      response = null;
    });

  return response;
};
