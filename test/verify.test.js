const http = require("http");
const fs = require("fs");
const puppeteer = require("puppeteer");

let server;
let browser;
let page;

beforeAll(async () => {
  server = http.createServer((req, res) => {
    fs.readFile(__dirname + "/.." + req.url, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end(JSON.stringify(err));
        return;
      }
      res.writeHead(200);
      res.end(data);
    });
  });

  server.listen(process.env.PORT || 3000);
});

afterAll(() => {
  server.close();
});

beforeEach(async () => {
  browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  page = await browser.newPage();
  await page.goto("http://localhost:3000/index.html", { waitUntil: "domcontentloaded" });
});

afterEach(async () => {
  await browser.close();
});

describe('the index.js file', () => {
  it('should define a variable named courseLength', async () => {
    const courseLength = await page.evaluate(() => window.courseLength || undefined);
    expect(courseLength).toBeDefined();
  });

  it('should assign courseLength to the number 20', async () => {
    const courseLength = await page.evaluate(() => window.courseLength || undefined);
    expect(courseLength).toBe(20);
  });

  it('should assign the innerHTML of the HTML element with the id result to the courseLength', async () => {
    await page.waitForSelector('#result', { visible: true });

    const innerHtml = await page.$eval('#result', (result) => result.innerHTML);
    expect(innerHtml).toBe('20');
  });
});
