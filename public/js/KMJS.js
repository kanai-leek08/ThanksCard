
Storage.prototype.get = function(key) {
	var value = localStorage.getItem(key);
	try {
	   var jsonValue = JSON.parse(value);
	   return jsonValue;
	}
	catch(e) {
		return value;
	}
}
Storage.prototype.set = function(key, value) {
	if (typeof value === 'object') {
		value = JSON.stringify(value);
	}
	localStorage.setItem(key, value);
}

Date.getCurrentDate = function(delimiter, hasTime) {
	var date = new Date();
	var currentDate = date.getFullYear() + delimiter
					+ ('0' + (date.getMonth() + 1)).slice(-2) + delimiter
					+ ('0' + date.getDate()).slice(-2);
	if (hasTime === true) {
		currentDate += ' ' 
					+ ('0' + date.getHours()).slice(-2) + ":" 
					+ ('0' + date.getMinutes()).slice(-2);
	}
	return currentDate;
};

Number.prototype.get0FillStr = function(length) {
	var zero = '';
	for(var i = 0; i < length; i++) {
		zero += '0';
	}
	return (zero + this.valueOf()).slice(0 - length);
}