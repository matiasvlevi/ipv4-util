const os = require('node:os');
const { spawn } = require('node:child_process');

class IPv4 {
    /**
     * Create an IPv4 instance
     * Compressed to uint32, can convert back to string format.
     * 
     * @example
     * const ip = new IPv4('192.168.23.52');
     * 
     * @param {IPv4|string|number} value The IP value
     */
    constructor(value) 
    {
        this._u32_value = IPv4.to_u32_convert(value);

        // DEBUG
        this.string = this.toString();
    }

    /**
     * Lookup table for conversions to u32 based on input value type
     */
    static to_u32_conversions = {
        'String': IPv4.fromString,
        'Number': x => x,
        'IPv4'  : x => x._u32_value
    };

    /**
     * @method to_u32_convert
     * 
     * @param {IPv4|Number|String} value A value representing an IPv4 
     * @returns An IPv4 as a uint32
     */
    static to_u32_convert(value) {
        if (value.constructor.name in IPv4.to_u32_conversions)
        {
            return IPv4.to_u32_conversions[value.constructor.name](value);
        } 
        else
        {
            console.error("IPv4 Error: Value type must be Numeric, String or an instance of IPv4");
            return 0x00000000;
        }
    }

    /**
     * 
     * @param {IPv4|string|number} ip 
     * @returns 
     */
    static from(ip) {
        return new IPv4(ip);
    }

    /**
     * @method fromString
     * 
     * Convert from a string ip to uint32 from
     * 
     * @param {string} ip_string 
     * 
     * @returns A uint32 value representing an IPv4
     */
    static fromString(ip_string) {

        // Get byte array
        let bytes = ip_string.split('.').reverse().map(
            x =>
                // Value range restrictions 0 to 255
                Math.max(0, Math.min(Number(x), 0xFF))
        );

        if (bytes.length !== 4) {
            console.error(
                "IPv4 Error: Expects string to be denoted with 4 decimal values separated with `.`"
            );
            return 0x00000000;
        }

        // Returned value
        let value = 0x00000000;

        // Set each parsed byte to the uint32 value
        for (let i = 0; i < 4; i++) {
            value |= bytes[i] << (8*i)
        }

        return value;
    }

    /**
     * @method toString
     * 
     * Returns the ip value as a string
     * 
     * @returns ip as a string
     */
    static toString(_u32_value) {
        // Returned value
        let bytes = new Array(4);

        // Get each byte in uint32
        for (let i = 0; i < 4; i++) {
            bytes[i] = (_u32_value >> (8*i)) & 0xFF;
        }

        // Concat all numeric values to a string
        return bytes.reverse().join('.');
    }

    /**
     * @method toString
     * 
     * Returns the ip value as a string
     * 
     * @returns ip as a string
     */
    toString() {
        return IPv4.toString(this._u32_value);
    }

    /**
     * @method copy
     * @chainable
     * 
     * Copy an IPv4 instance
     */
    copy() {
        return new IPv4(this._u32_value);
    }

    /**
     * @method and
     * @chainable
     * 
     * Perform an AND operation to an IP instance
     * 
     * @param {IPv4|string|number} mask The mask value
     */
    and(mask) {
        this._u32_value &= IPv4.to_u32_convert(mask);

        return this;
    }

    /**
     * @method or
     * @chainable
     * 
     * Perform an OR operation to an IP instance
     * 
     * @param {IPv4|string|number} mask The mask value
     */
    or(mask) {
        this._u32_value |= IPv4.to_u32_convert(mask);

        return this;
    }

    /**
     * @method xor
     * @chainable
     * 
     * Perform an XOR operation to an IP instance
     * 
     * @param {IPv4|string|number} mask The mask value
     */
    xor(mask) {
        this._u32_value ^=  IPv4.to_u32_convert(mask);

        return this;
    }

    /**
     * @method add
     * @chainable
     * 
     * Perform addition operation to an IP instance
     * 
     * @param {IPv4|string|number} mask The mask value
     */
    add(mask) {
        this._u32_value +=  IPv4.to_u32_convert(mask);

        return this;
    }

    shift_left(bits) {
        this._u32_value <<= bits;

        return this;
    }

    shift_right(bits) {
        this._u32_value >>= bits;

        return this;
    }

    /**
     * @method ceil
     * 
     * Every byte which is not 0, is set to 255
     * 
     * @chainable
     */
    ceil() {
        for (let i = 0; i < 4; i++) {
            let byte = 0xFF << (8*i);
            if (!((this._u32_value >> 8*i) & 0xFF)) {
                this._u32_value |=  byte;
            }
        }
        return this;
    }
    
