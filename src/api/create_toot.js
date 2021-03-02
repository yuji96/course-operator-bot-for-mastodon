module.exports = async (axios, status, visibility, scheduledAt = null) => {
  let qs = {
    status: status,
    visibility: visibility,
  };

  if (scheduledAt !== null) qs.scheduled_at = scheduledAt;

  let response;

  await axios
    .post("/v1/statuses", qs)
    .then((res) => {
      console.log(
        `${new Date().toUTCString()} | api/create_toot: tooted\n"${status}"${
          scheduledAt !== null ? "\nwith being scheduled at " + scheduledAt : ""
        }`
      );
      response = res.data;
    })
    .catch((err) => {
      console.error("error", err);
      response = null;
    });

  return response;
};
