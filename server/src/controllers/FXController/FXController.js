const {finUnits, positions} = require('../../data');
const helpers = require('../../helpers');
const _ = require('lodash');

class FXController {
    constructor() {
        this.getTableData = this
            .getTableData
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

    async getTableData(req, res) {
        let finUnitsWithPositions = this._getFinUnitsWithPositions();

         finUnitsWithPositions = this._mergeByCurrencyAndId(finUnitsWithPositions);
        finUnitsWithPositions = await this._setCurrencyRateUSD(finUnitsWithPositions);
        
        const table = {
            titles: [
                'Financial Unit Name', 'National Value', 'Rate', 'Currency', 'Calculated Value'
            ],
            columns: finUnitsWithPositions.map((col) => {
                return {
                    financialUnitName: col[0].name,
                    nationalValue: col.position.data.currency.notionalValue.toFixed(4),
                    rate: (1 / col.position.data.currency.rate).toFixed(4),
                    currency: col.position.data.currency.ccy,
                    calculatedValue: (col.position.data.currency.notionalValue * (1 / col.position.data.currency.rate)).toFixed(4)
                }
            })
        }

        res
            .status(200)
            .json({table})
    }
}

const fxController = new FXController();
module.exports = fxController;