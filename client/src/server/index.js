import axios from 'axios';

class Server {
    constructor() {
        this.server_url = 'http://localhost:8080'
    }
    async _send(options) {
        return axios(options).catch(function (error) {
            console.log(error);
        });
    }
    async getTableData() {
        return this._send({
            method: 'get',
            url: this.server_url + '/get-table-data'
        });
    }

    async getAggregatedTableData() {
        return this._send({
            method: 'get',
            url: this.server_url + '/get-aggregated-table'
        });
    }

    async currencyConvert(ccy, value) {
        return this._send({
            method: 'post',
            data: {
                ccy,
                value
            },
            url: this.server_url + '/currency-converter'
        });
    }

    async getSupportedCurrencies() {
        return this._send({
            method: 'get',
            url: this.server_url + '/supported-currencies'
        });
    }
}

const server = new Server();
export default server;