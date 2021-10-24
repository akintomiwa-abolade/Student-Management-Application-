module.exports = (req, validations)=>{
	// loop through validations
	Object.keys(validations).forEach((key, index)=>{
		let value = validations[key];
		
		// split data
		let splitValue = value.split('|');
		for (var i = 0; i < splitValue.length; i++) {
			if(splitValue[i] == 'required'){
				req.checkBody(`${key}`, `The ${key.charAt(0).toUpperCase()+key.slice(1)} Field is required.`).notEmpty();
			}

			if(splitValue[i] == 'email'){
				req.checkBody(`${key}`, 'The Email is not valid.').isEmail();
			}
		}
	});
	let errors = req.validationErrors();
	return errors;
}