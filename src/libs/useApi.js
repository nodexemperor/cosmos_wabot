const axios = require('axios');

module.exports = async function useApi({ apiUrl, valoper, valcons, exponent, coingecko }) {
    
    // summary
    const summaryApi = await axios.get(`${apiUrl}/cosmos/base/tendermint/v1beta1/blocks/latest`);
    const height = summaryApi.data.block.header.height;
    const time = summaryApi.data.block.header.time;
    const fetchedAt = new Date();
    const latestBlockTime = new Date(time);
    const secondsAgo = Math.round((fetchedAt - latestBlockTime) / 1000);

    let tokenPrice = ' -';
    if (coingecko !== "") {
    const coingeckoApi = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${coingecko}&vs_currencies=usd`);
    tokenPrice = coingeckoApi.data[coingecko].usd;
    if (tokenPrice >= 1) {
        tokenPrice = tokenPrice.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
        }
    }    

    // summary

    // validator
    const validatorApi = await axios.get(`${apiUrl}/cosmos/staking/v1beta1/validators/${valoper}`);
    const validator = validatorApi.data.validator;

    const signingInfosRes = await axios.get(`${apiUrl}/cosmos/slashing/v1beta1/signing_infos`);
    const signingInfos = signingInfosRes.data.info;
    let missedBlocksCounter = 'N/A';
    for (const info of signingInfos) {
        if (info.address === valcons) {
            missedBlocksCounter = info.missed_blocks_counter;
            break;
        }
    }

    const slashingParamsRes = await axios.get(`${apiUrl}/cosmos/slashing/v1beta1/params`);
    const signedBlocks = parseInt(slashingParamsRes.data.params.signed_blocks_window);
    const signedBlocksFormatted = signedBlocks.toLocaleString();
    const missedPercentage = (missedBlocksCounter / signedBlocks) * 100;
    const uptimePercentage = (100 - missedPercentage).toFixed(2);
    
    const statusval = validator.status.replace('BOND_STATUS_', '');

    const tokensBigInt = BigInt(validator.tokens);
    const tokensInSymbol = Number(tokensBigInt / BigInt(10 ** exponent));
    const formattedTokens = tokensInSymbol.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    // validator

    return {
        height,
        secondsAgo,
        tokenPrice,
        validator,
        statusval,
        formattedTokens,
        missedBlocksCounter,
        signedBlocksFormatted,
        uptimePercentage };
}
