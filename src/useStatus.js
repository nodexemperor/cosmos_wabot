const axios = require('axios');
const { format } = require('date-fns');

    module.exports = async function useStatus(network) {

    const uppercaseNetwork = network.toUpperCase();
    const requiredVariables = ['_RPC', '_API', '_VALOPER', '_EXPONENT', '_SYMBOL'];
    for (const variable of requiredVariables) {
        if (!process.env[uppercaseNetwork + variable]) 
        {
        throw new Error(`ERROR missing environment variable: ${uppercaseNetwork} 💀⁉️`);
        }
    }
    
    const rpcUrl = process.env[network.toUpperCase() + '_RPC'];
    const apiUrl = process.env[network.toUpperCase() + '_API'];
    const valoper = process.env[network.toUpperCase() + '_VALOPER'];
    const valcons = process.env[network.toUpperCase() + '_VALCONS'];
    const exponent = process.env[network.toUpperCase() + '_EXPONENT'];
    const symbol = process.env[network.toUpperCase() + '_SYMBOL'];

    try {
        const responseRpc = await axios.get(`${rpcUrl}/status?`);
        const syncInfo = responseRpc.data.result.sync_info;
        const latestBlockTime = format(new Date(syncInfo.latest_block_time), 'yyyy-MM-dd HH:mm:ss');
        const statusNode = `*STATUS NODE*\n` +
                            `Latest Block Height: ${syncInfo.latest_block_height}\n` +
                            `Latest Block Time: ${latestBlockTime}\n` +
                            `Catching Up: ${syncInfo.catching_up}\n\n`;

        const responseApi = await axios.get(`${apiUrl}/cosmos/staking/v1beta1/validators/${valoper}`);
        const validator = responseApi.data.validator;
        const statusval = validator.status.replace('BOND_STATUS_', '');
        
        const tokensBigInt = BigInt(validator.tokens);
        const tokensInSymbol = Number(tokensBigInt / BigInt(10 ** exponent));
        const formattedTokens = tokensInSymbol.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
        
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

        const validatorInfo = `*VALIDATOR INFO*\n` +
                                `Moniker: ${validator.description.moniker}\n` +
                                `Uptime: ${uptimePercentage}% / (${missedBlocksCounter} of ${signedBlocksFormatted} Blocks)\n` +
                                `Jailed: ${validator.jailed}\n` +
                                `Status: ${statusval}\n` +
                                `Total Bonded: ${formattedTokens} ${symbol}`;

        return statusNode + validatorInfo;
        } catch (error) {
        console.error(error);

        throw new Error('ERROR getting data from endpoint 💀⁉️');
    }
}
