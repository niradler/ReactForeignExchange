const rp = require('request-promise');
const access_key = '05065217a91b8743c139f4cae2b3cb75';

class Helpers {

    getRateByCCY(ccyArr) {
        if (!ccyArr && ccyArr.length == 0) {
            throw new Error("missing CCY");
        }
        const options = {
            uri: 'http://www.apilayer.net/api/live',
            qs: {
                access_key,
                currencies: ccyArr.join(',')
            },
            json: true
        };

        return rp(options);
    }

    getSupportedCurrencies() {

        const options = {
            uri: 'http://apilayer.net/api/list',
            qs: {
                access_key
            },
            json: true
        };

        return rp(options);
    }
}

const helpers = new Helpers();
module.exports = helpers