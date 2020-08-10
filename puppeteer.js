const puppeteer = require('puppeteer');
const jsPackTools = require('js-packtools')();
const fs   = require('fs');

//arg[0] - account name



Array.prototype.unique=function(a){
    return function(){return this.filter(a)}}(function(a,b,c){return c.indexOf(a,b+1)<0
});

const open = async(a,b,c,d) => {
    const browser = await puppeteer.launch({
        timeout : 120 * 1000,
        headless: true
    });

    const page        = (await browser.pages())[0];
    const flatArray   = arr => [].concat(...arr);
    let cord;           //coordenadas inicial
    let currentCord;    //Cordenadas actual

    let account       = 'p._zaragoza';
    nextWhile         = true;

    console.log('Open instagram');



    await page.goto('https://instagram.com');

    await page.waitFor('input[name="username"]');
    await page.focus('input[name="username"]');
    await page.keyboard.type('@' + a);

    await page.waitFor('input[name="password"]');
    await page.focus('input[name="password"]');
    await page.keyboard.type(b);

    const submit = await page.$('button[type="submit"]');
    await submit.click();


    let arAccounts = c.split(',');
    console.log('arAccounts', arAccounts);
    for(let index=0;index<arAccounts.length; ++index){
        let getImgSrcAttr = [];
        console.log('entro en el for');
        console.log('arAccounts', arAccounts[index]);
        await page.waitFor(4000);
        await page.goto('https://www.instagram.com/' + arAccounts[index] + '/');
        await page.waitFor('.DINPA');

        let elHandle               = await page.$x('//*[@id="react-root"]/section/main/div/header/section/ul/li[1]/span');
        let lamudiNewPropertyCount = await page.evaluate(el => el.textContent, elHandle[0]); //cantidad de registros

        document.querySelector(`#${arAccounts[index]}-posts`).innerText = lamudiNewPropertyCount;

        while (nextWhile) {
            await page.evaluate(() => {
                document.querySelector('.DINPA').scrollIntoView();

            });
            await page.waitFor(4000);
            console.log(flatArray(getImgSrcAttr).unique().length, '==', lamudiNewPropertyCount.split(' ')[0]);
            if (flatArray(getImgSrcAttr).unique().length == lamudiNewPropertyCount.split(' ')[0]) {
                nextWhile = false;
            } else {
                getImgSrcAttr.push(await page.$$eval("article img", el => el.map(x => x.getAttribute("src"))));
            }
        }

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
        console.log(getImgSrcAttr);
        getImgSrcAttr[index].map(async (imgUrl, i) => {
            return await fetch(imgUrl, opts)
                .then(res => res.arrayBuffer())
                .then(response => {
                    console.log('---save');
                    fs.writeFileSync(dir + i + '.jpg', Buffer.from(response));
                })
                .catch(console.error);
        });
    }






    /*
    while (nextWhile) {

        cord = await page.evaluate((header) => {
            const {x, y} = header.getBoundingClientRect();
            return {x, y};
        }, header);
        await page.waitFor(4000);


        await page.evaluate(() => {
            document.querySelector('.DINPA').scrollIntoView();

            window.addEventListener("scroll", function (event) {
                var scroll = this.scrollY;
                console.log(scroll)
            });

        });

        await page.waitFor(4000);

        currentCord = await page.evaluate((header) => {
            const {x, y} = header.getBoundingClientRect();
            return {x, y};
        }, header);

        console.log(cord, currentCord);



        if (currentCord !== undefined && currentCord.y === cord.y) {
            nextWhile = false;
        } else {
            getImgSrcAttr.push(await page.$$eval("article img", el => el.map(x => x.getAttribute("src"))));
        }
        console.log(flatArray(getImgSrcAttr).length)
    }
*/




};

/*
function extractImages(account) {

    let item        = $('.DINPA');
    const DIV_POST  = '//*[@id="react-root"]/section/main/div/header/section/ul/li[1]/span';
    let post        = $(DIV_POST).getText();

    u.logExecution(post);


    // browser.waitUntil(function () {
    // }, 600000, 'error nuca llega ha ser igual durante 60 seg.');
    let withfot = true;
    while(withfot){
        cord = browser.getElementLocation(item.ELEMENT);
        item.scrollIntoView();

        browser.pause(4000);


        currentCord = browser.getElementLocation(item.ELEMENT);
        if (currentCord !== undefined && currentCord.y === cord.y) {
            withfot = false;
        }else{
            $$('article img').forEach(img => {
                //browser.pause(1000);
                getImgSrcAttr.push(img.getAttribute('src'));
            });
        }
    }

    getImgSrcAttr = _.uniq(_.flattenDeep(getImgSrcAttr));
    u.logExecution(getImgSrcAttr.length+' Descargado');
    //u.logExecution(JSON.stringify(getImgSrcAttr));
    //console.log(JSON.stringify(getImgSrcAttr));



    let COOKIES = browser.getCookies();
    let arrayCookies = [];
    COOKIES.forEach(function (cookie) {
        arrayCookies.push(cookie.name + '=' + cookie.value);
    });
    arrayCookies = arrayCookies.join(';');
    getImgSrcAttr.forEach((imgUrl, index) => {
        let res = request('GET', imgUrl, {
            'headers': {
                'Cookie': arrayCookies
            }
        });
        dir = __dirname + '/images/' + account + '/';
        u.validateDir(dir);
        fs.writeFileSync(dir + index + '.jpg', res.getBody());
        //compressing.gzip.compressFile(dir, __dirname + '/images/account.zip')
    });
}
*/
module.exports = { open };


