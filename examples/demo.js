const { IPv4 } = require('../index');

// Avoir une de nos ip d'interfaces et l'imprimer a l'ecran
const myIp = IPv4.fromCurrent();

myIp.log();

const myIP2 = IPv4.from('').log(); 