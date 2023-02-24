const { IPv4 } = require('../index');  // require('ipv4-math');

// Avoir une de nos ip d'interfaces et l'imprimer a l'ecran

const ip = IPv4.fromCurrent();
ip
    .ping()
    .then(err => {
        if (err) {
            console.err('Ping failed')
        } else {
            console.log('Ping successful!')
        }
    });
