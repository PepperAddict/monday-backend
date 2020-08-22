const express = require("express");
require("dotenv").config();
const router = express();
const formidable = require('formidable')
var fs = require('fs');
var fetch = require('node-fetch');

router.use(
  ["/api/1/mupload/", "/api/1/mupload/:page?"],
  async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    
    var updateid;
    new formidable.IncomingForm().parse(req)
    .on('field', (name, field) => {
      updateid = field
    })
    .on('file', (name, file) => {

    var url = "https://api.monday.com/v2/file";
    var boundary = "xxxxxxxxxx";
    var data = "";
    const query = `mutation ($file: File!){add_file_to_update (update_id: ${updateid}, file: $file) {id}}`

    fs.readFile(upfile =  file.path, function(err, content){
    
        // construct query part
        data += "--" + boundary + "\r\n";
        data += "Content-Disposition: form-data; name=\"query\"; \r\n";
        data += "Content-Type:application/json\r\n\r\n";
        data += "\r\n" + query + "\r\n";
    
        // construct file part
        data += "--" + boundary + "\r\n";
        data += "Content-Disposition: form-data; name=\"variables[file]\"; filename=\"" + upfile + file.name + "\"\r\n";
        data += "Content-Type:application/octet-stream\r\n\r\n";
        var payload = Buffer.concat([
                Buffer.from(data, "utf8"),
                new Buffer.from(content, 'binary'),
                Buffer.from("\r\n--" + boundary + "--\r\n", "utf8"),
        ]);
    
        // construct request options
        var options = {
            method: 'post',
            headers: {
              "Content-Type": "multipart/form-data; boundary=" + boundary,
              "Authorization" : process.env.MONDAY
            },
            body: payload,
        };
    
        // make request
        fetch(url, options)
          .then(res => res.json())
          .then(json => console.log(json)).catch((err) => console.log('no work'));
    });

    })
    .on('aborted', () => {
      console.error('Request aborted by the user')
    })
    .on('error', (err) => {
      console.error('Error', err)
      throw err
    })
    .on('end', () => {
      res.end()
    })

  }
);

module.exports = router;
