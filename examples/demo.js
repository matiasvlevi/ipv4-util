const { IPv4 } = require('../index');  // require('ipv4-math');

// Avoir une de nos ip d'interfaces et l'imprimer a l'ecran

const my_ip = IPv4.fromCurrent();

my_ip.log()

const net_addr = 
    my_ip.copy()
        .and('255.0.0.0')
        .log();

const mask = net_addr.copy()
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
    .log();


