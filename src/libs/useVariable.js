module.exports = function useVariable(network) {
    const uppercaseNetwork = network.toUpperCase();
    const pattern = new RegExp(`^${uppercaseNetwork}_`);

    let variables = {};

    for (const variable in process.env) {
        if (pattern.test(variable)) {
            const key = variable.replace(pattern, '');
            variables[key] = process.env[variable];
        }
    }

    const apiUrl = variables['API'];
    const valoper = variables['VALOPER'];
    const valcons = variables['VALCONS'];
    const denom = variables['DENOM'] || "";
    const exponent = variables['EXPONENT'] || "";
    const symbol = variables['SYMBOL'] || "";
    const coingecko = variables['COINGECKO'] || "";

    return { 
        apiUrl, 
        valoper, 
        valcons,
        denom, 
        exponent, 
        symbol,
        coingecko };
}
