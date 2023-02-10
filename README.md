Basic Webscraping using nodejs cheerio puppeteer mongodb

what i've tried:

website: https://www.sahamyab.com/hashtag/وبملت

- checked the content to wheter its static or dynamic content
- it was dynamic content so i had to mimic the browser api using puppeteer
- for the tweet section first i checked if the data is rendered in client side using api calls
- but it either was server rendered or they were using server components
- so i had to scrap the data using DOM manipulation using cheerio

features:
- login to website
- compatible with websites with dynamic content (spa)
- compatible with infinite scrolls (virtual lists)
- easy to debug with headles false and preinstalled chrome driver

to be implemented:
- observer or a specific interval to get new data
- implement a way to revalidate data
- improve performance and loadtime
- make it multi instance for better uptime
