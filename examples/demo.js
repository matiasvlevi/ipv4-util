const { IPv4, Hardware } = require('../index');

IPv4.use(Hardware); // for `fromCurrent`

// Get first interface IP
const myIp = IPv4.fromCurrent();

myIp.log();