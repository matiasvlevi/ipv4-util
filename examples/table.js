/**
 * EXAMPLE: Define a mask based on network requirements in terms of subnets and hosts
 * 
 * This is an implementation separate from IPv4
 */

const { IPv4, Table } = require('../index');

// Add plugin 
IPv4.use(Table);

const table = 
    IPv4.from('192.168.1.1')
        .rangeTable({
            hosts: 21,
            subnets: 5
        });

console.log(table.subnets);
console.log(table.netmask);