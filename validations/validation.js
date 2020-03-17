let Validator = require('validatorjs');
exports.accessToken = (req) => {
	let data = {
		access_token: req.access_token
	};
	let rules = {
		access_token: 'required|string'
	};
	let error = {
		'required.access_token': 'Access token must be required',
		'string.access_token': 'Access token must be string',
	};
	let validation = new Validator(data, rules, error);
	return validation;
};
exports.Login = (req) => {
	let data = {
		mobile: req.mobile
	};
	let rules = {
		mobile: 'required|digits:10'
	};
	let error = {
		'required.mobile': 'Mobile number must be required',
		'digits.mobile': 'Mobile number must be 10 digits',
	};
	let validation = new Validator(data, rules, error);
	return validation;
};
exports.LoginVerifyOtp = (req) => {
	let data = {
		mobile: req.mobile,
		otp: req.otp
	};
	let rules = {
		mobile: 'required|digits:10',
		otp: 'required|digits:6',
	};
	let error = {
		'required.mobile': 'Mobile number must be required',
		'digits.mobile': 'Mobile number must be 10 digits',
		'required.otp': 'OTP must be required',
		'digits.otp': 'OTP must be 6 digits'
	};
	let validation = new Validator(data, rules, error);
	return validation;
};
exports.getTrackingCount = (req) => {
	let data = {
		organizationId: req.organizationId,
		fromDate: req.fromDate,
		toDate: req.toDate
	};
	let rules = {
		organizationId: 'numeric',
		fromDate: 'required|date',
		toDate: 'required|date'
	};
	let error = {
		'numeric.role': 'Organization id must be numeric',
		'required.fromDate': 'From date must be required',
		'date.fromDate': 'From date must be yyyy-mm-dd format',
		'required.toDate': 'To date must be required',
		'date.toDate': 'To date must be yyyy-mm-dd format'
	};
	let validation = new Validator(data, rules, error);
	return validation;
};
exports.getTrackingHistory = (req) => {
	let data = {
		organizationId: req.organizationId,
		fromDate: req.fromDate,
		toDate: req.toDate
	};
	let rules = {
		organizationId: 'numeric',
		fromDate: 'required|date',
		toDate: 'required|date'
	};
	let error = {
		'numeric.organizationId': 'Organization Id must be numeric',
		'required.fromDate': 'From date must be required',
		'date.fromDate': 'From date must be yyyy-mm-dd format',
		'required.toDate': 'To date must be required',
		'date.toDate': 'To date must be yyyy-mm-dd format'
	};
	let validation = new Validator(data, rules, error);
	return validation;
};
exports.searchUser = (req) => {
	let data = {
		userId: req.userId,
		shipperId: req.shipperId,
		role: req.role,
		fromDate: req.fromDate,
		toDate: req.toDate
	};
	let rules = {
		userId: 'required|numeric',
		shipperId: 'numeric',
		role: ['required','regex:/^[a-z]*$/'],
		fromDate: 'required|date',
		toDate: 'required|date'
	};
	let error = {
		'required.userId': 'User id must be required',
		'numeric.userId': 'User id must be numeric',
		'required.role': 'Role must be required',
		'regex.role': 'Role must be alphabets and small latter',
		'numeric.shipperId': 'Shipper Id must be numeric',
		'required.fromDate': 'From date must be required',
		'date.fromDate': 'From date must be yyyy-mm-dd format',
		'required.toDate': 'To date must be required',
		'date.toDate': 'To date must be yyyy-mm-dd format'
	};
	let validation = new Validator(data, rules, error);
	return validation;
};
exports.getTrackingAnalysis = (req) => {
	let data = {
		organizationId: req.organizationId,
		fromDate: req.fromDate,
		toDate: req.toDate,
		type: req.type
	};
	let rules = {
		organizationId: 'numeric',
		fromDate: 'required|date',
		toDate: 'required|date',
		type: 'required|in:month,date'
	};
	let error = {
		'numeric.organizationId': 'Organization Id must be numeric',
		'required.fromDate': 'From date must be required',
		'date.fromDate': 'From date must be yyyy-mm-dd format',
		'required.toDate': 'To date must be required',
		'date.toDate': 'To date must be yyyy-mm-dd format',
		'required.type': 'Type must be required',
		'in.type': 'Type must be month or date'
	};
	let validation = new Validator(data, rules, error);
	return validation;
};
exports.getFailedAnalysis = (req) => {
	let data = {
		organizationId: req.organizationId,
		fromDate: req.fromDate,
		toDate: req.toDate,
		type: req.type
	};
	let rules = {
		organizationId: 'numeric',
		fromDate: 'required|date',
		toDate: 'required|date',
		type: 'required|in:month,date'
	};
	let error = {
		'numeric.organizationId': 'Organization Id must be numeric',
		'required.fromDate': 'From date must be required',
		'date.fromDate': 'From date must be yyyy-mm-dd format',
		'required.toDate': 'To date must be required',
		'date.toDate': 'To date must be yyyy-mm-dd format',
		'required.type': 'Type must be required',
		'in.type': 'Type must be month or date'
	};
	let validation = new Validator(data, rules, error);
	return validation;
};
exports.getOrganizationSearch = (req) => {
	let data = {
		organizationId: req.organizationId,
		organizationName: req.organizationName,
	};
	let rules = {
		organizationId: 'numeric',
		organizationName: ['regex:/^[a-zA-Z0-9.- ]*$/']
	};
	let error = {
		'numeric.organizationId': 'Organization id must be numeric',
		'regex.organizationName': 'Organization name must be alphanumeric, dot, space and hyphen'
	};
	let validation = new Validator(data, rules, error);
	return validation;
};
exports.getTrackingSearch = (req) => {
	let data = {
		trackingId: req.trackingId,
		vehicleNnumber: req.vehicleNnumber,
		organizationId: req.organizationId,
		mobileNumber: req.mobileNumber,
	};
	let rules = {
		trackingId: 'numeric',
		vehicleNnumber: ['regex:/^[A-Z0-9]*$/'],
		organizationId: 'numeric',
		mobileNumber: 'digits:10',
	};
	let error = {
		'numeric.trackingId': 'Tracking id must be numeric',
		'regex.vehicleNnumber': 'Vehicle number must be alpha-numeric and capital latter',
		'numeric.organizationId': 'Organization id must be numeric',
		'digits.mobileNumber': 'Mobile number must be 10 digits'
	};
	let validation = new Validator(data, rules, error);
	return validation;
};
exports.getActiveInactiveShipper = (req) => {
	let data = {
		fromDate: req.fromDate,
		toDate: req.toDate,
		type: req.type,
		count: req.count
	};
	let rules = {
		fromDate: 'required|date',
		toDate: 'required|date',
		type: 'required|in:active,inactive',
		count: 'required|numeric'
	};
	let error = {
		'required.fromDate': 'From date must be required',
		'date.fromDate': 'From date must be yyyy-mm-dd format',
		'required.toDate': 'To date must be required',
		'date.toDate': 'To date must be yyyy-mm-dd format',
		'required.type': 'Type must be required',
		'in.type': 'Type must be active or inactive',
		'required.count': 'Count must be required',
		'numeric.count': 'Count must be numeric'		
	};
	let validation = new Validator(data, rules, error);
	return validation;
};
exports.getTrackingAdd = (req) => {
	let data = {
		userId: req.userId,
		organizationId: req.organizationId,
		branchId: req.branchId,
		loadId: req.loadId,
		startDate: req.startDate,
		vehicleNumber: req.vehicleNumber,
		driverNumber: req.driverNumber,
		driverName: req.driverName,
		otherMobileNumber: req.otherMobileNumber,
		driverMobileOnTrack: req.driverMobileOnTrack,
		fromlat: req.from.lat,
		tolat: req.to.lat,
		fromlang: req.from.lang,
		tolang: req.to.lang,
		reached: req.to.reached,
		fromcity: req.from.city,
		tocity: req.to.city,
		fromstate: req.from.state,
		tostate: req.to.state,
		comment: req.comment,
		otherLocation: req.otherLocation,
		totalTrackCount: req.totalTrackCount
	};
	let rules = {
		userId: 'required|numeric',
		organizationId: 'required|numeric',
		branchId: 'required|numeric',
		loadId: 'numeric',
		startDate: 'required|date',
		vehicleNumber: ['required','regex:/^[A-Z0-9]*$/'],
		driverNumber: 'required|digits:10',
		driverName: ['required','regex:/^[a-zA-Z ]*$/'],
		otherMobileNumber: 'array',
		driverMobileOnTrack: 'required|in:true,false',
		fromlat: ['required_if:driverMobileOnTrack,true','regex:/^(\\+|-)?(?:90(?:(?:\\.0{1,80})?)|(?:[0-9]|[1-8][0-9])(?:(?:\\.[0-9]{1,80})?))$/'],
		tolat: ['required_if:driverMobileOnTrack,true','regex:/^(\\+|-)?(?:90(?:(?:\\.0{1,80})?)|(?:[0-9]|[1-8][0-9])(?:(?:\\.[0-9]{1,80})?))$/'],
		fromlang: ['required_if:driverMobileOnTrack,true','regex:/^(\\+|-)?(?:180(?:(?:\\.0{1,80})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\\.[0-9]{1,80})?))$/'],
		tolang: ['required_if:driverMobileOnTrack,true','regex:/^(\\+|-)?(?:180(?:(?:\\.0{1,80})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\\.[0-9]{1,80})?))$/'],
		reached: 'required_if:driverMobileOnTrack,true|in:true,false',
		fromcity: ['required_if:driverMobileOnTrack,true','regex:/^[a-zA-Z0-9 ]*$/'],
		tocity: ['required_if:driverMobileOnTrack,true','regex:/^[a-zA-Z0-9 ]*$/'],
		fromstate: ['required_if:driverMobileOnTrack,true','regex:/^[a-zA-Z0-9 ]*$/'],
		tostate: ['required_if:driverMobileOnTrack,true','regex:/^[a-zA-Z0-9 ]*$/'],
		comment: ['required','regex:/^[a-zA-Z0-9,.@#$%&!=+:;"*-\/] ?([a-zA-Z0-9,.@#$%&!=+:;"*-\/]|[a-zA-Z0-9,.@#$%&!=+:;"*-\/] )*[a-zA-Z0-9,.@#$%&!=+:;"*-\/]$/'],
		otherLocation: 'array',
		totalTrackCount: 'required|numeric'
	};
	let error = {
		'required.userId': 'User id must be required',
		'numeric.userId': 'User id must be numeric',
		'required.organizationId': 'Organization id must be required',
		'numeric.organizationId': 'Organization id must be numeric',
		'required.branchId': 'Branch id must be required',
		'numeric.branchId': 'Branch id must be numeric',
		'numeric.loadId': 'Load id must be numeric',
		'required.startDate': 'Start date must be required',
		'date.startDate': 'Start date must be yyyy-mm-dd format',
		'required.vehicleNumber': 'Vehicle number must be required',
		'regex.vehicleNumber': 'Vehicle number must be alpha-numeric and capital latter',
		'required.driverNumber': 'Driver number must be required',
		'digits.driverNumber': 'Driver number must be 10 digits',
		'required.driverName': 'Driver name must be required',
		'regex.driverName': 'Driver name must be required',
		'regex.driverName': 'Driver name must be alphabet characters and space',
		'array.otherMobileNumber': 'Other mobile number must be required and array format',
		'required.driverMobileOnTrack': 'driver mobile on track must be required and true or false',
		'in.driverMobileOnTrack': 'driver mobile on track must be true or false',
		'required.fromlat': 'From lat must be required',
		'required.fromlang': 'From lang must be required',
		'required.tolat': 'To lat must be required',
		'required.tolang': 'To lang must be required',
		'required.reached': 'To lang must be required',
		'in.reached': 'To Reached must be true or false',
		'required.fromcity': 'From city must be required',
		'regex.fromcity': 'From city must be alphabet and space',
		'required.fromstate': 'From state must be required',
		'regex.fromstate': 'From state must be alphabet and space',
		'required.tocity': 'To city must be required',
		'regex.tocity': 'To city must be alphabet and space',
		'required.tostate': 'To state must be required',
		'regex.tostate': 'To state must be alphabet and space',
		'required.comment':'Comment must be required',
		'regex.comment':'Comment must be alpha-numeric, comma, dot, star, hyphen, underscore and slash',
		'array.otherLocation': 'Other location must be required and array format',
		'required.totalTrackCount': 'Total track count must be required',
		'numeric.totalTrackCount': 'Total track count must be numeric'
	};
	let validation = new Validator(data, rules, error);
	return validation;
};
exports.getTrackingEdit = (req) => {
	let data = {
		trackingId: req.trackingId,
		userId: req.userId,
		organizationId: req.organizationId,
		branchId: req.branchId,
		loadId: req.loadId,
		startDate: req.startDate,
		vehicleNumber: req.vehicleNumber,
		driverNumber: req.driverNumber,
		driverName: req.driverName,
		otherMobileNumber: req.otherMobileNumber,
		driverMobileOnTrack: req.driverMobileOnTrack,
		fromlat: req.from.lat,
		tolat: req.to.lat,
		fromlang: req.from.lang,
		tolang: req.to.lang,
		reached: req.to.reached,
		fromcity: req.from.city,
		tocity: req.to.city,
		fromstate: req.from.state,
		tostate: req.to.state,
		comment: req.comment,
		otherLocation: req.otherLocation,
		totalTrackCount: req.totalTrackCount
	};
	let rules = {
		trackingId: 'required|numeric',
		userId: 'required|numeric',
		organizationId: 'required|numeric',
		branchId: 'required|numeric',
		loadId: 'required|numeric',
		startDate: 'required|date',
		vehicleNumber: ['required','regex:/^[A-Z0-9]*$/'],
		driverNumber: 'required|digits:10',
		driverName: ['required','regex:/^[a-zA-Z ]*$/'],
		otherMobileNumber: 'array',
		driverMobileOnTrack: 'required|in:true,false',
		fromlat: ['required_if:driverMobileOnTrack,true','regex:/^(\\+|-)?(?:90(?:(?:\\.0{1,80})?)|(?:[0-9]|[1-8][0-9])(?:(?:\\.[0-9]{1,80})?))$/'],
		tolat: ['required_if:driverMobileOnTrack,true','regex:/^(\\+|-)?(?:90(?:(?:\\.0{1,80})?)|(?:[0-9]|[1-8][0-9])(?:(?:\\.[0-9]{1,80})?))$/'],
		fromlang: ['required_if:driverMobileOnTrack,true','regex:/^(\\+|-)?(?:180(?:(?:\\.0{1,80})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\\.[0-9]{1,80})?))$/'],
		tolang: ['required_if:driverMobileOnTrack,true','regex:/^(\\+|-)?(?:180(?:(?:\\.0{1,80})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\\.[0-9]{1,80})?))$/'],
		reached: 'required_if:driverMobileOnTrack,true|in:true,false',
		fromcity: ['required_if:driverMobileOnTrack,true','regex:/^[a-zA-Z0-9 ]*$/'],
		tocity: ['required_if:driverMobileOnTrack,true','regex:/^[a-zA-Z0-9 ]*$/'],
		fromstate: ['required_if:driverMobileOnTrack,true','regex:/^[a-zA-Z0-9 ]*$/'],
		tostate: ['required_if:driverMobileOnTrack,true','regex:/^[a-zA-Z0-9 ]*$/'],
		comment: ['required','regex:/^[a-zA-Z0-9,.@#$%&!=+:;"*-\/] ?([a-zA-Z0-9,.@#$%&!=+:;"*-\/]|[a-zA-Z0-9,.@#$%&!=+:;"*-\/] )*[a-zA-Z0-9,.@#$%&!=+:;"*-\/]$/'],
		otherLocation: 'array',
		totalTrackCount: 'required|numeric'
	};
	let error = {
		'required.trackingId': 'Tracking id must be required',
		'numeric.trackingId': 'Tracking id must be numeric',
		'required.userId': 'User id must be required',
		'numeric.userId': 'User id must be numeric',
		'required.organizationId': 'Organization id must be required',
		'numeric.organizationId': 'Organization id must be numeric',
		'required.branchId': 'Branch id must be required',
		'numeric.branchId': 'Branch id must be numeric',
		'numeric.loadId': 'Load id must be numeric',
		'required.startDate': 'Start date must be required',
		'date.startDate': 'Start date must be yyyy-mm-dd format',
		'required.vehicleNumber': 'Vehicle number must be required',
		'regex.vehicleNumber': 'Vehicle number must be alpha-numeric and capital latter',
		'required.driverNumber': 'Driver number must be required',
		'digits.driverNumber': 'Driver number must be 10 digits',
		'required.driverName': 'Driver name must be required',
		'regex.driverName': 'Driver name must be required',
		'regex.driverName': 'Driver name must be alphabet characters and space',
		'array.otherMobileNumber': 'Other mobile number must be required and array format',
		'required.driverMobileOnTrack': 'driver mobile on track must be required and true or false',
		'in.driverMobileOnTrack': 'driver mobile on track must be true or false',
		'required.fromlat': 'From lat must be required',
		'required.fromlang': 'From lang must be required',
		'required.tolat': 'To lat must be required',
		'required.tolang': 'To lang must be required',
		'required.reached': 'To lang must be required',
		'required.fromcity': 'From city must be required',
		'regex.fromcity': 'From city must be alphabet and space',
		'required.fromstate': 'From state must be required',
		'regex.fromstate': 'From state must be alphabet and space',
		'required.tocity': 'To city must be required',
		'regex.tocity': 'To city must be alphabet and space',
		'required.tostate': 'To state must be required',
		'regex.tostate': 'To state must be alphabet and space',
		'in.reached': 'To Reached must be true or false',
		'required.comment':'Comment must be required',
		'regex.comment':'Comment must be alpha-numeric, comma, dot, star, hyphen, underscore and slash',
		'array.otherLocation': 'Other location must be required and array format',
		'required.totalTrackCount': 'Total track count must be required',
		'numeric.totalTrackCount': 'Total track count must be numeric'
	};
	let validation = new Validator(data, rules, error);
	return validation;
};
exports.editToLocation = (req) => {
	let data = {
		trackingId: req.trackingId,
		organizationId: req.organizationId,
		tolat: req.to.lat,
		tolang: req.to.lang,
		reached: req.to.reached,
		tocity: req.to.city,
		tostate: req.to.state
	};
	let rules = {
		trackingId: 'required|numeric',
		organizationId: 'required|numeric',
		tolat: ['required','regex:/^(\\+|-)?(?:90(?:(?:\\.0{1,80})?)|(?:[0-9]|[1-8][0-9])(?:(?:\\.[0-9]{1,80})?))$/'],
		tolang: ['required','regex:/^(\\+|-)?(?:180(?:(?:\\.0{1,80})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\\.[0-9]{1,80})?))$/'],
		reached: 'required|in:true,false',
		tocity: ['required','regex:/^[a-zA-Z0-9 ]*$/'],
		tostate: ['required','regex:/^[a-zA-Z0-9 ]*$/']
	};
	let error = {
		'required.trackingId': 'Tracking id must be required',
		'numeric.trackingId': 'Tracking id must be numeric',
		'required.organizationId': 'Organization id must be required',
		'numeric.organizationId': 'Organization id must be numeric',
		'required.tolat': 'To lat must be required',
		'required.tolang': 'To lang must be required',
		'required.tocity': 'To city must be required',
		'regex.tocity': 'To city must be alphabet and space',
		'required.tostate': 'To state must be required',
		'regex.tostate': 'To state must be alphabet and space',
		'required.reached': 'To lang must be required',
		'in.reached': 'To Reached must be true or false'
	};
	let validation = new Validator(data, rules, error);
	return validation;
};
exports.editTrakingCount = (req) => {
	let data = {
		trackingId: req.trackingId,
		organizationId: req.organizationId,
		trackingCount: req.trackingCount
	};
	let rules = {
		trackingId: 'required|numeric',
		organizationId: 'required|numeric',
		trackingCount: 'required|numeric'
	};
	let error = {
		'required.trackingId': 'Tracking id must be required',
		'numeric.trackingId': 'Tracking id must be numeric',
		'required.organizationId': 'Organization id must be required',
		'numeric.organizationId': 'Organization id must be numeric',
		'required.trackingCount': 'Tracking count must be required',
		'numeric.trackingCount': 'Tracking count must be numeric'
	};
	let validation = new Validator(data, rules, error);
	return validation;
};
exports.setOrganizationStatus = (req) => {
	let data = {
		organizationId: req.organizationId,
		active: req.active
	};
	let rules = {
		organizationId: 'required|numeric',
		active: 'required|in:active,inactive'
	};
	let error = {
		'required.organizationId': 'Organization id must be required',
		'numeric.organizationId': 'Organization id must be numeric',
		'required.active': 'User id must be required',
		'in.active': 'Active must be active or inactive'
	};
	let validation = new Validator(data, rules, error);
	return validation;
};
exports.getLoadByOrganizationById = (req) => {
	let data = {
		fromDate: req.fromDate,
		organizationId: req.organizationId,
		toDate: req.toDate
	};
	let rules = {
		fromDate: 'required|date',
		organizationId: 'numeric',
		toDate: 'required|date'
	};
	let error = {
		'required.fromDate': 'From date must be required',
		'date.fromDate': 'From date must be yyyy-mm-dd format',
		'required.toDate': 'To date must be required',
		'date.toDate': 'To date must be yyyy-mm-dd format',
		'numeric.organizationId': 'Organization id must be numeric'
	};
	let validation = new Validator(data, rules, error);
	return validation;
};
exports.getCompleteOrganizationList = (req) => {
	let data = {
		// fromDate: req.fromDate,
		// toDate: req.toDate,
		fromCount: req.fromCount,
		toCount: req.toCount,
		sortBy: req.sortBy,
		sortType: req.sortType
	};
	let rules = {
		/*fromDate: 'required|date',
		toDate: 'required|date',*/
		fromCount: 'required|numeric',
		toCount: 'required|numeric',
		sortBy: 'required|in:name,status',
		sortType: 'required|in:DESC,ASC'
	};
	let error = {
		/*'required.fromDate': 'From date must be required',
		'date.fromDate': 'From date must be yyyy-mm-dd format',
		'required.toDate': 'To date must be required',
		'date.toDate': 'To date must be yyyy-mm-dd format',*/
		'required.fromCount': 'From count must be required',
		'numeric.fromCount': 'From count must be numeric',
		'required.toCount': 'To count must be required',
		'numeric.toCount': 'To count must be numeric',
		'required.sortBy': 'Sort by must be required',
		'in.sortBy': 'Sort by must be name or status',
		'required.sortType': 'Sort type must be required',
		'in.sortType': 'Sort type must be DESC or ASC'
	};
	let validation = new Validator(data, rules, error);
	return validation;
};
exports.searchOrganizationInDetails = (req) => {
	let data = {
		organizationId: req.organizationId
	};
	let rules = {
		organizationId: 'required|numeric'
	};
	let error = {
		'required.organizationId': 'Organization id must be required',
		'numeric.organizationId': 'Organization id must be numeric'
	};
	let validation = new Validator(data, rules, error);
	return validation;
};
exports.addUserToOrganization = (req) => {
	let data = {
		organizationId: req.organizationId,
		userName: req.userName,
		userEmail: req.userEmail,
		userMobileNumber: req.userMobileNumber,
		userRole: req.userRole,
		userType: req.userType,
		userStatus: req.userStatus
	};
	let rules = {
		organizationId: 'required|numeric',
		userName: ['required','regex:/^[a-zA-Z0-9 ]*$/'],
		userEmail: 'required|email',
		userMobileNumber: 'required|digits:10',
		userType: 'required|in:consignee,fleet,admin,super_admin',		
		userRole: 'required|in:admin,manager,user',
		userStatus: 'required|in:active,inactive'
	};
	let error = {
		'required.organizationId': 'Organization id must be required',
		'numeric.organizationId': 'Organization id must be numeric',
		'required.userName': 'User name must be required',
		'regex.userName': 'User name must be alpha-numeric and space',
		'required.userEmail': 'User e-mail must be required',
		'email.userEmail': 'User e-mail like example@example.com',
		'required.userMobileNumber': 'User mobile number must be required',
		'digits.userMobileNumber': 'User mobile number must be 10 digits',
		'required.userRole': 'User role must be required',
		'in.userRole': 'User role must be consignee or fleet or admin',
		'required.userStatus': 'User status must be required',
		'in.userStatus': 'User status must be active or inactive'
	};
	let validation = new Validator(data, rules, error);
	return validation;
};
exports.editUserToOrganization = (req) => {
	let data = {
		organizationId: req.organizationId,
		userId: req.userId,
		userName: req.userName,
		userEmail: req.userEmail,
		userMobileNumber: req.userMobileNumber,
		userRole: req.userRole,
		userType: req.userType,
		userStatus: req.userStatus
	};
	let rules = {
		organizationId: 'required|numeric',
		userId: 'required|numeric',
		userName: ['required','regex:/^[a-zA-Z0-9 ]*$/'],
		userEmail: 'required|email',
		userMobileNumber: 'required|digits:10',
		userType: 'required|in:consignee,fleet,admin,super_admin',		
		userRole: 'required|in:admin,manager,user',
		userStatus: 'required|in:active,inactive'
	};
	let error = {
		'required.organizationId': 'Organization id must be required',
		'numeric.organizationId': 'Organization id must be numeric',
		'required.userId': 'User id must be required',
		'numeric.userId': 'User id must be numeric',
		'required.userName': 'User name must be required',
		'regex.userName': 'User name must be alpha-numeric and space',
		'required.userEmail': 'User e-mail must be required',
		'email.userEmail': 'User e-mail like example@example.com',
		'required.userMobileNumber': 'User mobile number must be required',
		'digits.userMobileNumber': 'User mobile number must be 10 digits',
		'required.userRole': 'User role must be required',
		'in.userRole': 'User role must be consignee or fleet or admin',
		'required.userStatus': 'User status must be required',
		'in.userStatus': 'User status must be active or inactive'
	};
	let validation = new Validator(data, rules, error);
	return validation;
};
exports.removeUserFromOrganization = (req) => {
	let data = {
		organizationId: req.organizationId,
		userId: req.userId
	};
	let rules = {
		organizationId: 'required|numeric',
		userId: 'required|numeric'
	};
	let error = {
		'required.organizationId': 'Organization id must be required',
		'numeric.organizationId': 'Organization id must be numeric',
		'required.userId': 'User id must be required',
		'numeric.userId': 'User id must be numeric'
	};
	let validation = new Validator(data, rules, error);
	return validation;
};
exports.addBranchToOrganization = (req) => {
	let data = {
		organizationId: req.organizationId,
		BranchName: req.BranchName,
		BranchContactName: req.BranchContactName,
		BranchContactNumber: req.BranchContactNumber,
		BranchLat: req.BranchLat,
		BranchLang: req.BranchLang,
		BranchState: req.BranchState,
		BranchCity: req.BranchCity,
		BranchPin: req.BranchPin
	};
	let rules = {
		organizationId: 'required|numeric',
		BranchName: ['required','regex:/^[a-zA-Z0-9()-. ]*$/'],
		BranchContactName: ['required','regex:/^[a-zA-Z ]*$/'],
		BranchContactNumber: 'required|digits:10',
		BranchLat: ['required','regex:/^(\\+|-)?(?:90(?:(?:\\.0{1,80})?)|(?:[0-9]|[1-8][0-9])(?:(?:\\.[0-9]{1,80})?))$/'],
		BranchLang: ['required','regex:/^(\\+|-)?(?:180(?:(?:\\.0{1,80})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\\.[0-9]{1,80})?))$/'],
		BranchState: ['required','regex:/^[a-zA-Z ]*$/'],
		BranchCity: ['required','regex:/^[a-zA-Z ]*$/'],
		BranchPin: ['required','regex:/^[1-9][0-9]{5}$/']
	};
	let error = {
		'required.organizationId': 'Organization id must be required',
		'numeric.organizationId': 'Organization id must be numeric',
		'required.BranchName': 'Branch name must be required',
		'regex.BranchName': 'Branch name must be alpha-numeric, first backets, dot, hyphen and space ',
		'required.BranchContactName': 'Branch contact name must be required',
		'regex.BranchContactName': 'Branch contact name must be alphabet and space',
		'required.BranchContactNumber': 'Branch contact number must be required',
		'digits.BranchContactNumber': 'Branch contact number must be 10 digits',
		'required.BranchLat': 'Branch latitude must be required',
		'regex.BranchLat': 'Branch latitude must 33.333333',
		'required.BranchLang': 'Branch longitude must be required',
		'regex.BranchLang': 'Branch longitude must 35.333333',
		'required.BranchState': 'Branch state must be required',
		'regex.BranchState': 'Branch state must be alphabet and space',
		'required.BranchCity': 'Branch city must be required',
		'regex.BranchCity': 'Branch city must be alphabet and space',
		'required.BranchPin': 'Branch pin must be required',
		'regex.BranchPin': 'Branch pin must be mumeric and 6 digits'
	};
	let validation = new Validator(data, rules, error);
	return validation;
};
exports.editBranchToOrganization = (req) => {
	let data = {
		organizationId: req.organizationId,
		BranchId: req.BranchId,
		BranchName: req.BranchName,
		BranchContactName: req.BranchContactName,
		BranchContactNumber: req.BranchContactNumber,
		BranchLat: req.BranchLat,
		BranchLang: req.BranchLang,
		BranchState: req.BranchState,
		BranchCity: req.BranchCity,
		BranchPin: req.BranchPin
	};
	let rules = {
		organizationId: 'required|numeric',
		BranchId: 'required|numeric',
		BranchName: ['required','regex:/^[a-zA-Z0-9()-. ]*$/'],
		BranchContactName: ['required','regex:/^[a-zA-Z ]*$/'],
		BranchContactNumber: 'required|digits:10',
		BranchLat: ['required','regex:/^(\\+|-)?(?:90(?:(?:\\.0{1,80})?)|(?:[0-9]|[1-8][0-9])(?:(?:\\.[0-9]{1,80})?))$/'],
		BranchLang: ['required','regex:/^(\\+|-)?(?:180(?:(?:\\.0{1,80})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\\.[0-9]{1,80})?))$/'],
		BranchState: ['required','regex:/^[a-zA-Z ]*$/'],
		BranchCity: ['required','regex:/^[a-zA-Z ]*$/'],
		BranchPin: ['required','regex:/^[1-9][0-9]{5}$/']
	};
	let error = {
		'required.organizationId': 'Organization id must be required',
		'numeric.organizationId': 'Organization id must be numeric',
		'required.BranchId': 'Branch id must be required',
		'numeric.BranchId': 'Branch id must be numeric',
		'required.BranchName': 'Branch name must be required',
		'regex.BranchName': 'Branch name must be alpha-numeric, first backets, dot, hyphen and space ',
		'required.BranchContactName': 'Branch contact name must be required',
		'regex.BranchContactName': 'Branch contact name must be alphabet and space',
		'required.BranchContactNumber': 'Branch contact number must be required',
		'digits.BranchContactNumber': 'Branch contact number must be 10 digits',
		'required.BranchLat': 'Branch latitude must be required',
		'regex.BranchLat': 'Branch latitude must 33.333333',
		'required.BranchLang': 'Branch longitude must be required',
		'regex.BranchLang': 'Branch longitude must 35.333333',
		'required.BranchState': 'Branch state must be required',
		'regex.BranchState': 'Branch state must be alphabet and space',
		'required.BranchCity': 'Branch city must be required',
		'regex.BranchCity': 'Branch city must be alphabet and space',
		'required.BranchPin': 'Branch pin must be required',
		'regex.BranchPin': 'Branch pin must be mumeric and 6 digits'
	};
	let validation = new Validator(data, rules, error);
	return validation;
};
exports.removeBranchToOrganization = (req) => {
	let data = {
		organizationId: req.organizationId,
		BranchId: req.BranchId
	};
	let rules = {
		organizationId: 'required|numeric',
		BranchId: 'required|numeric'
	};
	let error = {
		'required.organizationId': 'Organization id must be required',
		'numeric.organizationId': 'Organization id must be numeric',
		'required.BranchId': 'Branch id must be required',
		'numeric.BranchId': 'Branch id must be numeric'
	};
	let validation = new Validator(data, rules, error);
	return validation;
};
exports.getOrganizationById = (req) => {
	let data = {
		organizationId: req.organizationId,
	};
	let rules = {
		organizationId: 'required|numeric',
	};
	let error = {
		'required.organizationId': 'Organization id must be required',
		'numeric.organizationId': 'Organization id must be numeric'
	};
	let validation = new Validator(data, rules, error);
	return validation;
};
exports.editOrganizationById = (req) => {
	let data = {
		organizationId: req.organizationId,
		OrganizationName: req.OrganizationName,
		OrganizationEmail: req.OrganizationEmail,
		OrganizationAddress: req.OrganizationAddress,
		OrganizationType: req.OrganizationType,
		OrganizationCountry: req.OrganizationCountry,
		OrganizationCity: req.OrganizationCity,
		OrganizationState: req.OrganizationState,
		OrganizationPin: req.OrganizationPin,
		OrganizationContact: req.OrganizationContact,
		OrganizationMobile: req.OrganizationMobile,
		primaryContactName: req.primaryContactName,
		primaryContactMobileNumber: req.primaryContactMobileNumber,
		biddingClient: req.biddingClient,
		active: req.active
	};
	let rules = {
		organizationId: 'required|numeric',
		OrganizationName: ['required','regex:/^[a-zA-Z0-9.- ]*$/'],
		OrganizationEmail: 'required|email',
		OrganizationAddress: ['required','regex:/^[a-zA-Z0-9,. :*-#\/] ?([a-zA-Z0-9,. :*-#\/]|[a-zA-Z0-9,. :*-#\/] )*[a-zA-Z0-9,. :*-#\/]$/'],
		OrganizationType: 'required|in:consignee,fleet,admin',
		OrganizationCountry: ['required','regex:/^[a-zA-Z0-9 ]*$/'],
		OrganizationCity: ['required','regex:/^[a-zA-Z0-9 ]*$/'],
		OrganizationState: ['required','regex:/^[a-zA-Z0-9 ]*$/'],
		OrganizationPin: ['required','regex:/^[1-9][0-9]{5}$/'],
		OrganizationContact: ['regex:/^[a-zA-Z ]*$/'],
		OrganizationMobile: 'digits:10',
		primaryContactName: ['required','regex:/^[a-zA-Z ]*$/'],
		primaryContactMobileNumber: 'required|digits:10',
		biddingClient: 'required|in:true,false',
		active: 'required|in:true,false'
	};
	let error = {
		'required.organizationId': 'Organization id must be required',
		'numeric.organizationId': 'Organization id must be numeric',
		'required.OrganizationName': 'Organization name must be required',
		'regex.OrganizationName': 'Organization name must be alpha-numeric, dot, hyphen and space',
		'required.OrganizationEmail': 'Organization e-mail must be required',
		'email.OrganizationEmail': 'Organization e-mail must be example@example.com',
		'required.OrganizationAddress': 'Organization address must be required',
		'regex.OrganizationAddress': 'Organization address must be alpha-numeric, hash, comma, dot, star, hyphen, colon, space and slash',
		'required.OrganizationType': 'Organization type must be required',
		'in.OrganizationType': 'Organization type must be consignee or fleet or admin',
		'required.OrganizationCountry': 'Organization country must be required',
		'regex.OrganizationCountry': 'Organization country must be alphabet and space',
		'required.OrganizationCity': 'Organization city must be required',
		'regex.OrganizationCity': 'Organization city must be alphabet and space',
		'required.OrganizationState': 'Organization state must be required',
		'regex.OrganizationState': 'Organization state must be alphabet and space',
		'required.OrganizationPin': 'Organization pin must be required',
		'regex.OrganizationPin': 'Organization pin must be mumeric and 6 digits',
		'required.OrganizationContact': 'Organization contact name must be required',
		'regex.OrganizationContact': 'Organization contact name must be alphabet and space',
		'required.OrganizationMobile': 'Organization contact mobile number must be required',
		'digits.OrganizationMobile': 'Organization contact mobile number must be 10 digits',
		'required.primaryContactName': 'Organization primary contact name must be required',
		'regex.primaryContactName': 'Organization primary contact name must be alphabet and space',
		'required.primaryContactMobileNumber': 'Organization primary contact mobile number must be required',
		'digits.primaryContactMobileNumber': 'Organization primary contact mobile number must be 10 digits',
		'required.biddingClient': 'Bidding client must be required',
		'in.biddingClient': 'Bidding client must be true or false',
		'required.active': 'Active must be required',
		'in.active': 'Active must be true or false'
	};
	let validation = new Validator(data, rules, error);
	return validation;
};
exports.createOrganizationById = (req) => {
	let data = {
		OrganizationName: req.OrganizationName,
		OrganizationEmail: req.OrganizationEmail,
		OrganizationAddress: req.OrganizationAddress,
		OrganizationType: req.OrganizationType,
		OrganizationCountry: req.OrganizationCountry,
		OrganizationCity: req.OrganizationCity,
		OrganizationState: req.OrganizationState,
		OrganizationPin: req.OrganizationPin,
		OrganizationContact: req.OrganizationContact,
		OrganizationMobile: req.OrganizationMobile,
		primaryContactName: req.primaryContactName,
		primaryContactMobileNumber: req.primaryContactMobileNumber,
		biddingClient: req.biddingClient,
		active: req.active
	};
	let rules = {
		OrganizationName: ['required','regex:/^[a-zA-Z0-9.- ]*$/'],
		OrganizationEmail: 'required|email',
		OrganizationAddress: ['required','regex:/^[a-zA-Z0-9,. :*-#\/] ?([a-zA-Z0-9,.*-#\/]|[a-zA-Z0-9,. :*-#\/] )*[a-zA-Z0-9,. :*-#\/]$/'],
		OrganizationType: 'required|in:consignee,fleet,admin',
		OrganizationCountry: ['required','regex:/^[a-zA-Z0-9 ]*$/'],
		OrganizationCity: ['required','regex:/^[a-zA-Z0-9 ]*$/'],
		OrganizationState: ['required','regex:/^[a-zA-Z0-9 ]*$/'],
		OrganizationPin: ['required','regex:/^[1-9][0-9]{5}$/'],
		OrganizationContact: ['regex:/^[a-zA-Z ]*$/'],
		OrganizationMobile: 'digits:10',
		primaryContactName: ['required','regex:/^[a-zA-Z ]*$/'],
		primaryContactMobileNumber: 'required|digits:10',
		biddingClient: 'required|in:true,false',
		active: 'required|in:true,false'
	};
	let error = {
		'required.OrganizationName': 'Organization name must be required',
		'regex.OrganizationName': 'Organization name must be alpha-numeric, dot, hyphen and space',
		'required.OrganizationEmail': 'Organization e-mail must be required',
		'email.OrganizationEmail': 'Organization e-mail must be example@example.com',
		'required.OrganizationAddress': 'Organization address must be required',
		'regex.OrganizationAddress': 'Organization address must be alpha-numeric, hash, comma, dot, star, hyphen, colon, space and slash',
		'required.OrganizationType': 'Organization type must be required',
		'in.OrganizationType': 'Organization type must be consignee or fleet or admin',
		'required.OrganizationCountry': 'Organization country must be required',
		'regex.OrganizationCountry': 'Organization country must be alphabet and space',
		'required.OrganizationCity': 'Organization city must be required',
		'regex.OrganizationCity': 'Organization city must be alphabet and space',
		'required.OrganizationState': 'Organization state must be required',
		'regex.OrganizationState': 'Organization state must be alphabet and space',
		'required.OrganizationPin': 'Organization pin must be required',
		'regex.OrganizationPin': 'Organization pin must be mumeric and 6 digits',
		'required.OrganizationContact': 'Organization contact name must be required',
		'regex.OrganizationContact': 'Organization contact name must be alphabet and space',
		'required.OrganizationMobile': 'Organization contact mobile number must be required',
		'digits.OrganizationMobile': 'Organization contact mobile number must be 10 digits',
		'required.primaryContactName': 'Organization primary contact name must be required',
		'regex.primaryContactName': 'Organization primary contact name must be alphabet and space',
		'required.primaryContactMobileNumber': 'Organization primary contact mobile number must be required',
		'digits.primaryContactMobileNumber': 'Organization primary contact mobile number must be 10 digits',
		'required.biddingClient': 'Bidding client must be required',
		'in.biddingClient': 'Bidding client must be true or false',
		'required.active': 'Active must be required',
		'in.active': 'Active must be true or false'
	};
	let validation = new Validator(data, rules, error);
	return validation;
};
exports.getSearchTracking = (req) => {
	let data = {
		organizationId: req.organizationId,
		trackingId: req.trackingId
	};
	let rules = {
		organizationId: 'numeric',
		trackingId: 'numeric'
	};
	let error = {
		'numeric.organizationId': 'Organization id must be numeric',
		'numeric.trackingId': 'Tracking id must be numeric'
	};
	let validation = new Validator(data, rules, error);
	return validation;
};
exports.getCompleteTrackingList = (req) => {
	let data = {
		organizationId: req.organizationId,
		fromDate: req.fromDate,
		toDate: req.toDate,
		fromCount: req.fromCount,
		toCount: req.toCount,
		status: req.status
	};
	let rules = {
		organizationId: 'numeric',
		fromDate: 'required|date',
		toDate: 'required|date',
		fromCount: 'required|numeric',
		toCount: 'required|numeric',
		status: 'in:in-progress,completed,failed,delay,canceled,awaited,tracked,non-tracked'
	};
	let error = {
		'numeric.organizationId': 'Organization id must be numeric',
		'required.fromDate': 'From date must be required',
		'date.fromDate': 'From date must be yyyy-mm-dd format',
		'required.toDate': 'To date must be required',
		'date.toDate': 'To date must be yyyy-mm-dd format',
		'required.fromCount': 'From count must be required',
		'numeric.fromCount': 'From count must be numeric',
		'required.toCount': 'To count must be required',
		'numeric.toCount': 'To count must be numeric',
		'in.status': 'Status must be in-progress or completed or failed or delay or canceled or awaited or tracked or non-tracked'
	};
	let validation = new Validator(data, rules, error);
	return validation;
};
exports.getTotalTrackingCount = (req) => {
	let data = {
		organizationId: req.organizationId,
		fromDate: req.fromDate,
		toDate: req.toDate,
		status: req.status
	};
	let rules = {
		organizationId: 'numeric',
		fromDate: 'required|date',
		toDate: 'required|date',
		status: 'in:in-progress,completed,failed,delay,canceled,awaited,tracked,non-tracked'
	};
	let error = {
		'numeric.organizationId': 'Organization id must be numeric',
		'required.fromDate': 'From date must be required',
		'date.fromDate': 'From date must be yyyy-mm-dd format',
		'required.toDate': 'To date must be required',
		'date.toDate': 'To date must be yyyy-mm-dd format',
		'in.status': 'Status must be in-progress or completed or failed or delay or canceled or awaited or tracked or non-tracked'
	};
	let validation = new Validator(data, rules, error);
	return validation;
};
exports.getChangeTrackingStatus = (req) => {
	let data = {
		trackingId: req.trackingId,
		status: req.status
	};
	let rules = {
		trackingId: 'required|numeric',
		status: 'required|in:in-progress,completed,failed,delay,canceled,awaited,tracked,non-tracked'
	};
	let error = {
		'required.trackingId': 'Tracking id must be required',
		'numeric.trackingId': 'Tracking id must be numeric',
		'required.status': 'Status id must be required',
		'in.status': 'Status id must be in-progress or completed or failed,delay or canceled or awaited or tracked or non-tracked'
	};
	let validation = new Validator(data, rules, error);
	return validation;
};
exports.getEnableDisableTracking = (req) => {
	let data = {
		trackingId: req.trackingId,
		active: req.active
	};
	let rules = {
		trackingId: 'required|numeric',
		active: 'required|in:enable,disable'
	};
	let error = {
		'required.trackingId': 'Tracking id must be required',
		'numeric.trackingId': 'Tracking id must be numeric',
		'required.active': 'Active must be required',
		'in.active': 'Active must be enable or disable'
	};
	let validation = new Validator(data, rules, error);
	return validation;
};
exports.getTrackingDetails = (req) => {
	let data = {
		trackingId: req.trackingId,
		organizationId: req.organizationId
	};
	let rules = {
		trackingId: 'numeric',
		organizationId: 'numeric'
	};
	let error = {
		'numeric.trackingId': 'Tracking id must be required',
		'numeric.organizationId': 'Organization id must be numeric'
	};
	let validation = new Validator(data, rules, error);
	return validation;
};
exports.getTracking = (req) => {
	let data = {
		trackingId: req.trackingId
	};
	let rules = {
		trackingId: 'numeric'
	};
	let error = {
		'numeric.trackingId': 'Tracking id must be required'
	};
	let validation = new Validator(data, rules, error);
	return validation;
};
exports.sendSmsForDrop = (req) => {
	let data = {
		trackingId: req.trackingId,
		organizationId: req.organizationId
	};
	let rules = {
		trackingId: 'required|numeric',
		organizationId: 'required|numeric'
	};
	let error = {
		'required.trackingId': 'Tracking id must be required',
		'numeric.trackingId': 'Tracking id must be numeric',
		'required.organizationId': 'Organization id must be required',
		'numeric.organizationId': 'Organization id must be numeric'
	};
	let validation = new Validator(data, rules, error);
	return validation;
};
exports.particularTrackingDetails = (req) => {
	let data = {
		trackingId: req.trackingId,
		organizationId: req.organizationId
	};
	let rules = {
		trackingId: 'required|numeric',
		organizationId: 'required|numeric',
		userId: 'required|numeric'
	};
	let error = {
		'required.trackingId': 'Tracking id must be required',
		'numeric.trackingId': 'Tracking id must be numeric',
		'required.organizationId': 'Organization id must be required',
		'numeric.organizationId': 'Organization id must be numeric'
	};
	let validation = new Validator(data, rules, error);
	return validation;
};
exports.updateTrackingStatus = (req) => {
	let data = {
		trackingId: req.trackingId,
		organizationId: req.organizationId,
		status: req.status
	};
	let rules = {
		trackingId: 'required|numeric',
		organizationId: 'required|numeric',
		status: 'required|in:in-progress,completed,failed,delay,canceled,awaited,tracked,non-tracked'
	};
	let error = {
		'required.trackingId': 'Tracking id must be required',
		'numeric.trackingId': 'Tracking id must be numeric',
		'required.organizationId': 'Organization id must be required',
		'numeric.organizationId': 'Organization id must be numeric',
		'required.status': 'Status must be required',
		'in.status': 'Status must be Status id must be in-progress or completed or failed,delay or canceled or awaited or tracked or non-tracked'
	};
	let validation = new Validator(data, rules, error);
	return validation;
};
exports.updateTrackingActive = (req) => {
	let data = {
		trackingId: req.trackingId,
		organizationId: req.organizationId,
		active: req.active
	};
	let rules = {
		trackingId: 'required|numeric',
		organizationId: 'required|numeric',
		active: 'required|in:active,inactive'
	};
	let error = {
		'required.trackingId': 'Tracking id must be required',
		'numeric.trackingId': 'Tracking id must be numeric',
		'required.organizationId': 'Organization id must be required',
		'numeric.organizationId': 'Organization id must be numeric',
		'required.active': 'Active must be required',
		'in.active': 'Active must be active or inactive'
	};
	let validation = new Validator(data, rules, error);
	return validation;
};
exports.updateActiveMobileNumber = (req) => {
	let data = {
		trackingId: req.trackingId,
		organizationId: req.organizationId,
		activeMobileNumber: req.activeMobileNumber
	};
	let rules = {
		trackingId: 'required|numeric',
		organizationId: 'required|numeric',
		activeMobileNumber: 'required|digits:10'
	};
	let error = {
		'required.trackingId': 'Tracking id must be required',
		'numeric.trackingId': 'Tracking id must be numeric',
		'required.organizationId': 'Organization id must be required',
		'numeric.organizationId': 'Organization id must be numeric',
		'required.activeMobileNumber': 'Active mobile number must be required',
		'digits.activeMobileNumber': 'Active mobile number must be 10 digits'
	};
	let validation = new Validator(data, rules, error);
	return validation;
};
exports.addContactandMobileNumber = (req) => {
	let data = {
		trackingId: req.trackingId,
		organizationId: req.organizationId,
		contactName: req.addMobileNumber.contactName,
		contactMobileNumber: req.addMobileNumber.contactMobileNumber,
		trackable: req.addMobileNumber.trackable
	};
	let rules = {
		trackingId: 'required|numeric',
		organizationId: 'required|numeric',
		contactName: ['required','regex:/^[a-zA-Z ]*$/'],
		contactMobileNumber: 'required|digits:10',
		trackable: 'required|in:true,false'
	};
	let error = {
		'required.trackingId': 'Tracking id must be required',
		'numeric.trackingId': 'Tracking id must be numeric',
		'required.organizationId': 'Organization id must be required',
		'numeric.organizationId': 'Organization id must be numeric',
		'required.contactName': 'Contact name must be required',
		'regex.contactName': 'Contact name must be alphabet and space',
		'required.contactMobileNumber': 'Contact mobile number must be required',
		'digits.contactMobileNumber': 'Contact mobile number must be 10 digits',
		'required.trackable': 'Trackable must be required',
		'in.trackable': 'Trackable must be true or false'
	};
	let validation = new Validator(data, rules, error);
	return validation;
};
exports.updateTrackingDetails = (req) => {
	let data = {
		trackingId: req.trackingId,
		organizationId: req.organizationId,
		timeStamp: req.trackingDetails.timeStamp,
		latitude: req.trackingDetails.latitude,
		longitude: req.trackingDetails.longitude,
		city: req.trackingDetails.city,
		state: req.trackingDetails.state
	};
	let rules = {
		trackingId: 'required|numeric',
		organizationId: 'required|numeric',
		timeStamp: ['required','regex:/^$|^(([01][0-9])|(2[0-3])):[0-5][0-9]$/'],
		latitude: ['required','regex:/^(\\+|-)?(?:90(?:(?:\\.0{1,80})?)|(?:[0-9]|[1-8][0-9])(?:(?:\\.[0-9]{1,80})?))$/'],
		longitude: ['required','regex:/^(\\+|-)?(?:180(?:(?:\\.0{1,80})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\\.[0-9]{1,80})?))$/'],
		city: ['required','regex:/^[a-zA-Z0-9 ]*$/'],
		state: ['required','regex:/^[a-zA-Z0-9 ]*$/']
	};
	let error = {
		'required.trackingId': 'Tracking id must be required',
		'numeric.trackingId': 'Tracking id must be numeric',
		'required.organizationId': 'Organization id must be required',
		'numeric.organizationId': 'Organization id must be numeric',
		'required.timeStamp': 'Time stamp must be required',
		'regex.timeStamp': 'Time stamp must be 02:03 format',
		'required.latitude': 'Latitude must be required',
		'regex.latitude': 'Latitude must be 33.333333 format',
		'required.longitude': 'Longitude must be required',
		'regex.longitude': 'Longitude must be 34.333333 format',
		'required.city': 'Latitude must be required',
		'regex.city': 'Latitude must be alphabets',
		'required.state': 'Longitude must be required',
		'regex.state': 'Longitude must be alphabets'
	};
	let validation = new Validator(data, rules, error);
	return validation;
};
exports.generateReport = (req) => {
	let data = {
		organizationId: req.organizationId,
		fromDate: req.fromDate,
		toDate: req.toDate,
		type: req.type
	};
	let rules = {
		organizationId: 'numeric',
		fromDate: 'required|date',
		toDate: 'required|date',
		type: 'required|in:bulk,mis'
	};
	let error = {
		'required.organizationId': 'Organization id must be required',
		'numeric.organizationId': 'Organization id must be numeric',
		'required.fromDate': 'From date must be required',
		'date.fromDate': 'From date must be yyyy-mm-dd format',
		'required.toDate': 'To date must be required',
		'date.toDate': 'To date must be yyyy-mm-dd format',
		'required.type': 'Type must be required',
		'in.type': 'Type must be bulk or mis'
	};
	let validation = new Validator(data, rules, error);
	return validation;
};
exports.getTrackingDetailss = (req) => {
	let data = {
		trackingId: req.trackingId
	};
	let rules = {
		trackingId: 'required|numeric'
	};
	let error = {
		'required.trackingId': 'Tracking id must be required',
		'numeric.trackingId': 'Tracking id must be numeric'
	};
	let validation = new Validator(data, rules, error);
	return validation;
};
exports.editOtherMobileNumber = (req) => {
	let data = {
		trackingId: req.trackingId,
		otherMobileNumber: req.otherMobileNumber
	};
	let rules = {
		trackingId: 'required|numeric',
		otherMobileNumber: 'required|array'
	};
	let error = {
		'required.trackingId': 'Tracking id must be required',
		'numeric.trackingId': 'Tracking id must be numeric',
		'required.otherMobileNumber': 'Other mobile number must be required',
		'array.otherMobileNumber': 'Other mobile number must be array format'
	};
	let validation = new Validator(data, rules, error);
	return validation;
};
exports.editOtherLocation = (req) => {
	let data = {
		trackingId: req.trackingId,
		otherLocation: req.otherLocation
	};
	let rules = {
		trackingId: 'required|numeric',
		otherLocation: 'required|array'
	};
	let error = {
		'required.trackingId': 'Tracking id must be required',
		'numeric.trackingId': 'Tracking id must be numeric',
		'required.otherLocation': 'Other location must be required',
		'array.otherLocation': 'Other location must be array format'
	};
	let validation = new Validator(data, rules, error);
	return validation;
};
exports.editParticularSection = (req) => {
	let data = {
		trackingId: req.trackingId,
		otherLocation: req.otherLocation,
		otherMobileNumber: req.otherMobileNumber,
		totalTrackCount: req.totalTrackCount,
		comment: req.comment
	};
	let rules = {
		trackingId: 'required|numeric',
		otherLocation: 'required|array',
		otherMobileNumber: 'required|array',
		totalTrackCount: 'required|numeric',
		comment: ['required','regex:/^[a-zA-Z0-9,.@#$%&!=+:;"*-\/] ?([a-zA-Z0-9,.@#$%&!=+:;"*-\/]|[a-zA-Z0-9,.@#$%&!=+:;"*-\/] )*[a-zA-Z0-9,.@#$%&!=+:;"*-\/]$/']
	};
	let error = {
		'required.trackingId': 'Tracking id must be required',
		'numeric.trackingId': 'Tracking id must be numeric',
		'required.otherLocation': 'Other location must be required',
		'array.otherLocation': 'Other location must be array format',
		'required.otherMobileNumber': 'Other mobile number must be required',
		'array.otherMobileNumber': 'Other mobile number must be array format',
		'required.totalTrackCount': 'Max tracking count must be required',
		'numeric.totalTrackCount': 'Max tracking count must be numeric',
		'required.comment':'Comment must be required',
		'regex.comment':'Comment must be alpha-numeric, comma, dot, star, hyphen, underscore and slash'
	};
	let validation = new Validator(data, rules, error);
	return validation;
};
exports.uploadOrganizationLogo = (req) => {
	let data = {
		organizationId: req.organizationId,
		logo: req.logo,
		logoType: req.logoType,
		type: req.type
	};
	let rules = {
		organizationId: 'required|numeric',
		logo: 'required',
		logoType: 'required|in:jpg,png,gif,jpeg',
		type: ['required','regex:/^[a-z]*$/']
	};
	let error = {
		'required.organizationId': 'Organization id must be required',
		'numeric.organizationId': 'Organization id must be numeric',
		'required.logo': 'Logo must be required',
		'required.logoType': 'Logo type must be required',
		'in.logoType': 'Logo type must be jpg or png or gif or jpeg',
		'required.type': 'Type must be required',
		'array.type': 'Type must be alphabets and small latter'
	};
	let validation = new Validator(data, rules, error);
	return validation;
};
exports.getPriceByOrganizationId = (req) => {
	let data = {
		organizationId: req.organizationId
	};
	let rules = {
		organizationId: 'required|numeric'
	};
	let error = {
		'required.organizationId': 'Organization id must be required',
		'numeric.organizationId': 'Organization id must be numeric'
	};
	let validation = new Validator(data, rules, error);
	return validation;
};
exports.getLicenseDetailsByOrganizationId = (req) => {
	let data = {
		organizationId: req.organizationId
	};
	let rules = {
		organizationId: 'required|numeric'
	};
	let error = {
		'required.organizationId': 'Organization id must be required',
		'numeric.organizationId': 'Organization id must be numeric'
	};
	let validation = new Validator(data, rules, error);
	return validation;
};
exports.getPaynemtHistoryByOrganizationId = (req) => {
	let data = {
		organizationId: req.organizationId
	};
	let rules = {
		organizationId: 'required|numeric'
	};
	let error = {
		'required.organizationId': 'Organization id must be required',
		'numeric.organizationId': 'Organization id must be numeric'
	};
	let validation = new Validator(data, rules, error);
	return validation;
};
exports.getPaynemtHistoryByBillingId = (req) => {
	let data = {
		BillingId: req.BillingId
	};
	let rules = {
		BillingId: 'required|numeric'
	};
	let error = {
		'required.BillingId': 'Billing id must be required',
		'numeric.BillingId': 'Billing id must be numeric'
	};
	let validation = new Validator(data, rules, error);
	return validation;
};
exports.purchaseLicenseByOrganizationId = (req) => {
	let data = {
		organizationId: req.organizationId
	};
	let rules = {
		organizationId: 'required|numeric'
	};
	let error = {
		'required.organizationId': 'Organization id must be required',
		'numeric.organizationId': 'Organization id must be numeric'
	};
	let validation = new Validator(data, rules, error);
	return validation;
};
exports.purchaseLicenseByOrganizationsId = (req) => {
	let data = {
		organizationId: req.organizationId
	};
	let rules = {
		organizationId: 'required|numeric'
	};
	let error = {
		'required.organizationId': 'Organization id must be required',
		'numeric.organizationId': 'Organization id must be numeric'
	};
	let validation = new Validator(data, rules, error);
	return validation;
};
exports.getAllPaymentByOrganizationIdAndMode = (req) => {
	let data = {
		organizationId: req.organizationId,
		mode: req.mode
	};
	let rules = {
		organizationId: 'required|numeric',
		mode: 'required|numeric'
	};
	let error = {
		'required.organizationId': 'Organization id must be required',
		'numeric.organizationId': 'Organization id must be numeric',
		'required.mode': 'Mode must be required',
		'numeric.mode': 'Mode must be numeric'
	};
	let validation = new Validator(data, rules, error);
	return validation;
};
exports.getTotalPurchaseByOrganizationId = (req) => {
	let data = {
		organizationId: req.organizationId
	};
	let rules = {
		organizationId: 'required|numeric'
	};
	let error = {
		'required.organizationId': 'Organization id must be required',
		'numeric.organizationId': 'Organization id must be numeric'
	};
	let validation = new Validator(data, rules, error);
	return validation;
};
exports.getTotalUsedByOrganizationId = (req) => {
	let data = {
		organizationId: req.organizationId
	};
	let rules = {
		organizationId: 'required|numeric'
	};
	let error = {
		'required.organizationId': 'Organization id must be required',
		'numeric.organizationId': 'Organization id must be numeric'
	};
	let validation = new Validator(data, rules, error);
	return validation;
};
exports.getUsedVsPendingLicenseByOrganizationId = (req) => {
	let data = {
		organizationId: req.organizationId
	};
	let rules = {
		organizationId: 'required|numeric'
	};
	let error = {
		'required.organizationId': 'Organization id must be required',
		'numeric.organizationId': 'Organization id must be numeric'
	};
	let validation = new Validator(data, rules, error);
	return validation;
};
exports.makeid = (req) => {
	var result           = '';
	var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#@!$&';
	var charactersLength = characters.length;
	console.log(charactersLength);
	for ( var i = 0; i < req; i++ ) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
};