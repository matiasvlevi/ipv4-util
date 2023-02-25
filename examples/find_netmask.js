/**
 * EXAMPLE: Retrieve netmask from network address with operations
 */
const { IPv4, Hardware } = require('../index'); 

IPv4.use(Hardware); // for `fromCurrent`

// Get interface IP
const ip = IPv4.fromCurrent();

// Get network address, by masking a netmask to our IP
const network = ip
    // Copy IP instance
    .copy()               
    // Mask IP with netmask, this mask will be retrieved later
    .and('255.255.255.0');        

// Get netmask out of network address
const netmask = network
    // Copy Network address
    .copy()                   
    // Set all non 0 bytes to 255
    .ceil();

// Log all IPv4 instances

ip.log();
network.log();
netmask.log();