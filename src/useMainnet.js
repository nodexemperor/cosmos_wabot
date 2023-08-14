const { useVariable, useApi } = require('./libs');

module.exports = async function useMainnet(network) {
    
    const vars = useVariable(network);

    const requiredVars = {'apiUrl': `API`, 'valoper': `VALOPER`, 'valcons': `VALCONS`, 'denom': `DENOM`, 'symbol': `SYMBOL`, 'exponent': `EXPONENT` };
    for (const varName in requiredVars) {
        if (!vars[varName]) {
        throw new Error(`${network.toUpperCase()}_${requiredVars[varName]} 💀⁉️ please check your .env`);
        }
    }

    try {

        const api = await useApi(vars);

        const statusNode = `*SUMMARY*\n` +
                           `Chain ID: ${api.chainId}\n` +
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
        throw error;
    
    }
}
