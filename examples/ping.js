
const { IPv4, Hardware } = require('../index');

IPv4.use(Hardware); // for `ping` and `fromCurrent`

/**
 * EXAMPLE: Ping your current interface IP
 */
IPv4.fromCurrent()
    .ping()
    .then(err => {
        if (err) {
            console.error('Ping failed')
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
            console.error('Ping failed')
        } else {
            console.log('Ping successful!')
        }
    });