    /**
     * @method floor
     * 
     * Every byte which is not 255, is set to 0
     * 
     * @chainable
     */
    floor() {
        for (let i = 0; i < 4; i++) {
            let byte = 0xFF << (8*i);
            if (((this._u32_value >> 8*i) & 0xFF) != 0xFF) {
                this._u32_value &=  ~byte;
            }
        }
        return this;
    }

    /**
     * @method it
     * @chainable
     * 
     * Iterate through an IPv4 instance's bytes
     * 
     * @example
     * <code>
     * 
     * myIp.copy()
     *   .it((byte, byte_index) => {
     *     return byte - 16
     *    })
     *   .log();
     * 
     * </code>
     * 
     * @param {Function} operation An operation to run, takes 2 arguments, the byte data (0 to 255) and the byte index
     * @returns 
     */
    it(operation) {
        let ans = 0x00000000;
        for (let i = 3; i >= 0; i--) {
            let byte_return = operation(
                (this._u32_value >> (8*i)) & 0xFF, i
            ) & 0xFF;

            if (byte_return !== undefined) 
                ans |= byte_return << (8*i);
            
        }
        
        this._u32_value = ans;

        return this;
    }

    /**
     * @method op
     * @chainable
     * 
     * Run an assignment operation on the uint32
     * 
     * @param {Function} operation Assignement operation function, takes in the current value, returns the new value
     * @returns 
     */
    op(operation) {
        this._u32_value = operation(this._u32_value);
        return this;
    }

    /**
     * @method getRange
     * 
     * Display the range of a mask, 
     * this method expects the instance to hold a mask value
     * 
     * @returns the range as a numeric value
     */
    getRange() {
        let count = 0;
        let mask = 0xFFFFFFFF;
        mask &= this._u32_value;

        while (!((mask >>= 1) & 1)) 
            count++;
        
        return 31 - count;
    }

    /**
     * @method getNetwork
     * 
     * @param {IPv4|string|number} mask 
     * @returns 
     */
    getNetwork(mask = 0xFFFFFF00) {
        return new IPv4(this.and(
            IPv4.to_u32_convert(mask)
        ));
    }

    /**
     * @method getMaskFromHostBits
     * @static
     * 
     * @param {number} host_bits The number of host bits 
     * @returns A mask as an IPv4 instance
     */
    static getMaskFromHostBits(host_bits) {
        let mask = 0x00000000;
        for (let i = 0; i < host_bits; i++) {
            mask |= (1 << i);
        }
        return new IPv4(~mask);
    }

    /**
     * RangeTable commands
     */
    rangeTable({ hosts, subnets }) {
       return this.#tableByHostCount(hosts, subnets); 
    }

    /**
     * @method subnetsByHostCount
     * 
     * REVISION NEEDED
     * 
     * @param {number} count The number of hosts in each subnet 
     * @returns 
     */
    #tableByHostCount(count, subnets) {
        let table = [];
        let increments = count + 1;
        let network = this.getNetwork().or(1);
        let netmask = IPv4.getMaskFromHostBits(IPv4.hostBits(count));

        let ceil_mask = netmask.copy().floor();

        console.log(ceil_mask.toString());

        const length = Math.min(~(ceil_mask._u32_value) + 1, subnets * increments);

        for (let i = 0; i <= length; i+=increments) {
            table.push(IPv4.makeRange(network._u32_value, increments));
            network.add(increments);
        }

