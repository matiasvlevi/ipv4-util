const { IPv4 } = require('../index');

// Avoir une de nos ip d'interfaces et l'imprimer a l'ecran
const myIp = IPv4.fromCurrent();

const table = myIp.rangeTable({
    hosts: 21,
    subnets: 15
});

console.log(table.subnets)
console.log(table.netmask)