

const express = require("express");
const router = express.Router();

const bodyParser = require("body-parser");
const server = express();

const http = require("http").createServer(server);

server.use(bodyParser.json());
server.use(
  bodyParser.urlencoded({
    extended: true
  })
);



router.get("/",(req, res) => {
  res.send('hello');
});



//puppeteer

const puppet = require('./middleware/puppet.js')
router.use(puppet)

const mupload = require('./middleware/mondayupload.js')
router.use(mupload)



server.use('/', router)

const PORT = process.env.PORT || 8383;
http.listen(PORT, () => {
  console.log("the server is listening in " + PORT);
});

module.exports = server;
