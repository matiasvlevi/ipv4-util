const { IPv4 } = require('../index');  // require('ipv4-math');

// Avoir une de nos ip d'interfaces et l'imprimer a l'ecran

let ip = IPv4.from('172.216.1.10');


const table = ip.tableByHostCount(10);
console.log(table.subnets)

console.log(ip.getRange());
console.log(new IPv4('255.255.255.252').getRange());
