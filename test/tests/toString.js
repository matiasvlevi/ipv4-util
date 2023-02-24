const { IPv4 } = require('../../index');

module.exports = {
    title: "IPv4 toString",
    test: (unit) => {
        let value = 0xFF00FF00;
        ip = new IPv4(IPv4.toString(value));
        unit.assert(ip._u32_value, value);
    }
}