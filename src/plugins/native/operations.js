const IPv4 = require('../../ipv4');

/**
 * @module Operations
 * 
 * @summary
 * Operations Default Plugin
 * 
 * @desc
 * Provides binary operations, arithmetic operations, iterators, and allows for custom operations.
 *
 */

/**
 * @class Operations
 * @hideconstructor
 */
class Operations {};

/**
 * @method and
 * 
 * @summary
 * Perform an AND operation to an IP instance
 * 
 * @param {IPv4|string|number} mask The mask value
 * 
 * @returns {this} A pointer to itself
 */
Operations.prototype.and = function and(mask) 
{
    this._u32_value &= IPv4.to_u32_convert(mask);

    return this;
}

/**
 * @method or
 * 
 * @summary
 * Perform an OR operation to an IP instance
 * 
 * @param {IPv4|string|number} mask The mask value
 * 
 * @returns {this} A pointer to itself
 */
Operations.prototype.or = function or(mask) 
{
    this._u32_value |= IPv4.to_u32_convert(mask);

    return this;
}

/**
 * @method xor
 * 
 * @summary
 * Perform an XOR operation to an IP instance
 * 
 * @param {IPv4|string|number} mask The mask value
 * 
 * @returns {this} A pointer to itself
 */
Operations.prototype.xor = function xor(mask) 
{
    this._u32_value ^= IPv4.to_u32_convert(mask);

    return this;
}

/**
 * @method add
 * 
 * @summary
 * Perform addition operation to an IP instance
 * 
 * @param {IPv4|string|number} value The mask value
 * 
 * @returns {this} A pointer to itself
 */
Operations.prototype.add = function add(value) 
{
    this._u32_value += IPv4.to_u32_convert(value);

    return this;
}

/**
 * @method shift_left
 * 
 * @summary
 * Shift the IPv4 bits left
 * 
 * @param {Number} bits The number of bits to shift the IPv4 instance
 * 
 * @returns {this} A pointer to itself
 */
Operations.prototype.shift_left = function shift_left(bits) 
{
    this._u32_value <<= bits;

    return this;
}

/**
 * @method shift_right
 * 
 * @summary
 * Shift the IPv4 bits right
 * 
 * @param {Number} bits The number of bits to shift the IPv4 instance
 * 
 * @returns {this} A pointer to itself
 */
Operations.prototype.shift_right = function shift_right(bits) 
{
    this._u32_value >>= bits;

    return this;
}

/**
 * @method ceil
 * 
 * @summary
 * Every byte which is not 0, is set to 255
 * 
 * @returns {this} A pointer to itself
 */
Operations.prototype.ceil = function ceil() 
{
    for (let i = 0; i < 4; i++) {
        let byte = 0xFF << (8*i);
        
        if ((this._u32_value >> 8*i) & 0xFF) 
            this._u32_value |=  byte;
        
    }
    return this;
}

/**
 * @method floor
 * 
 * @summary
 * Every byte which is not 255, is set to 0
 * 
 * @returns {this} A pointer to itself
 */
Operations.prototype.floor = function floor() 
{
    for (let i = 0; i < 4; i++) {
        let byte = 0xFF << (8*i);

        if (((this._u32_value >> 8*i) & 0xFF) != 0xFF) 
            this._u32_value &=  ~byte;
        
    }
    return this;
}

/**
 * @method it
 * 
 * @summary
 * Iterate through an IPv4 instance's bytes
 * 
 * @example
 * ip.copy()
 *   .it((byte, byte_index) => {
 *     return (byte & mask.u8(byte_index))
 *    })
 *   .log();
 * 
 * 
 * @param {Function} operation An operation to run, takes 2 arguments, the byte data (0 to 255) and the byte index
 * 
 * @returns {this} A pointer to itself
 */
Operations.prototype.it = function it(operation) 
{
    let ans = 0x00000000;

    for (let i = 3; i >= 0; i--) 
    {
        let byte_return = 0xFF & 
            operation(
                (this._u32_value >> (8*i)) & 0xFF, i
            );

        if (byte_return !== undefined) 
            ans |= byte_return << (8*i);
    }
    
    this._u32_value = ans;

    return this;
}

module.exports = Operations;