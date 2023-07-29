const puppeteer = require('puppeteer');

async function getHTMLBody(url){
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: false,
        userDataDir: "./temp"
    });
    const page = await browser.newPage();
    await page.goto(url, {
        waitUntil: "load"
    });
    return {"page":page,"browser":browser};
}

module.exports = getHTMLBody