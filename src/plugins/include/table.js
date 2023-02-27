/**
 * @file THIS SOURCE FILE IS A WORK IN PROGRESS 
 */
const IPv4 = require('../../ipv4');

/**
 * @module Table
 * 
 * @summary
 * Subnet map Plugin for the IPv4 class
 * 
 * @desc
 * Provides a way to map out large collections of subnets and calculate their mask
 * 
 * @example
 * const { IPv4, Table } = require('ipv4-utils');
 * 
 * IPv4.use(Table);
 */

/**
 * @class Table
 * @hideconstructor
 */
class Table {
    /**
     * @method makeRange
     * @static
     * 
     * @summary
     * Create an object holding the network address, first host address, last host address, broadcast address
     * 
     * @param {Number} _u32_value The uint32 value representing an IPv4
     * @param {Number} size The size of a range
     * 
     * @returns A subnet range object
     */
    static makeRange(_u32_value, size) 
    {
        return {
            network: _u32_value,
            first: _u32_value + 1,
            last: _u32_value + size - 2,
            broadcast: _u32_value + size - 1
        }
    }

    /**
     * @method normalizeRangeTable
     * @static
     * 
     * @param {RangeTable} table list of subnet range object 
     * @returns The table with all IPv4 values as IPv4 instances
     */
    static normalizeRangeTable(table) 
    {
        return table.map(x => {
            let res = {};
            for (let k in x) {
                res[k] = new IPv4(x[k])
            }
            return res;
        });
    }  
    
    /**
     * @method getMaskFromHostBits
     * @static
     * 
     * @param {number} host_bits The number of host bits 
     * @returns A mask as an IPv4 instance
     */
    static getMaskFromHostBits(host_bits) 
    {
        let mask = 0x00000000;
        for (let i = 0; i < host_bits; i++) {
            mask |= (1 << i);
        }
        return new IPv4(~mask);
    }
    

    /**
     * @method hostBits
     * @static
     * 
     * @param {Number} x The number of host bits 
     * @returns The number of host bits
     */
    static hostBits(x) 
    {
        return Math.ceil(Math.log2(x))
    }

    /**
     * @method hostCount
     * @static
     * 
     * @param {Number} x The number of host bits
     * @returns The number of hosts
     */
    static hostCount(x) 
    {
        return Math.ceil(Math.pow(2, x));
    }
}

/**
 * @method rangeTable
 * 
 * @summary
 * Create a table of subnets following certain criteria
 * 
 * @example
 * const table =
 *  ip.rangeTable({
 *    hosts: 64,
 *    subnets: 3 
 *  });
 * 
 * @param {Number} options.hosts The number of hosts in each subnet
 * @param {Number} options.subnets The number of subnets
 * 
 * @returns a table of subnets 
 */
Table.prototype.rangeTable = function rangeTable({ hosts, subnets }) 
{
    return this.tableByHostCount(hosts, subnets); 
}

/**
 * @method tableByHostCount
 * 
 * @summary REVISION NEEDED 
 * 
 * @param {number} count The number of hosts in each subnet 
 * @returns An object containing all requested subnets
 */
Table.prototype.tableByHostCount = function tableByHostCount(count, subnets) 
{
    let table = [];
    let increments = count + 1;
    let network = this.getNetwork().or(1);
    let netmask = Table.getMaskFromHostBits(Table.hostBits(count));

    let ceil_mask = netmask.copy().floor();

    console.log(ceil_mask.toString());

    const length = Math.min(~(ceil_mask._u32_value) + 1, subnets * increments);

    for (let i = 0; i <= length; i+=increments) {
        table.push(Table.makeRange(network._u32_value, increments));
        network.add(increments);
    }

    return {
        netmask,
        subnets:  Table.normalizeRangeTable(table)
                        .splice(0, subnets)
    }
}

module.exports = Table;
