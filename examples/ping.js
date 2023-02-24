
const { IPv4 } = require('../index');

/**
 * EXAMPLE: Ping your current interface IP
 */
IPv4.fromCurrent()
    .ping()
    .then(err => {
        if (err) {
            console.err('Ping failed')
        } else {
            console.log('Ping successful!')
        }
    });

/**
 * EXAMPLE: Ping a remote IP
 */
IPv4.from('66.96.162.144')
    .ping()
    .then(err => {
        if (err) {
            console.err('Ping failed')
        } else {
            console.log('Ping successful!')
        }
    });
