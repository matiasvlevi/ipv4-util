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
 * @brief Display the range of a mask
 * this method expects the instance to hold a mask value
 * 
 * 
 * @returns the range as a numeric value
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