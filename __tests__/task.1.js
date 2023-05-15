const puppeteer = require("puppeteer");
const path = require('path');
const browserOptions = {
    headless: true,
    defaultViewport: null,
    devtools: true,
}
let browser;
let page;
let client;
let getListeners;

beforeAll(async () => {
    browser = await puppeteer.launch(browserOptions);
    page = await browser.newPage();
    await page.goto('file://' + path.resolve('./index.html'));
    client = await page.target().createCDPSession()
	getListeners = async result => await client.send('DOMDebugger.getEventListeners', {objectId: result.objectId})
}, 30000);

afterAll((done) => {
    browser.close();
    done();
});

const getVisible = els => els.filter(el => {
    const style = getComputedStyle(el)
    const rect = el.getBoundingClientRect();
    return style.visibility !== 'hidden' && style.display !== 'none' && !!(rect.bottom || rect.top || rect.height || rect.width)
})

describe('Dropdown', () => {
    it('Navigation uses `nav` tag', async () => {
        const header = await page.$('nav');
        expect(header).toBeTruthy();
    }),
    it('Dropdown items open when movie names are clicked', async () => {
        const visibleElements = await page.$$eval('nav *', getVisible)
        // find clickable element
        let found = false
        const {result: {value: numElements}} = await client.send('Runtime.evaluate', {expression: `document.querySelectorAll('nav *').length`})
        for (let index = 0; index < numElements; index++) {
            const { result } = await client.send('Runtime.evaluate', {expression: `document.querySelectorAll('nav *')[${index}]`})
            const { listeners } = await getListeners(result)
            if(listeners.find(l => l.type.match(/click|mouseup|mousedown/i))) {
                found = true
                await client.send('Runtime.evaluate', {expression: `document.querySelectorAll('nav *')[${index}].click()`})
            }
        }
        if(found) await page.waitForTimeout(500)
        const visibleElementsAfterClick = await page.$$eval('nav *', getVisible)
        expect(visibleElementsAfterClick).not.toEqual(visibleElements)
    })
   
})
