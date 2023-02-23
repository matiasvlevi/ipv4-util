const { IPv4 } = require('../index');  // require('ipv4-math');

// Avoir une de nos ip d'interfaces et l'imprimer a l'ecran

const TESTS = {
    "IPv4" : 
    (unit) => {
        ip = new IPv4('1.1.1.1');
        unit.assert(ip._u32_value, 0x01010101);

        ip = new IPv4('255.255.255.255');
        unit.assert(ip._u32_value, 0xFFFFFFFF);

        ip = new IPv4('256.256.256.256');
        unit.assert(ip._u32_value, 0xFFFFFFFF);

        ip = new IPv4('127.127.127.127');
        unit.assert(ip._u32_value, 0x7F7F7F7F);

        ip = new IPv4(0x458E2A24);
        unit.assert(ip._u32_value, 0x458E2A24);

        ip = new IPv4(new IPv4('1.1.1.1'));
        unit.assert(ip._u32_value, 0x01010101);

    },
    "IPv4.from" : 
    (unit) => {
        ip = IPv4.from('127.0.0.1');
        unit.assert(ip._u32_value, 0x7F000001);
    },
    "IPv4.toString" : 
    (unit) => {
        let value = 0xFF00FF00;
        ip = new IPv4(IPv4.toString(value));
        unit.assert(ip._u32_value, value);
    },

};


class Unit {
    constructor(tests) {
        this.tests = tests;
        this.test_index = 0;
        this.index = 0;
    }

    assert(x, y) {
        if (typeof x == 'number' && typeof y == 'number') {
            if ((x ^ y) > 0) {
                console.log(
                    `\x1b[31m Assert ${this.index} failed at test `+
                    `${Object.keys(this.tests)[this.test_index]}`+
                    `\x1b[91m\n\r`+
                    `    ${Object.values(this.tests)[this.test_index]} \x1b[0m`);
            } else {
                console.log(
                    `\x1b[32m Passed Assert ${this.index} from `+
                    `${Object.keys(this.tests)[this.test_index]}`+
                    `   \x1b[0m`
                );
            }
            this.index++;
        }
    }

    run() {
        for (let key in this.tests) {
            this.tests[key](this);
            this.test_index++;
            this.index = 0;
        }
    }
}



const unit = new Unit(TESTS);

unit.run();