        return {
            subnets:  this.normalizeToIPv4(table).splice(0, subnets),
            netmask 
        }
    }

    static makeRange(_u32_value, increments) {
        return {
            network: _u32_value,
            first: _u32_value + 1,
            last: _u32_value + increments - 2,
            broadcast: _u32_value + increments - 1
        }
    }

    normalizeToIPv4(table) {
        return table.map(x => {
            let res = {};
            for (let k in x) {
                res[k] = new IPv4(x[k])
            }
            return res;
        });
    }  

    static hostBits(x) {
        return Math.ceil(Math.log2(x))
    }

    static getRangeSize(x) {
        return Math.ceil(Math.pow(2, x));
    }

    /**
     * OS Commands
     */

    /**
     * @method getNetworkInterfaces
     * 
     * Get all network interfaces IP adresses
     * 
     * @param {boolean} localhost 
     * @returns An array of 
     */
    static getNetworkInterfacesIPv4(localhost = false) {
        let interfaces = os.networkInterfaces();
        if (!localhost) delete interfaces['lo'];
        
        return Object.values(interfaces).map(x => {
            return new IPv4(x[0].address)
        });
    }

    /**
     * @method getMask
     * 
     * @returns Interface mask as an IPv4 instance
     */
    static getMask() {
        let interfaces = os.networkInterfaces();
        delete interfaces['lo'];

        return new IPv4(Object.values(interfaces).map(x => {
            return x[0].netmask;
        })[0]);
    }

    /**
     * @method fromCurrent
     * 
     * Get the local ip from the computer's interface
     * 
     * @returns Interface ip as an IPv4 instance
     */
    static fromCurrent() {
        return IPv4.getNetworkInterfacesIPv4()[0];
    }

    /**
     * @method fromLocalhost 
     * 
     * @returns Current localhost interface as an IPv4 instance
     */
    static fromLocalhost() {
        return new IPv4(os.networkInterfaces().lo[0].address);
    }

    /**
     * @method ping
     * @chainable
     * 
     * Ping the instance's ip address, uses the `ping` process
     */
    async ping(options = {}) {
        return IPv4.ping(this._u32_value, options);
    }

    /**
     * @method ping
     * 
     * Ping an IP address
     * 
     * @param {IPv4|String|Number} ip The ip address 
     */
    static async ping(ip, options = {}) {

        let proc;
        ip = IPv4.to_u32_convert(ip); 

        if (process.platform == 'win32')     
            proc = spawn('ping', ['/l', '1', IPv4.toString(ip)]);
        else    
            proc = spawn('ping', ['-c', '1', '-i', '0.2', IPv4.toString(ip)]);
        
        if (!options.silent) {
            proc.stderr.on('data', (data) => {
                process.stdout.write(data);
            });

            proc.stdout.on('data', (data) => {
                process.stdout.write(data);
            });      
        }

        return new Promise((resolve) => {
            proc.on('close', err => resolve(err));
        })
    }

    /**
     * Display commands
     */

    /**
     * @method log_bin
     * 
     * @brief Log the IPv4 as binary
     */
    static #log_bin(_u32_value) {
        process.stdout.write(`\x1b[0m`);
        process.stdout.write("BIN IPv4: \x1b[92m\t");

        for (let i = 3; i >= 0; i--) {
            for (let j = 7; j >= 0; j--) {
                process.stdout.write(
                    ((_u32_value >> (8*i+j)) & 1)
                        .toString(2)
                );
            }
            process.stdout.write(" ");
        }

        process.stdout.write(`\x1b[0m\n`);
    }

    /**
     * @method log_hex
     * 
     * @brief Log the IPv4 as hexadecimal
     */
    static #log_hex(_u32_value) {
        process.stdout.write(`\x1b[0m`);
        process.stdout.write("HEX IPv4: \x1b[92m\t");
        for (let i = 0; i < 4; i++) {
            process.stdout.write(
                (_u32_value >> (8*(3-i)) & 0xFF)
                    .toString(16)
                    .padStart(2, '0').padStart(8, ' ')
            );
            process.stdout.write(" ");
        }

        process.stdout.write(`\x1b[0m\n`);
    }

    /**
     * @method log_dec
     * 
     * @brief Log the IPv4 as decimal
     */
    static #log_dec(_u32_value) {
        process.stdout.write(`\x1b[0m`);
        process.stdout.write("DEC IPv4: \x1b[92m\t");
        process.stdout.write(
            IPv4.toString(_u32_value)
                .split('.')
                .map(x => x.padStart(8, ' '))
                .join(' ')
        );

        process.stdout.write(`\x1b[0m\n`);
    }

    /**
     * Weight Constants
     * for printing
     */
    static HEX = 16;
    static DEC = 10;
    static BIN =  2;
    static STDOUT = 1;

    /**
     * @method log
     * @chainable
     * 
     * @brief Log the IPv4
     */
    log(opt = 0) {
        switch (opt) {
            case IPv4.BIN:
                IPv4.#log_bin(this._u32_value);
                break;
            case IPv4.DEC:
                IPv4.#log_dec(this._u32_value);
                break;
            case IPv4.HEX:
                IPv4.#log_hex(this._u32_value);
                break;
            case IPv4.STDOUT:
                process.stdout.write(this.toString());
                break;
            default:
                process.stdout.write(`IPv4 (\x1b[91m${this.toString()}\x1b[0m):\n`);
                IPv4.#log_bin(this._u32_value);
                IPv4.#log_hex(this._u32_value);
                IPv4.#log_dec(this._u32_value);
                process.stdout.write(`\x1b[0m\n\r`);
                break;
        }
        return this;
    }
}

module.exports = { IPv4, Mask:IPv4 };
