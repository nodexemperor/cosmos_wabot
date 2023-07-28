module.exports = function useVariable(network) {
    const uppercaseNetwork = network.toUpperCase();
    const pattern = new RegExp(`^${uppercaseNetwork}_`);

    let variables = {};

    for (const variable in process.env) {
        if (pattern.test(variable)) {
            const key = variable.replace(pattern, '');
            if (!process.env[variable]) {
                throw new Error(`ERROR missing environment variable: ${variable} 💀⁉️`);
            }
            variables[key] = process.env[variable];
        }
    }

    const apiUrl = process.env[uppercaseNetwork + '_API'];
    const valoper = process.env[uppercaseNetwork + '_VALOPER'];
    const valcons = process.env[uppercaseNetwork + '_VALCONS'];
    const exponent = process.env[uppercaseNetwork + '_EXPONENT'];
    const symbol = process.env[uppercaseNetwork + '_SYMBOL'];
    const coingecko = process.env[uppercaseNetwork + '_COINGECKO'];

    return { 
        apiUrl, 
        valoper, 
        valcons, 
        exponent, 
        symbol,
        coingecko };
}
