import './utils/moduleAlias';

import * as puppeteer from 'puppeteer';
import logger from 'euberlog';

async function main() {
    logger.info('Starting');
    const args = ['--proxy-server=socks5://127.0.0.1:9050'];
    const browser = await puppeteer.launch({ args });
    const page = await browser.newPage();
    await page.goto('https://check.torproject.org/');
    const isUsingTor = await page.$eval('body', el =>
        el.innerHTML.includes('Congratulations. This browser is configured to use Tor')
    );

    if (!isUsingTor) {
        logger.warning('Not using Tor. Closing...');
    }
    else {
        logger.info('Using Tor. Continuing... ');

        await page.goto('http://lockbitapt6vx57t3eeqjofwgcglmutr3a35nygvokja5uuccip4ykyd.onion/post/kmhWMR1nQDm7vn6Q61d085f0902a9');

        const titleSelector = 'div.post-big-title';
        await page.waitForSelector(titleSelector);

        const title = await page.$eval(titleSelector, (el: any) => el.innerText);
        logger.success(title);
    }
    await browser.close();
}
main();