const { IPv4 } = require('../../index');

module.exports = {
    title: "IPv4.prototype.getRange",
    test: (unit) => {    
        const mask = new IPv4(0xFFFFFFFF);
        for (let i = 1; i < 32; i++) {
            mask.shift_left(1);
            unit.assert(32-i, mask.getRange())
        }
    }
}