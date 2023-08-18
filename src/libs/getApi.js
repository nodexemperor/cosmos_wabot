const axios = require('axios');

module.exports = async function getApiData({ apiUrl, coingecko, valoper, valcons }) {
  const summaryApi = await axios.get(`${apiUrl}/cosmos/base/tendermint/v1beta1/blocks/latest`);

  let coingeckoApi;
    try {
        coingeckoApi = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${coingecko}&vs_currencies=usd`);
    } catch (error) {
      if (error.response && error.response.status === 429) {
      } else {
        throw error;
      }
    }

  const validatorApi = await axios.get(`${apiUrl}/cosmos/staking/v1beta1/validators/${valoper}`);
  const signingInfosApi = await axios.get(`${apiUrl}/cosmos/slashing/v1beta1/signing_infos/${valcons}`);
  const slashingParamsApi = await axios.get(`${apiUrl}/cosmos/slashing/v1beta1/params`);
  
  let commissionApi;
    try {
        commissionApi = await axios.get(`${apiUrl}/cosmos/distribution/v1beta1/validators/${valoper}/commission`);
    } catch (error) {
      if (error.response && error.response.status === 501) {
        commissionApi = null;
      } else {
        throw error;
      }
    }

  return {
    summaryApi,
    coingeckoApi,
    validatorApi,
    signingInfosApi,
    slashingParamsApi,
    commissionApi
  };
};
