const express = require("express");
require("dotenv").config();

const router = express();
const puppeteer = require("puppeteer");

router.get(
  ["/api/1/puppeteer/", "/api/1/puppeteer/:page?"],
  async (req, res) => {
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

      res.setHeader("Access-Control-Allow-Origin", req.headers.origin);

      const browser = await puppeteer.launch();

      try {
        const page = await browser.newPage();

        await page.setViewport(whichView[req.query.mode || 'desktop']);
        await page.goto(req.query.url, {
          waitUntil: "networkidle2",
          timeout: 60000
        });

        const image = await page.screenshot({
          type: "png",
          fullPage: (req.query.full) === "yes" ? true: false,
        });
        await browser.close();
        res.set("Content-Type", "image/png");
        res.send(image);
      } catch (error) {
        console.log(error);
      }
    
  }
);

module.exports = router;
