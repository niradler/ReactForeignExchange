const FXController = require('../src/controllers/FXController/FXController');
const rp = require('request-promise');

test('getTableData', async() => {
  const options = {
    uri: 'http://localhost:8080/get-table-data',
    json: true
  };
  const response = await rp(options);
  expect(response.titles.length).toBe(5);
  expect(response.columns).toBeDefined();
});

test('getAggregatedTableData', async() => {
  const options = {
    uri: 'http://localhost:8080/get-aggregated-table',
    json: true
  };
  const response = await rp(options);
  expect(response.titles.length).toBe(2);
  expect(response.columns).toBeDefined();
});

test('getAggregatedTableData', async() => {
  const options = {
    uri: 'http://localhost:8080/get-aggregated-table',
    json: true
  };
  const response = await rp(options);
  expect(response.titles.length).toBe(2);
  expect(response.columns).toBeDefined();
});

test('currencyConvert', async() => {
  const options = {
    method: 'POST',
    uri: 'http://localhost:8080/currency-converter',
    body: {
      "ccy": "GBP",
      "value": "100"
    },
    json: true
  };

  const response = await rp(options);

  expect(response.source).toBe('GBP');
  expect(response.target).toBe('USD');
  expect(response.value).toBe('100');
  expect(response.rate).toBeDefined();
  expect(response.calculatedValue).toBeDefined();
});

test('getSupportedCurrencies', async() => {
  const options = {
    uri: 'http://localhost:8080/supported-currencies',
    json: true
  };
  const response = await rp(options);
  expect(response).toBeDefined();
});
