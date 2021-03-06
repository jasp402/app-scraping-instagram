const puppeteer = require('puppeteer');
const jsPackTools = require('js-packtools')();
const fs   = require('fs');
const open = async(a,b,c,d) => {
    const browser = await puppeteer.launch({
        timeout : 999 * 1000,
        headless: true
    });
    const page    = (await browser.pages())[0];
    await page.setDefaultNavigationTimeout(0);
    const flatArray = arr => [].concat(...arr);
    let nextWhile   = true;

    console.log('Open browser');

    await page.goto('https://instagram.com');

    await page.screenshot({path: `${__dirname}/screenshot/${new Date().getTime()}_buddy-screenshot.png`});

    console.log('go to instagram');

    await page.waitFor('input[name="username"]');
    await page.focus('input[name="username"]');
    await page.keyboard.type('@' + a);

    console.log('set username', a);

    await page.waitFor('input[name="password"]');
    await page.focus('input[name="password"]');
    await page.keyboard.type(b);

    console.log('set password', b);

    const submit = await page.$('button[type="submit"]');
    await submit.click();

    console.log('submit');

    let arAccounts = c.split(',');

    console.log('array to accounts', arAccounts);


    for(let index=0;index<arAccounts.length; ++index){
        let getImgSrcAttr = [];
        console.log('arAccounts', arAccounts[index]);
        await page.waitFor(4000);
        await page.goto('https://www.instagram.com/' + arAccounts[index] + '/');
        await page.screenshot({path: `${__dirname}/screenshot/${new Date().getTime()}_buddy-screenshot.png`});
        await page.waitFor('.DINPA');

        let elHandle               = await page.$x('//*[@id="react-root"]/section/main/div/header/section/ul/li[1]/span');
        let lamudiNewPropertyCount = await page.evaluate(el => el.textContent, elHandle[0]); //cantidad de registros

        document.querySelector(`#${String(arAccounts[index]).replace(/\./g,'_')}-posts`).innerText = lamudiNewPropertyCount;

        let firstImage = await page.$('article img');
        await firstImage.click();
        await page.waitFor(4000);

        while (nextWhile){
            try {
                await page.waitFor(4000);
                await page.waitFor('body article[role="presentation"]');

                let img = await page.$$eval('article[role="presentation"] img', el => el.map(x =>{
                    let atr = x.getAttribute("src");

                    return /_nc_cat/g.test(atr) ? atr : false;
                }).filter(Boolean));

                let video = await page.$$eval('article[role="presentation"] video', el => el.map(x => x.getAttribute("src")));

                console.log(img);
                console.log(video);

                getImgSrcAttr.push(img);
                getImgSrcAttr.push(video);

                let arrowRight = await page.waitForSelector('.coreSpriteRightPaginationArrow');
                await arrowRight.click();
                console.log(page.url());

            }
            catch (error) {
                nextWhile = false;
                console.log("Catch Error:", error)
            }


        }

        console.log(getImgSrcAttr);
        let getImgSrc = flatArray(getImgSrcAttr);
        const arrayCookies = await page.cookies();
        const cookie = arrayCookies.map(x => x.name + '=' + x.value).join(';');
        const opts = {
            method : "GET",
            headers: {
                'Cookie': cookie
            },
        };
        let dir = d + '/' + arAccounts[index] + '/';
        console.log(dir);
        jsPackTools.validateDir(dir);
        console.log(getImgSrc);
        getImgSrc.map(async (imgUrl, i) => {
            let ext = /mp4/g.test(imgUrl) ? '.mp4' : '.jpg';
            return await fetch(imgUrl, opts)
                .then(res => res.arrayBuffer())
                .then(response => {
                    console.log('---save');
                    fs.writeFileSync(dir + i + ext, Buffer.from(response));
                })
                .catch(console.error);
        });
        nextWhile = true;
    }

};

module.exports = { open };


