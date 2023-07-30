const { useVariable, useApi } = require('./libs');

module.exports = async function useStatus(network) {
    
    const vars = useVariable(network);
    try {

        const api = await useApi(vars);

        const statusNode = `*SUMMARY*\n` +
                           `Latest Block: ${api.height} (${api.secondsAgo} sec ago)\n` +
                           `Token Price: $${api.tokenPrice}\n\n`;

        const validatorInfo = `*VALIDATOR INFO*\n` +
                              `Moniker: ${api.validator.description.moniker}\n` +
                              `Uptime: ${api.uptimePercentage}% / (${api.missedBlocksCounter} of ${api.signedBlocksFormatted} Blocks)\n` +
                              `Status: ${api.bondStatus}\n` +
                              `Jailed: ${api.jailStatus}\n` +
                              `Total Bonded: ${api.formattedTokens} ${vars.symbol}`;

        return statusNode + validatorInfo;
        } catch (error) {
        console.error(error);

    throw new Error(`ERROR getting API from ${vars.apiUrl} 💀⁉️`);
    
    }
}
