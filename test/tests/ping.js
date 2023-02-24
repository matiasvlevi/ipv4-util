const { IPv4 } = require('../../index');

module.exports = {
    title: "ping test",
    test: async (unit) => {
        ip = IPv4.fromCurrent()
        const err = await ip.ping({ silent: true });
       
        unit.assert(0, err);
    }
}
