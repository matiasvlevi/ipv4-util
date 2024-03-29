# ipv4-util

See [documentation](https://raw.githack.com/matiasvlevi/ipv4-util/master/docs/index.html)

The `Date` object of IPv4

A type representing IPv4 protocol addresses. 

* Store IPv4's as uint32
* Perform operations
* Handle type conversions (`uint32`, `string`, `IPv4`)
* Plugin system for Hardware functionality (fetching, process spawning)

### Install 

```
npm i ipv4-util
```


### Setup 

Require the IPv4 type 

```js
const { IPv4 } = require('ipv4-util');
```

Create an IPv4 instance
Multiple types are accepted

```js
const ip = IPv4.from('192.168.1.1');              // From String
//         IPv4.from(0xC0A80101);                 // From uint32
//         IPv4.from(IPv4.from('192.168.1.1'));   // From other IPv4 instance
```

Display the IPv4 instance in the console

```js
ip.log();
```

<br/>

### Utilities

Get the IPv4 instance as a string

```js
IPv4.from('192.168.1.1').toString(); // '192.168.1.1'
```

Get the IPv4 instance as a full uint32

```js
IPv4.from('192.168.1.1').u32();      // 0xC0A80101
```

Get a single byte of the IPv4 instance

```js
const ip = IPv4.from('192.168.1.1');

const msb_byte = ip.u8(3); // 192
// ... //        ip.u8(2); // 168
// ... //        ip.u8(1); //   1
const lsb_byte = ip.u8(0); //   1
```

You can copy the IPv4 instance

```js
IPv4.from('192.168.1.1').copy();      // A copy of the instance
```

<br/>

### Mask Utils

```js
IPv4.from('255.255.255.0').getRange(); // 24
```

<br/>

### Math


Basic binary `AND OR XOR` operations are provided

See [documentation](https://raw.githack.com/matiasvlevi/ipv4-util/master/docs/module-Operations.html) for other math operations 

Again multiple types are accepted

```js
ip.and('255.255.255.0');               // From String
// ip.and(0xFFFFFF00);                 // From uint32
// ip.and(IPv4.from('255.255.255.0')); // From other IPv4 instance
```

<br/>

Math functions are all chainable

```js
ip.and(/* */).or(/* */).xor(/* */).add(/* */).log();
```

You can use copy to avoid affecting the caller IPv4 instance

```js
const ip = IPv4.from('192.168.1.1')

const mask = ip.copy().and('255.255.255.0');  
```

<br/>

Custom operations can be implemented with the `op` method

It is used here to create a bit flip operation

```js
ip.op(ip => ~ip);
```

<br/>

## Iterators

Iterate through all usable hosts

```js
// with Default gateway and broadcast address
// Iterate from 10.0.0.1 to 10.0.0.254
for (let ip = IPv4.from('10.0.0.1'); ip < IPv4.from('10.0.0.255'); ip.add(1)) {
    ip.log()
}

// with Default gateway and Mask
// Iterate from 10.0.0.1 to 10.0.0.254 
for (let ip = IPv4.from('10.0.0.1'); ip < (ip | ~IPv4.from('255.255.255.0')); ip.add(1)) {
    ip.log()
}

```

<br/>

## Plugins

Some functionality has to be included 

this design is to promote minimalism of the IPv4 type.

This examples fetches the ip from the first active interface

```js
const { IPv4, Hardware } = require('ipv4-util');

IPv4.use(Hardware);

const my_interface_ip = IPv4.fromCurrent();
```

This example pings your local host

```js
const { IPv4, Hardware } = require('ipv4-util');

IPv4.use(Hardware);

IPv4.from('127.0.0.1')
    .ping()
    .then(({ err }) => {
        console.log(err ? 'error' : 'success');
    });
```

<br/>

This example pings all usable hosts in the given range

```js
const { IPv4, Hardware } = require('ipv4-util');

IPv4.use(Hardware);

// Iterate through all usable hosts
// loop ranges from 192.168.1.1 to 192.168.1.254
for (let ip = IPv4.from('192.168.1.1'); ip < (ip | ~IPv4.from('255.255.255.0')); ip.add(1)) {
    // Ping `ip`
    ip.ping()
      .then(({ err, host }) => {
          if (err) 
            console.log(`Unable to ping ${host}`)
          else 
            console.log(`Successfully pinged ${host}`)
      })
}
```
