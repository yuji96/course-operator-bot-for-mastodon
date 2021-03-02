module.exports = async (axios, min_id = null) => {
  const qs = {};
  if (min_id !== null) qs.min_id = min_id;

  let response;

  await axios
    .get("/v1/notifications", qs)
    .then((res) => {
      response = res.data.filter(
        (notification) => notification.type === "mention"
      );
    })
    .catch((err) => {
      response = null;
      console.error("error", err);
    });

  return response;
};
