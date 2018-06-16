const {finUnits, positions} = require('../../data');
const helpers = require('../../helpers');

class FXController {
    constructor() {
        this.getTableData = this
            .getTableData
            .bind(this);
            this.getAggregatedTableData = this
            .getAggregatedTableData
            .bind(this);
    }

    _getFinUnitsWithPositions() {
        return positions.map((position) => {
            const fuOriginId = position.fuOriginId;
            const _finUnit = finUnits.filter((finUnit) => finUnit.id == fuOriginId);

            if (_finUnit) {
                _finUnit.position = position;
                return _finUnit;
            }
        })
    }

    _mergeByCurrencyAndId(finUnitsWithPositions) {
        const noDup = [];

        finUnitsWithPositions.forEach(finUnit => {
            let index = 0;
            const isNew = noDup.filter((_finUnit,i) => {
                if (_finUnit.position.data.currency.ccy == finUnit.position.data.currency.ccy && finUnit.id == _finUnit.id) {
                    index = i;
                    return true
                }
                
                 return false;
            });

            if (isNew.length > 0) {                
                noDup[index].position.data.currency.notionalValue += finUnit.position.data.currency.notionalValue;            
            }else{
                noDup.push(finUnit);
            }
        });

        return noDup;
    }

    async _setCurrencyRateUSD(finUnitsWithPositions) {
        const currencies = finUnitsWithPositions.map((finUnit) => finUnit.position.data.currency.ccy);
        try {
            const rateResponse = await helpers.getRateByCCY(currencies);

            finUnitsWithPositions = finUnitsWithPositions.map((finUnit) => {
                const currenciesKeys = Object.keys(rateResponse.quotes);
                const symbol = currenciesKeys.filter((k) => k.indexOf(finUnit.position.data.currency.ccy) > 1);

                finUnit.position.data.currency.rate = rateResponse.quotes[symbol];

                return finUnit;
            });

            return finUnitsWithPositions;
        } catch (err) {
            console.log('_setCurrencyRateUSD:', err);
        }

    }

    async _getTableData() {
        let finUnitsWithPositions = this._getFinUnitsWithPositions();

        finUnitsWithPositions = this._mergeByCurrencyAndId(finUnitsWithPositions);
        finUnitsWithPositions = await this._setCurrencyRateUSD(finUnitsWithPositions);
        
        const table = {
            titles: [
                'Financial Unit Name', 'National Value', 'Rate', 'Currency', 'Calculated Value'
            ],
            columns: finUnitsWithPositions.map((col) => {
                return {
                    id: col[0].id,
                    financialUnitName: col[0].name,
                    nationalValue: col.position.data.currency.notionalValue.toFixed(4),
                    rate: (1 / col.position.data.currency.rate).toFixed(4),
                    currency: col.position.data.currency.ccy,
                    calculatedValue: (col.position.data.currency.notionalValue * (1 / col.position.data.currency.rate)).toFixed(4)
                }
            })
        }

        return table;
    }

    _getAggregatedCalculatedValueTable(table) {
        const columns = [];

        table.columns.forEach(finUnit => {
            let index = 0;
            const isNew = columns.filter((_finUnit,i) => {
                if (finUnit.id == _finUnit.id) {
                    index = i;
                    return true
                }
                
                 return false;
            });

            if (isNew.length > 0) {                
                columns[index].calculatedValue = Number(columns[index].calculatedValue) + Number(finUnit.calculatedValue);            
            }else{
                columns.push({
                    id: finUnit.id,
                    financialUnitName: finUnit.financialUnitName,
                    calculatedValue: finUnit.calculatedValue
                });
            }
        });

        table.columns = columns;
        table.titles = ['Financial Unit Name', 'Calculated Value'];

        return table;
    }

    async getTableData(req, res) {
        try {
            const table = await this._getTableData();

            return res
                 .status(200)
                 .json({...table});
        } catch (error) {
            return res
                 .status(500)
                 .json({});
        }

    }

    async getAggregatedTableData(req, res) {
        try {
            const table = await this._getTableData();
            const aggregatedTable = this._getAggregatedCalculatedValueTable(table);
    
            return res
                 .status(200)
                 .json({...aggregatedTable});
        } catch (error) {
            return res
                 .status(500)
                 .json({err:error});
        }

    }

    async currencyConvert(req, res) {
        const {ccy, value} = req.body;

        try {
            const rateResponse = await helpers.getRateByCCY([ccy]);
            const rate = 1 / rateResponse.quotes['USD' + ccy];

            return res
            .status(200)
            .json({
                source: ccy,
                target: 'USD',
                value: value,
                rate,
                calculatedValue: (value * rate)
            });
        } catch (err) {
            console.log('currencyConvert:', err);
        }
    }

    async getSupportedCurrencies(req, res) {
        try {
            const rateResponse = await helpers.getSupportedCurrencies();
            const currencies = Object.keys(rateResponse.currencies);

            return res
            .status(200)
            .json(currencies);
        } catch (err) {
            console.log('getSupportedCurrencies:', err);
        }        
    }
}

const fxController = new FXController();
module.exports = fxController;