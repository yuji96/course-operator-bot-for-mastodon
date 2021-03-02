const main = require("./src/main");

console.log(`${new Date().toUTCString()} | app: start`);
main();
setInterval(main, 5000);
