const IPv4 = require('./src/ipv4');

// Default Plugins
const Logger     = require('./src/plugins/native/logger'); 
const Mask       = require('./src/plugins/native/mask');
const Operations = require('./src/plugins/native/operations');

IPv4.use(Logger);
IPv4.use(Mask);
IPv4.use(Operations);

// Other Plugins
const Table    = require('./src/plugins/include/table');
const Hardware = require('./src/plugins/include/hardware');

module.exports = { IPv4, Table, Hardware };