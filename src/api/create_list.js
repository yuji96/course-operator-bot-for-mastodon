module.exports = async (axios, title) => {
  let qs = {
    title: title,
  };

  let response;

  await axios
    .post("/v1/lists", qs)
    .then((res) => {
      console.log(
        `${new Date().toUTCString()} | api/create_list: created a list named ${title}`
      );
      response = res.data;
    })
    .catch((err) => {
      console.error("error", err);
      response = null;
    });

  return response;
};
