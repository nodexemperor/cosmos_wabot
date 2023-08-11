const { useVariable, useApi } = require('./libs');

module.exports = async function useTestnet(network) {
    
    const vars = useVariable(network);

    const requiredVars = ['apiUrl', 'valoper', 'valcons'];
    for (const varName of requiredVars) {
        if (!vars[varName]) {
            throw new Error(`[${network}] not response ${varName} check your .env`);
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
