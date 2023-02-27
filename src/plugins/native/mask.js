/**
 * @module Mask
 * 
 * @summay 
 * Mask Default Plugin for the IPv4 class
 * 
 * @desc
 * Provides mask utilities
 * 
 */

/**
 * @class Mask
 * @hideconstructor
 */
class Mask {};

/**
 * @method getRange
 * @summary 
 * Display the range of a mask
 * 
 * @desc
 * this method expects the instance to hold a mask value
 * 
 * @example
 * const range = IPv4.from('255.255.255.0').getRange(); // 24
 * 
 * @returns {Number} the range as a numeric value
 */
Mask.prototype.getRange = function getRange() 
{
    let count = 0;
    let mask = this.copy();

    while (!(
        mask.shift_right(1)
            .copy()
            .and(0x01)
            .u32()
    )) count++;
    
    return 31 - count;
};

module.exports = Mask;