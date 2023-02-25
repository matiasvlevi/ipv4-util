const { IPv4 } = require('../index');

const ip   = IPv4.from('172.212.56.2');
const mask = IPv4.from('255.255.0.0');

// Print byte index in an IPv4
ip.copy()
    .it((byte, i) => {
        return i
    })
    .log();

// Mask an ip
ip.copy()
    .it((byte, i) => {
        return byte & mask.u8(i)
    })
    .log();


// myIP instance is unchanged since copy() was used
ip.log();