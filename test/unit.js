/**
 * UNIT TEST FRAMEWORK
 */
const { readdirSync, lstatSync } = require('node:fs');

class UnitTests {
    constructor(tests = {}) {
        this.tests = tests;
        this.test_index = 0;
        this.index = 0;
    }

    #log_error(index, test_index) {
        console.log(
            `\x1b[31m Assert ${index} failed at test `+
            `${Object.keys(this.tests)[test_index]}`+
            `\x1b[91m\n\r`+
            `    ${Object.values(this.tests)[test_index]} \x1b[0m`);
    }

    #log_success(index, test_index) {
        console.log(
            `\x1b[32m Passed Assert ${index} from `+
            `${Object.keys(this.tests)[test_index]}`+
            `   \x1b[0m`
        );
    }

    assert(x, y) {
        if (typeof x == 'number' && typeof y == 'number') {
            if ((x ^ y) > 0) {
                this.#log_error(this.index, this.test_index);
            } else {
                this.#log_success(this.index, this.test_index);
            }
            this.index++;
        }
    }

    register({ test, title }) {
        if (!(title in this.tests)) 
        {
            this.tests[title] = test;
        }
    }

    load(path = (__dirname + '/tests/')) {
        // Get all javascript source files
        const test_files = readdirSync(path)
            .filter(file => {
                return !(lstatSync(path + file).isDirectory()) 
                        && file.endsWith('.js');
            });

        // Load all tests
        for (let file of test_files) {
           this.register(require(path + file)); 
        }
    }

    async run() {
        for (let key in this.tests) {
            await this.tests[key](this);
            this.test_index++;
            this.index = 0;
        }
    }
}

module.exports = { UnitTests };
