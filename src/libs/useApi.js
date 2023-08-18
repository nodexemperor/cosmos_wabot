const getApi = require('./getApi');

module.exports = async function useApi({ apiUrl, valoper, valcons, denom, exponent, coingecko }) {
  let apiData;
    if (coingecko) {
      apiData = await getApi({ apiUrl, coingecko, valoper, valcons });
    } else {
      apiData = await getApi({ apiUrl, valoper, valcons });
}
    
    // summary
    const height = apiData.summaryApi.data.block.header.height;
    const chainId = apiData.summaryApi.data.block.header.chain_id;
    const time = apiData.summaryApi.data.block.header.time;
    const fetchedAt = new Date();
    const latestBlockTime = new Date(time);
    const secondsAgo = Math.round((fetchedAt - latestBlockTime) / 1000);

    let tokenPrice = ' -';

    if (apiData.coingeckoApi) {
      if (apiData.coingeckoApi.data[coingecko]) {
    if (coingecko !== null) {
        tokenPrice = apiData.coingeckoApi.data[coingecko].usd;
        if (tokenPrice >= 1) {
            tokenPrice = tokenPrice.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
          }
        }
      }
    }

    // summary

    // validator
    const validator = apiData.validatorApi.data.validator;

    const moniker = validator.description.moniker;

    const missedBlocksCounter = apiData.signingInfosApi.data.val_signing_info.missed_blocks_counter;

    const signedBlocks = parseInt(apiData.slashingParamsApi.data.params.signed_blocks_window);
    const signedBlocksFormatted = signedBlocks.toLocaleString();
    const missedPercentage = (missedBlocksCounter / signedBlocks) * 100;
    const uptimePercentage = (100 - missedPercentage).toFixed(2);

    function convertJail(jailed) {
        if (jailed === false) {
          return 'No';
        } else if (jailed === true) {
          return 'Yes';
        } else {
          return jailed;
        }
    }
    const jailStatus = convertJail(validator.jailed);
    
    function convertStatus(status) {
        if (status === 'BOND_STATUS_BONDED') {
          return 'Active';
        } else if (status === 'BOND_STATUS_UNBONDED', 'BOND_STATUS_UNBONDING') {
          return 'Inactive';
        } else {
          return status;
        }
    }
    const bondStatus = convertStatus(validator.status);

    let commissions = "N/A";

    if (apiData.commissionApi) {
      if (apiData.commissionApi.data.commission) {
    const commission = apiData.commissionApi.data.commission.commission;
    let commissionAmount = null;

    for (let i = 0; i < commission.length; i++) {
      if (commission[i].denom === denom) {
        commissionAmount = commission[i].amount;
        break;
      }
    }

    if (commissionAmount) {
        const commissionFormated = parseFloat(commissionAmount) / (10 ** exponent);
        commissions = commissionFormated.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2});
        }
      }
    }

    const bondedFormated = Number(BigInt(validator.tokens) / BigInt(10 ** exponent));
    const totalBonded = bondedFormated.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    // validator

    return {
        height,
        chainId,
        secondsAgo,
        tokenPrice,
        moniker,
        jailStatus,
        bondStatus,
        commissions,
        totalBonded,
        missedBlocksCounter,
        signedBlocksFormatted,
        uptimePercentage };
}
