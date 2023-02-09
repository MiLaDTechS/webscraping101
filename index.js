
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const mongoose = require('mongoose');
const ScrapedData = require('./sdSchema');
mongoose.set('strictQuery', false)

const BASE_URL = 'https://www.sahamyab.com'
const NAMAD = '/hashtag/وبملت'
const NAMAD_URL = BASE_URL + NAMAD;
const LOGIN_URL = BASE_URL + '/login'

const BLOCKED_RESOURCES = ['image', 'font', 'media'];

const main = async () => {

    try {

        // connect to mongodb atlas
        await mongoose.connect('mongodb+srv://<username>:<password>@cluster0.yh6ya.mongodb.net/webscraping?retryWrites=true&w=majority');

        console.log('DB CONNECTED');

        const browser = await puppeteer.launch({
            headless: true,
            defaultViewport: null,
            args: [
                // '--start-maximized',
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--lang=en-US,en;q=0.9'
            ],
        });

        const page = await browser.newPage();

        // block unneccesary media/font/image
        await page.setRequestInterception(true);
        page.on('request', (req) => {
            if (BLOCKED_RESOURCES.includes(req.resourceType())) {
                req.abort();
            }
            else {
                req.continue();
            }
        });

        // networkidle0 = Wait 500ms when everything loaded
        // Login to get more twits (annonymus rate is 100)
        await page.goto(LOGIN_URL, { waitUntil: 'networkidle0', timeout: 0 });
        await page.type('.boxInputUserName input', '<sahamyab username>');
        await page.type('.passInput', '<sahaymyab password>');
        await page.click('form[name="twit-login-box"] button[type=submit]');
        await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 0 })

        // redirect to namad url
        await page.goto(NAMAD_URL, { waitUntil: 'networkidle0', timeout: 0 });

        // parse the html content
        const body = await page.evaluate(() => {
            return document.querySelector('body').innerHTML;
        });

        // jquery for node
        const $ = cheerio.load(body);
        let scrapedData = []

        // filter and select data
        $('app-twit-input-show').each((index, element) => {

            // ignore the ads section
            if ($(element).find('.textAdvertise').length === 1) {
                return;
            }

            let data = {}

            data['website'] = BASE_URL
            data['namad_url'] = NAMAD_URL
            data['twit_text'] = $(element).find('.twitsContents').text()
            data['profile_url'] = BASE_URL + $(element).find('app-user-status-bar a.lastNameUser').attr('href')
            data['username'] = $(element).find('app-user-status-bar a.lastNameUser').attr('href').replace(/\//g, '')
            data['display_name'] = $(element).find('app-user-status-bar a.lastNameUser').text()
            data['likes'] = +$(element).find('.likeIcon').siblings('.count-container').text()
            data['comments_count'] = +$(element).find('.commentIcon').siblings('.count-container').text()
            data['is_retwit'] = false

            if ($(element).find('app-user-avatar-twitt').siblings('div').length === 1) {
                data['is_retwit'] = true
            }

            scrapedData.push(data)
        })

        // Save to mongodb atlas
        await ScrapedData.insertMany(scrapedData)

        // Close the browser.
        await browser.close();

    } catch (error) {
        throw error
    }
}

main()
    .then(() => {
        // successful ending 
        process.exit(0);
    })
    .catch(err => {
        // logging the error message 
        console.error(err);
        // unsuccessful ending 
        process.exit(1);
    });