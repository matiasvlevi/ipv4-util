const { IPv4, Hardware, Table } = require('../../index');
module.exports = {
    title: "IPv4.prototype.getRange",
    test: (unit) => {    
        IPv4.use(Table);

        IPv4.use(Hardware);

        const mask = new IPv4(0xFFFFFFFF);
        for (let i = 1; i < 32; i++) {
            mask.shift_left(1);
            unit.assert(32-i, mask.getRange())
        }
    }
}