const { IPv4, Hardware } = require('../'); 


IPv4.use(Hardware);

// with Default gateway and broadcast address
// Iterate from 10.0.0.1 to 10.0.0.254
for (let ip = IPv4.fromCurrent(); ip < (ip | ~IPv4.from('255.255.255.0')); ip.add(1)) {
    ip.ping()
	  .then(({err, host}) => {
			if (err)
				console.log(`Unable to ping ${host}`);
		    else 
				console.log(`Success pinging ${host}`);
	  })	
}
