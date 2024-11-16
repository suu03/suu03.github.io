const { getDataConnect, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'default',
  service: 'su_portfolio_2025',
  location: 'us-central1'
};
exports.connectorConfig = connectorConfig;

