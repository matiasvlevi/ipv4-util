const { IPv4 } = require('../../index');

module.exports = {
    title: "IPv4 conversions",
    test: (unit) => {
        ip = new IPv4('1.1.1.1');
        unit.assert(ip._u32_value, 0x01010101);
    
        ip = new IPv4('255.255.255.255');
        unit.assert(ip._u32_value, 0xFFFFFFFF);
    
        ip = new IPv4('256.256.256.256');
        unit.assert(ip._u32_value, 0xFFFFFFFF);
    
        ip = new IPv4('127.127.127.127');
        unit.assert(ip._u32_value, 0x7F7F7F7F);
    
        ip = new IPv4(0x458E2A24);
        unit.assert(ip._u32_value, 0x458E2A24);
    
        ip = new IPv4(new IPv4('1.1.1.1'));
        unit.assert(ip._u32_value, 0x01010101);
    
        ip = IPv4.from('127.0.0.1');
        unit.assert(ip._u32_value, 0x7F000001);
    }
}