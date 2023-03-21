/**
 * @module IPv4
 * 
 * @summary
 * Represents an IPv4 in the form of a uint32 
 * 
 * @desc
 * IPv4 natively handles conversions between String, Numeric and other IPv4 instances.
 * 
 * @param {IPv4|String|Number} ip The IPV4 value
 */

/**
 * @class IPv4
 * @hideconstructor
 */
class IPv4 {
    
    constructor(ip) 
    {
        this._u32_value = IPv4.to_u32_convert(ip);
    }

    /**
     * @method from
     * @static 
     * 
     * @alias IPv4 
     * 
     * @summary 
     * Constructor Alias
     * 
     * @example
     * const ip = IPv4.from('192.168.23.52');
     * 
     * ip.log();
     * 
     * @example
     * const ip = IPv4.from(0xC0A81738);
     * 
     * ip.log();
     * 
     * 
     * @param {IPv4|String|Number} ip The IPv4 value
     * 
     * @returns an IPv4 instance
     */
    static from(ip) 
    {
        return new IPv4(ip);
    }

    /**
     * @method u32
     * 
     * @desc 
     * Get the stored uint32 representing your ip instance
     * 
     * @example
     * const u32_ip = IPv4.from('192.168.1.1').u32();
     * 
     * console.log(u32_ip); // 0xC0A80101
     * 
     * @returns The full IPv4 as an uint32
     */
    u32() 
    {
        return this._u32_value;
    }

    /**
     * @method u8
     * 
     * @desc 
     * Get a specific byte from the stored uint32 representing your ip instance
     * 
     * @param {Number} index The byte index 
     * 
     * @example
     * const ip = IPv4.from('192.168.1.1');
     *
     * const msb_byte = ip.u8(3); // 192
     * // ... //        ip.u8(2); // 168
     * // ... //        ip.u8(1); //   1
     * const lsb_byte = ip.u8(0); //   1
     * 
     * @returns {Number} The selected IPv4 byte as a uint8 
     */
    u8(index = 0) 
    {
        return (this._u32_value >> (8*index)) & 0xFF;
    }

    /**
     * @method toString
     * 
     * @desc 
     * Convert an IPv4 instance to a string
     * 
     * @example
     * const mask = IPv4.from(0xFFFF0000);
     * 
     * console.log(mask.toString()); // 255.255.0.0
     * 
     * @returns {String} ip as a string
     */
    toString() 
    {
        return IPv4.toString(this._u32_value);
    }

    /**
     * @method valueOf
     * 
     * 
     * @desc 
     * native prototype method override
     * 
     * @example
     * const ip = IPv4.from('192.168.1.1');
     * 
     * console.log(ip | 0xFF); // 0xC0A801FF
     * 
     * @returns The full IPv4 as an uint32
     */
    valueOf() {
        return this._u32_value;
    }

    /**
     * @method copy
     * 
     * @desc
     * Copy an IPv4 instance
     * 
     * @example
     * const host1 = IPv4.from('192.168.1.12');
     * 
     * const host2 = host1.copy().add(12);
     * 
     * host1.toString() // 192.168.1.12
     * host2.toString() // 192.168.1.24
     * 
     * @returns {IPv4} A copy of the instance
     */
    copy() 
    {
        return new IPv4(this._u32_value);
    }

    /**
     * @method op
     * 
     * @summary
     * Run an assignment operation on the uint32
     * 
     * @param {Function} operation Assignement operation function, takes in the current value, returns the new value
     * 
     * @example
     * const ip   = IPv4.from('192.168.1.12');
     * const mask = IPv4.from('255.255.255.0');
     * 
     * const wildcard_ip = mask.op(x => ~x).and(ip); 
     * wildcard_ip.log();
     * 
     * @returns {this} A pointer to itself
     */
    op(operation) 
    {
        this._u32_value = operation(this._u32_value);
        return this;
    }

    /**
     * @method use
     * @static
     * 
     * @desc 
     * Implement plugins as IPv4 static and prototype members 
     * 
     * @param {class} plugin A class template with static & prototype members 
     * 
     * @example
     * const { IPv4, Hardware } = require('ipv4-utils');
     * 
     * IPv4.use(Hardware);
     */
    static use(plugin) 
    {
        let static_keys = Object.getOwnPropertyNames(plugin);
        for (let i = 3; i < static_keys.length; i++) 
        {
            IPv4[static_keys[i]] = plugin[static_keys[i]]
        }

        for (let instance_method in plugin.prototype) 
        {
            IPv4.prototype[instance_method] = plugin.prototype[instance_method];
        }
    }

    /**
     * @method fromString
     * @static
     * @ignore
     * 
     * @desc
     * Convert from a string ip to uint32 from
     * 
     * @param {String} ip_string A string representing an IPv4
     * 
     * @returns {Number} A uint32 value representing an IPv4
     */
    static fromString(ip_string) 
    {
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
     * @static
     * @ignore
     * 
     * @desc
     * convert the ip value to a string denoted as `x.x.x.x`
     * 
     * @param {Number} uint32 value representing an IPv4
     * 
     * @returns {String} ip as a string
     */
    static toString(_u32_value)
    {
        // Returned value
        let bytes = new Array(4);

        // Get each byte in uint32
        for (let i = 0; i < 4; i++) 
        {
            bytes[i] = (_u32_value >> (8*i)) & 0xFF;
        }

        // Concat all numeric values to a string
        return bytes.reverse().join('.');
    }

    /**
     * @enum to_u32_conversions
     * @static 
     * @ignore
     * 
     * @desc
     * Lookup table for conversions to u32 based on input value type
     */
    static to_u32_conversions = {
        'String': IPv4.fromString,
        'Number': x => x,
        'IPv4'  : x => x._u32_value
    };

    /**
     * @method to_u32_convert
     * @static 
     * @ignore
     * 
     * @param {IPv4|Number|String} value A value representing an IPv4 
     * 
     * @returns {Number} An IPv4 as a uint32
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
}

module.exports = IPv4;