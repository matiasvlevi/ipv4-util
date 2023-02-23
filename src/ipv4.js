const os = require('node:os');

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
        this._u32_value =  0x00000000;

        if (typeof value in IPv4.conversions)
        {
            this._u32_value = 
                IPv4.conversions[typeof value](value);
        }

        this.string = this.toString();
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
     * Lookup table for conversions based on input value type
     */
    static conversions = {
        'string': IPv4.fromString,
        'number': x => x,
        'object': x => x._u32_value
    }

    /**
     * @method fromString
     * @static
     * 
     * Convert from a string ip to uint32 from
     * 
     * @param {string} ip_string 
     * @returns 
     */
    static fromString(ip_string) {

        // Get byte array
        let bytes = ip_string.split('.').reverse().map(
            x =>
                // Value range restrictions 0 to 255
                Math.max(0, Math.min(Number(x), 0xFF))
        );

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
     * @method and
     * @chainable
     * 
     * Perform an AND operation to an IP instance
     * 
     * @param {IPv4|string|number} mask The mask value
     */
    and(mask) {
        if (mask instanceof IPv4)
            this._u32_value &= mask._u32_value;
        else if (typeof mask == 'number') 
            this._u32_value &= mask;
        else if (typeof mask == 'string') 
            this._u32_value &= new IPv4(mask)._u32_value;

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
        if (mask instanceof IPv4)
            this._u32_value |= mask._u32_value;
        else if (typeof mask == 'number') 
            this._u32_value |= mask;
        else if (typeof mask == 'string') 
            this._u32_value |= new IPv4(mask)._u32_value;

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
        if (mask instanceof IPv4)
            this._u32_value ^= mask._u32_value;
        else if (typeof mask == 'number') 
            this._u32_value ^= mask;
        else if (typeof mask == 'string') 
            this._u32_value ^= new IPv4(mask)._u32_value;

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

        while (((this._u32_value >>= 1) & 1) == 0) 
            count++;
        
        return 31 - count;
    }

    /**
     * 
     * @param {IPv4|string|number} mask 
     * @returns 
     */
    getNetwork(mask = 0xFFFFFF00) {
        return new IPv4(this.and(mask));
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
     * Display commands
     */

    /**
     * @method log_bin
     * 
     * @brief Log the IPv4 as binary
     */
    static #log_bin(_u32_value) {
        process.stdout.write(`\x1b[0m\n\r`);
        process.stdout.write("Binary IPv4: \x1b[92m\n\r\t");
        for (let i = 3; i >= 0; i--) {
            for (let j = 7; j >= 0; j--) {
                process.stdout.write(
                    ((_u32_value >> (8*i+j)) & 1)
                        .toString(2)
                );
            }
            process.stdout.write(" ");
        }

        process.stdout.write(`\x1b[0m\n\r\n\r`);
    }

    /**
     * @method log_hex
     * 
     * @brief Log the IPv4 as hexadecimal
     */
    static #log_hex(_u32_value) {
        process.stdout.write(`\x1b[0m\n\r`);
        process.stdout.write("Hexadecimal IPv4: \x1b[92m\n\r\t");
        for (let i = 0; i < 4; i++) {
            process.stdout.write(
                (_u32_value >> (8*(3-i)) & 0xFF)
                    .toString(16)
                    .padStart(2, '0')
            );
            process.stdout.write("  ");
        }
        process.stdout.write(`\x1b[0m\n\r\n\r`);
    }

    /**
     * @method log_dec
     * 
     * @brief Log the IPv4 as decimal
     */
    static #log_dec(_u32_value) {
        process.stdout.write(`\x1b[0m\n\r`);
        process.stdout.write("String IPv4: \x1b[92m\n\r\t");
        process.stdout.write(
            IPv4.toString(_u32_value)
        );
        process.stdout.write(`\x1b[0m\n\r\n\r`);
    }

    static HEX = 16;
    static DEC = 10;
    static BIN =  2;

    /**
     * @method log
     * 
     * @brief Log the IPv4
     */
    log(opt = 0) {
        switch (opt) {
            case 2:
                IPv4.#log_bin(this._u32_value);
                break;
            case 10:
                IPv4.#log_dec(this._u32_value);
                break;
            case 16:
                IPv4.#log_hex(this._u32_value);
                break;
            default:
                IPv4.#log_bin(this._u32_value);
                IPv4.#log_hex(this._u32_value);
                IPv4.#log_dec(this._u32_value);
                process.stdout.write(`\x1b[0m\n\r`);
                break;
        }
    }
    /**
     * RangeTable commands
     */

    /**
     * @method subnetsByHostCount
     * 
     * @param {number} count The number of hosts in each subnet 
     * @returns 
     */
    tableByHostCount(count) {
        let table = [];
        let increments = count + 3;
        let network = this.getNetwork().or(1);
        
        let i = 0;
        while(
            ((network._u32_value + i) & 0xFF) < (0xFF - increments)
        ) {
            table.push(IPv4.makeRange(network._u32_value, i, increments));
            i += increments;
        }

        return {
            subnets:  this.normalizeToIPv4(table),
            mask: IPv4.getMaskFromHostBits(IPv4.hostBits(count))
        }
    }

    tableBySubnetCount(count) {
        let host_bits = IPv4.hostBits(count);
        let increments = IPv4.getRangeSize(host_bits);

        let network = this.getNetwork().or(1);

        let table = [];

        for(let i = 0; i < count * increments; i+=increments) {
            table.push(IPv4.makeRange(network._u32_value, i, increments));
        }

        return {
            subnets: this.normalizeToIPv4(table),
            mask: IPv4.getMaskFromHostBits(host_bits)
        }
    }

    static makeRange(_u32_value, i, increments) {
        return {
            network: _u32_value + i,
            first: _u32_value + i + 1,
            last: _u32_value + (i+increments) - 2,
            broadcast: _u32_value + (i+increments) - 1
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
    static get(localhost = false) {
        let interfaces = os.networkInterfaces();
        if (!localhost) delete interfaces['lo'];
        return Object.values(interfaces).map(x => {
            return x[0].address
        });
    }

    static fromCurrent() {
        return new IPv4(IPv4.get()[0]);
    }

    static fromLocalhost() {
        return new IPv4(os.networkInterfaces().lo[0].address);
    }
}

module.exports = { IPv4, Mask:IPv4 };