const rp = require('request-promise');

class Helpers {

    getRateByCCY(ccyArr) {
        if (!ccyArr && ccyArr.length == 0) {
            throw new Error("missing CCY");
        }
        const options = {
            uri: 'http://www.apilayer.net/api/live',
            qs: {
                access_key: '808d073d26c2889ffb9ad4ce1b695a9b',
                currencies: ccyArr.join(',')
            },
            json: true
        };

        return rp(options);
    }
}

const helpers = new Helpers();
module.exports = helpers