const { useVariable, useApi } = require('./libs');

module.exports = async function useStatus(network) {
    
    const vars = useVariable(network);

    const requiredVars = ['apiUrl', 'valoper', 'valcons', 'denom', 'symbol', 'exponent'];
    for (const varName of requiredVars) {
        if (!vars[varName]) {
            throw new Error(`[${network}] not response ${varName} check your .env`);
        }
    }

    try {

        const api = await useApi(vars);

        const statusNode = `*SUMMARY*\n` +
                           `Latest Block: ${api.height} (${api.secondsAgo} sec ago)\n` +
                           `Token Price: $${api.tokenPrice}\n\n`;

        const validatorInfo = `*VALIDATOR INFO*\n` +
                              `Moniker: ${api.moniker}\n` +
                              `Uptime: ${api.uptimePercentage}% / (${api.missedBlocksCounter} of ${api.signedBlocksFormatted} Blocks)\n` +
                              `Status: ${api.bondStatus}\n` +
                              `Jailed: ${api.jailStatus}\n` +
                              `Commission: ${api.commissions} ${vars.symbol}\n` +
                              `Total Bonded: ${api.totalBonded} ${vars.symbol}`;

        return statusNode + validatorInfo;
        } catch (error) {
        console.error(error);
    
    }
}
