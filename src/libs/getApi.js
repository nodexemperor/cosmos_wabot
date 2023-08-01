const axios = require('axios');

module.exports = async function getApiData({ apiUrl, coingecko, valoper, valcons }) {
  const summaryApi = await axios.get(`${apiUrl}/cosmos/base/tendermint/v1beta1/blocks/latest`);
  const coingeckoApi = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${coingecko}&vs_currencies=usd`);
  const validatorApi = await axios.get(`${apiUrl}/cosmos/staking/v1beta1/validators/${valoper}`);
  const signingInfosApi = await axios.get(`${apiUrl}/cosmos/slashing/v1beta1/signing_infos/${valcons}`);
  const slashingParamsApi = await axios.get(`${apiUrl}/cosmos/slashing/v1beta1/params`);
  const commissionApi = await axios.get(`${apiUrl}/cosmos/distribution/v1beta1/validators/${valoper}/commission`);

  return {
    summaryApi,
    coingeckoApi,
    validatorApi,
    signingInfosApi,
    slashingParamsApi,
    commissionApi
  };
};
