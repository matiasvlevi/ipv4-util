const { IPv4 } = require('../index');

// Avoir une de nos ip d'interfaces et l'imprimer a l'ecran
const myIp = IPv4.from('255.192.127.2');

// Custom operations for each byte
myIp.copy()
    .it((byte, i) => {
        return byte - 16
    })
    .log();

// Get byte index
myIp.copy()
    .it((byte, i) => {
        return i
    })
    .log();

// myIP instance is unchanged since copy() was used
myIp.log();