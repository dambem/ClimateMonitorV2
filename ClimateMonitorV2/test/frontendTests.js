const chai = require('chai');
const assert = require('assert');
const expect = chai.expect;

describe('check browser', function () {
    it('should work', async function () {
        console.log(await browser.version());
        expect(true).to.be.true;
    });
});

describe('Front page tests', function () {
    let page;

    before (async function () {
        page = await browser.newPage();
        await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
    });

    after (async function () {
        await page.close();
    });

    it('Check title', async () => {
        var title = await page.title();
        console.log(title);
        assert.equal(title, 'SheffSenseV2: Sheffield Climate Monitor', 'Invalid title');
    }).timeout(0);

    it('Checks links in nav', async () => {
        var results = await page.evaluate(async() => {
            results_arr = []
            results_arr.push(document.getElementsByClassName('nav-link')[0].innerHTML)
            results_arr.push(document.getElementsByClassName('nav-link')[1].innerHTML)

            return results_arr;

        });

        console.log(results);

        expect(results[0]).to.equal('About');
        expect(results[1]).to.equal('Detailed Statistics');


        return true;
    }).timeout(0);

    it('Checks active link in nav', async () => {
        var results = await page.evaluate(async() => {
            results = document.getElementsByClassName('nav-link-active')[0].innerHTML
            return results;
        });

        console.log(results);

        expect(results).to.equal('Home');

        return true;
    }).timeout(0);

    it('Checks sidebar footer', async () => {
        var results = await page.evaluate(async() => {
            results = document.getElementsByClassName('sidebar-footer')[0].innerHTML
            return results;
        });

        console.log(results);

        expect(results).to.equal('<a href="https://urbanflows.ac.uk/" target="_blank"><img class="img-fluid" id="urbanflowsimage" src="images/urbanlogo.png"></a>');

        return true;
    }).timeout(0);

    it('Checks sidebar footer image', async () => {
        var results = await page.evaluate(async() => {
            results = document.getElementById('urbanflowsimage').src
            return results;
        });

        console.log(results);

        expect(results).to.equal('http://localhost:3000/images/urbanlogo.png');

        return true;
    }).timeout(0);

    it('Checks h5 text', async () => {
        var results = await page.evaluate(async() => {
            results = document.getElementsByTagName('h5')[0].innerHTML
            return results;
        });

        console.log(results);

        expect(results).to.equal('PM10 and PM2.5 Values Of Sensor ');

        return true;
    }).timeout(0);

    it('Checks h3 text', async () => {
        var results = await page.evaluate(async() => {
            results_arr = []
            results_arr.push(document.getElementsByTagName('h3')[0].innerHTML)
            results_arr.push(document.getElementsByTagName('h3')[1].innerHTML)
            return results_arr;
        });

        console.log(results);

        expect(results[0]).to.equal('PM10 and PM2.5 Pollution Guidelines');
        expect(results[1]).to.equal('But what do the pollution values actually mean?');


        return true;
    }).timeout(0);

    it('Checks footer image', async () => {
        var results = await page.evaluate(async() => {
            results = document.getElementsByTagName('footer')[0].innerHTML
            return results;
        });

        console.log(results);

        expect(results).to.equal('<div class="container text-center"><a href="https://urbanflows.ac.uk/"><img class="img-fluid" src="images/urbanflows.png" href="https://urbanflows.ac.uk/"></a></div>');

        return true;
    }).timeout(0);

});

describe ('About page tests', function () {
    let page;

    before (async function () {
        page = await browser.newPage();
        await page.goto('http://localhost:3000/about', { waitUntil: 'domcontentloaded' });
    });

    after (async function () {
        await page.close();
    });

    it('Check title', async () => {
        var title = await page.title();
        console.log(title);
        assert.equal(title, 'About SheffSenseV2', 'Invalid title');
    }).timeout(0);

    it('Checks links in nav', async () => {
        var results = await page.evaluate(async() => {
            results_arr = []
            results_arr.push(document.getElementsByClassName('nav-link')[0].innerHTML)
            results_arr.push(document.getElementsByClassName('nav-link')[1].innerHTML)

            return results_arr;

        });

        console.log(results);

        expect(results[0]).to.equal('Home');
        expect(results[1]).to.equal('Detailed Statistics');


        return true;
    }).timeout(0);

    it('Checks active link in nav', async () => {
        var results = await page.evaluate(async() => {
            results = document.getElementsByClassName('nav-link-active')[0].innerHTML
            return results;
        });

        console.log(results);

        expect(results).to.equal('About');

        return true;
    }).timeout(0);

    it('Checks sidebar footer', async () => {
        var results = await page.evaluate(async() => {
            results = document.getElementsByClassName('sidebar-footer')[0].innerHTML
            return results;
        });

        console.log(results);

        expect(results).to.equal('<a href="https://urbanflows.ac.uk/" target="_blank"><img class="img-fluid" id="urbanflowsimage" src="images/urbanlogo.png"></a>');

        return true;
    }).timeout(0);

    it('Checks sidebar footer image', async () => {
        var results = await page.evaluate(async() => {
            results = document.getElementById('urbanflowsimage').src
            return results;
        });

        console.log(results);

        expect(results).to.equal('http://localhost:3000/images/urbanlogo.png');

        return true;
    }).timeout(0);
});

describe ('Detailed Statistics page tests', function () {
    let page;

    before (async function () {
        page = await browser.newPage();
        await page.goto('http://localhost:3000/detailedstats', { waitUntil: 'domcontentloaded' });
    });

    after (async function () {
        await page.close();
    });

    it('Check title', async () => {
        var title = await page.title();
        console.log(title);
        assert.equal(title, 'SheffSenseV2: Detailed Statistics', 'Invalid title');
    }).timeout(0);

    it('Checks links in nav', async () => {
        var results = await page.evaluate(async() => {
            results_arr = []
            results_arr.push(document.getElementsByClassName('nav-link')[0].innerHTML)
            results_arr.push(document.getElementsByClassName('nav-link')[1].innerHTML)

            return results_arr;

        });

        console.log(results);

        expect(results[0]).to.equal('Home');
        expect(results[1]).to.equal('About');


        return true;
    }).timeout(0);

    it('Checks active link in nav', async () => {
        var results = await page.evaluate(async() => {
            results = document.getElementsByClassName('nav-link-active')[0].innerHTML
            return results;
        });

        console.log(results);

        expect(results).to.equal('Detailed Statistics');

        return true;
    }).timeout(0);

    it('Checks sidebar footer', async () => {
        var results = await page.evaluate(async() => {
            results = document.getElementsByClassName('sidebar-footer')[0].innerHTML
            return results;
        });

        console.log(results);

        expect(results).to.equal('<a href="https://urbanflows.ac.uk/" target="_blank"><img class="img-fluid" id="urbanflowsimage" src="images/urbanlogo.png"></a>');

        return true;
    }).timeout(0);

    it('Checks sidebar footer image', async () => {
        var results = await page.evaluate(async() => {
            results = document.getElementById('urbanflowsimage').src
            return results;
        });

        console.log(results);

        expect(results).to.equal('http://localhost:3000/images/urbanlogo.png');

        return true;
    }).timeout(0);
});