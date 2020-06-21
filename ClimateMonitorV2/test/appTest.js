const chai = require('chai')
const expect = chai.expect


describe('sample test', function () {
    it('should work', async function () {
        console.log(await browser.version());

        expect(true).to.be.true;
    });
});

describe('new_mapping handler', function () {
    let page;

    before (async function () {
        page = await browser.newPage();
        await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
    });

    after (async function () {
        await page.close();
    })


    it('returns the correct pollution levels', async () => {

        const results = await page.evaluate(x => {
            result_arr = [];
            result_arr.push(colorForPollutionPhrase(0,0));
            result_arr.push(colorForPollutionPhrase(20,10));
            result_arr.push(colorForPollutionPhrase(30,15));
            result_arr.push(colorForPollutionPhrase(50,25));
            result_arr.push(colorForPollutionPhrase(70,35));
            result_arr.push(colorForPollutionPhrase(100,50));
            result_arr.push(colorForPollutionPhrase(150,75));
            result_arr.push(colorForPollutionPhrase(151,76));

            return result_arr;
        }, 7);

        console.log(results);

        expect(results[0]).to.equal('The pollution levels are currently within WHO guidelines!');
        expect(results[1]).to.equal('The pollution levels are just above WHO guidelines for safe pollution, and can lead to long term health issues');
        expect(results[2]).to.equal('The pollution levels are above WHO guidelines for safe pollution, and can lead to long term health issues');
        expect(results[3]).to.equal('The pollution levels are above WHO guidelines for safe pollution, and can lead to long term health issues');
        expect(results[4]).to.equal('The pollution levels are above WHO guidelines for safe pollution, and can lead to long term health issues');
        expect(results[5]).to.equal('The pollution levels are dangerously above WHO guidelines for safe pollution, and can lead to long <b> and </b> short term health issues');
        expect(results[6]).to.equal('The pollution levels are <b> dangerously </b> above WHO guidelines for safe pollution, and can lead to long and short term health issues');
        expect(results[7]).to.equal('The pollution levels are <b> dangerously </b> above WHO guidelines for safe pollution, and can lead to long and short term health issues');
    }).timeout(0);

    it('returns the correct link given a date', async () => {

        const results = await page.evaluate(x => {
            result_arr = [];

            result_arr.push(build_link_from_date(new Date('January 1, 2019 12:00:00')));
            result_arr.push(build_link_from_date(new Date('December 25, 2019 12:00:00')));


            return result_arr;
        }, 7);

        console.log(results);

        expect(results[0]).to.equal('http://archive.sensor.community/2019-01-01/2019-01-01_sds011_sensor_0.csv');
        expect(results[1]).to.equal('http://archive.sensor.community/2019-12-25/2019-12-25_sds011_sensor_0.csv');


    }).timeout(0);


});
