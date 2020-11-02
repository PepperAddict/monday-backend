const express = require("express");
require("dotenv").config();
const { firefox, chromium} = require("playwright");

const router = express();

router.get(["/api/1/play/", "/api/1/play/:page?"], async (req, res) => {

    const whichView = {
        mobile: {
          width: 375,
          height: 667,
          deviceScaleFactor: 2,
          isMobile: true,
          hasTouch: true,
          isLandscape: false,
        },
        tablet: {
          width: 768,
          height: 1024,
          deviceScaleFactor: 2,
          isMobile: true,
          hasTouch: true,
          isLandscape: false,
        },
        desktop: {
          width: 1200,
          height: 800,
        },
      };

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  const args = [
    '--disable-gpu',
    '--no-sandbox',
    '--disable-web-security',
    '--disable-dev-profile',
  ]

  const browser = (req.query.full) ? await firefox.launch({args}) : await chromium.launch({args});
  const page = await browser.newPage();

  await page.setViewportSize(whichView[req.query.mode || "desktop"])
  await page.goto(req.query.url);
  
  const image = await page.screenshot({type: 'png', fullPage: req.query.full === "yes" ? true : false,
})
  await browser.close();
  res.set("Content-Type", "image/png");
  res.send(image);
});

module.exports = router;