const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const ObjectsToCsv = require('objects-to-csv');

export default function Hidemy () {
    const puppeteer = require('puppeteer');
    const cheerio = require('cheerio');
    const ObjectsToCsv = require('objects-to-csv');

    (async () => {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto('https://hidemy.name/ru/proxy-list/');

        const content = await page.content();
        const $ = cheerio.load(content);

        const raw = $('tbody').html();
        const arr = raw.split('<td>');

        const parsedData = [];

        for (let i = 0; i < arr.length - 2; i += 7) {
            parsedData.push({
                field1: arr[i + 1].slice(0, -5),
                field2: arr[i + 2].slice(0, -5)
            });
        }

        await browser.close();

        const csv = new ObjectsToCsv(parsedData);
        await csv.toDisk('parsed_data.csv');

        console.log('Data has been parsed and saved to CSV file.');
    })();


return (
    <>
    </>
);

}