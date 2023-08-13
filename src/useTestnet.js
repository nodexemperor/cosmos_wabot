const { useVariable, useApi } = require('./libs');

module.exports = async function useTestnet(network) {
    
    const vars = useVariable(network);

    const requiredVars = {'apiUrl': `API`, 'valoper': `VALOPER`, 'valcons': `VALCONS`};
    for (const varName in requiredVars) {
        if (!vars[varName]) {
        throw new Error(`[${network}] doesn't have ${network.toUpperCase()}_${requiredVars[varName]} check your .env`);
        }
    }

    try {

        const api = await useApi(vars);

        const validatorInfo = `Chain ID: *${api.chainId}*\n` +
                              `Moniker: ${api.moniker}\n` +
                              `Uptime: ${api.uptimePercentage}% / (${api.missedBlocksCounter} of ${api.signedBlocksFormatted} Blocks)\n` +
                              `Status: ${api.bondStatus}`;

        return validatorInfo;
        } catch (error) {
        console.error(error);
    
    }
}
