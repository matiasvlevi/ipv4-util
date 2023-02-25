const IPv4 = require('../../ipv4');
/**
 * @module Logger
 * 
 * @summary
 * Logger Default Plugin for the IPv4 class
 *
 * @desc 
 * Provides logging options for IPv4's
 * 
 */
/**
 * @class Logger
 * @hideconstructor
 */
class Logger {
    /**
     * @method log_bin
     * 
     * @brief Log the IPv4 as binary
     */
    static log_bin(_u32_value) 
    {
        process.stdout.write(`\x1b[0m`);
        process.stdout.write("BIN IPv4: \x1b[92m\t");

        for (let i = 3; i >= 0; i--) 
        {
            for (let j = 7; j >= 0; j--) 
            {
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
    static log_hex(_u32_value) 
    {
        process.stdout.write(`\x1b[0m`);
        process.stdout.write("HEX IPv4: \x1b[92m\t");
        
        for (let i = 0; i < 4; i++) 
        {
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
    static log_dec(_u32_value) 
    {
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
     * @name HEX
     * 
     * @summary
     * 16
     * 
     * @desc
     * Hexadecimal constant
     */
    static HEX = 16;

    /**
     * @name DEC
     * 
     * @summary
     * 10
     * 
     * @desc
     * Decimal constant
     */
    static DEC = 10;

    /**
     * @name BIN
     * 
     * @summary
     * 2
     * 
     * @desc
     * Binary constant
     */
    static BIN =  2;

    /**
     * @name STDOUT
     * 
     * @summary
     * 1
     * 
     * @desc
     * STDOUT constant
     */
    static STDOUT = 1;
}

/**
 * @method log
 * @chainable
 * 
 * @summary 
 * Log the IPv4 instance in the console
 * 
 * @param {Number} order 'HEX', 'DEC', 'BIN', 'STDOUT'
 * , all static members of IPv4
 * 
 * @example
 * const ip = IPv4.from('127.0.0.1');
 * 
 * ip.log();
 * 
 * // ip.log(IPv4.HEX);
 * 
 * // ip.log(IPv4.STDOUT);
 * 
 * 
 * @brief Log the IPv4
 */
Logger.prototype.log = function log(opt = 0) {
    switch (opt) {
        case Logger.BIN:
            Logger.log_bin(this._u32_value);
            break;
        case Logger.DEC:
            Logger.log_dec(this._u32_value);
            break;
        case Logger.HEX:
            Logger.log_hex(this._u32_value);
            break;
        case Logger.STDOUT:
            process.stdout.write(this.toString());
            break;
        default:
            process.stdout.write(`IPv4 (\x1b[91m${this.toString()}\x1b[0m):\n`);
            Logger.log_bin(this._u32_value);
            Logger.log_hex(this._u32_value);
            Logger.log_dec(this._u32_value);
            process.stdout.write(`\x1b[0m\n\r`);
            break;
    }
    return this;
}

module.exports = Logger;