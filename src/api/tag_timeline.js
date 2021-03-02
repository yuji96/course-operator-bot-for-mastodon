module.exports = async (axios, hashtag) => {
  const qs = {
    limit: 20,
  };
  const url = encodeURI(`/v1/timelines/tag/${hashtag}`);

  let response;

  await axios
    .get(url, qs)
    .then((res) => {
      response = res.data;
    })
    .catch((err) => {
      response = null;
      console.error("error", err);
    });

  return response;
};
