/**
 * EXAMPLE: Retrieve netmask from network address with custom operations
 */
const { IPv4 } = require('../index'); 

// Get interface IP
const ip = IPv4.fromCurrent();

// Log interface IP
ip.log();                  

// Get network address, by masking a netmask to our IP
const network = ip
    // Copy IP instance
    .copy()               
    // Mask IP with netmask, this mask will be retrieved later
    .and('255.255.255.0') 
    // Display in console
    .log();               

// Get netmask out of network address
const netmask = network
    // Copy Network address
    .copy()                   
    // Implementing a custom operation to find 
    // the mask from the network address
    .op(x => {                
        y = 0x00000000;       

        for (let i = 0; i < 4; i++) {
            let byte = (0xFF << 8*i);
            if (!(x & byte)) {
                y |= byte;
            } 
        }

        return ~y;
    })   
    // Display in console
    .log();

