/**
 * @file THIS SOURCE FILE IS A WORK IN PROGRESS 
 */
const IPv4 = require('../../ipv4');

/**
 * @module Hardware
 * 
 * @summary
 * Hardware Plugin for the IPv4 class
 *
 * @desc 
 * Provides access to the local machine's hardware.
 * Will use spawn from node:child_process for pings, might have to change this to raw tcp connections
 * 
 * This is a separate plugin for permission reasons.
 * 
 * @example
 * const { IPv4, Hardware } = require('ipv4-utils');
 * 
 * IPv4.use(Hardware);
 */

/**
 * @class Hardware
 * @hideconstructor
 */
class Hardware {
    /**
     * Module initiation
     */
    static init() {
        Hardware.spawn = require('node:child_process').spawn;
    }

    /**
     * @method ping
     * @static 
     * 
     * @summary
     * Ping an IP address
     * 
     * @param {IPv4|String|Number} ip The ip address 
     * 
     * @example
     * IPv4.ping('127.0.0.1').then(err => console.log(err));
     */
    static async ping(ip, options = { silent: true }) 
    {

        ip = IPv4.to_u32_convert(ip); 

        let proc;
        if (process.platform == 'win32')     
            proc = Hardware.spawn('ping', ['/l', '1', '/w', '1000', IPv4.toString(ip)]);
        else    
            proc = Hardware.spawn('ping', ['-c', '1', '-i', '0.2', IPv4.toString(ip)]);
        
        proc._ipv4_ping_error = 0;
        proc.stderr.on('data', (data) => {
            if (data.includes('unreachable')) {
                proc._ipv4_ping_error = 1;
            }

            if (!options.silent) 
                process.stdout.write(data);
        });

        proc.stdout.on('data', (data) => {
            if (data.includes('unreachable')) {
                proc._ipv4_ping_error = 1;
            }

            if (!options.silent) 
                process.stdout.write(data);
        });      
        

        return new Promise((resolve) => {
            proc.on('close', err => Hardware.handlePing(resolve, proc, err));
        })
    }

    static handlePing(cb, proc, err) {
        cb(proc._ipv4_ping_error | err);
    }
    
    /**
     * @method getNetworkInterfaces
     * @static 
     * 
     * @summary
     * Get all network interfaces IP adresses
     * 
     * @returns os.interfaces output 
     */
    static getNetworkInterfaces() {
        const os = require('node:os');
        return os.networkInterfaces(...arguments);
    }

    /**
     * @method getInterfacesIPv4
     * @static
     * 
     * @summary
     * Get all network interfaces IP adresses
     * 
     * @param {boolean} [localhost] Whether or not to include localhost 
     * 
     * @returns An array of IPv4 instances
     */
    static getInterfacesIPv4(localhost = false) {
        let interfaces = Hardware.getNetworkInterfaces();
        if (!localhost) delete interfaces['lo'];
        
        return Object.values(interfaces).map(x => {
            return new IPv4(x[0].address)
        });
    }

    /**
     * @method getMask
     * @static 
     * 
     * @returns Interface mask as an IPv4 instance
     */
    static getMask() {
        const os = require('node:os');
        let interfaces = os.networkInterfaces();
        delete interfaces['lo'];

        return new IPv4(Object.values(interfaces).map(x => {
            return x[0].netmask;
        })[0]);
    }

    /**
     * @method fromCurrent
     * @static 
     * 
     * @summary
     * Get the local ip from the computer's interface
     * 
     * @param {Number} [interface_index] The index of the interface
     * 
     * @example
     * const my_interface = IPv4.fromCurrent();
     * 
     * @returns Interface ip as an IPv4 instance
     */
    static fromCurrent(interface_index = 0) {
        return Hardware.getInterfacesIPv4()[interface_index];
    }

    /**
     * @method fromLocalhost 
     * @static
     * 
     * @summary
     * Get the current loopback address
     * 
     * @returns Current localhost interface as an IPv4 instance
     */
    static fromLocalhost() 
    {
        return IPv4.getInterfacesIPv4(true)[0];
    }
}

/**
 * @method ping
 * @chainable
 * 
 * Ping the instance's ip address, uses the `ping` process
 */
Hardware.prototype.ping = async function ping(options = { silent: true }) 
{
    return Hardware.ping(this._u32_value, options);
}

module.exports = Hardware;
