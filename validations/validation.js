let Validator = require('validatorjs');
exports.Login = (req) => {
	let data = {
		mobile: req.mobile
	};
	let rules = {
		mobile: 'required|digits:10'
	};
	let error = {
		mobile: 'Phone number must be numeric and 10 digits'
	};
	let validation = new Validator(data, rules, error);
	return validation;
};
exports.LoginVerifyOtp = (req) => {
	let data = {
		userId: req.userId,
		otp: req.otp
	};
	let rules = {
		userId: 'required|numeric',
		otp: 'required|digits:6',
	};
	let error = {
		userId: 'User id must be numeric',
		otp: 'OTP must be numeric and 6 digits',
	};
	let validation = new Validator(data, rules, error);
	return validation;
};
exports.getTrackingCount = (req) => {
	let data = {
		userId: req.userId,
		role: req.role,
		fromDate: req.fromDate,
		toDate: req.toDate
	};
	let rules = {
		userId: 'required|numeric',
		role: 'required|string',
		fromDate: 'required|date',
		toDate: 'required|date'
	};
	let error = {
		userId: 'User id must be numeric',
		role: 'Role must be string',
		fromDate: 'From date must be 2020-01-01',
		toDate: 'To date must be 2020-01-01'
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
		role: 'required|string',
		fromDate: 'required|date',
		toDate: 'required|date'
	};
	let error = {
		userId: 'User id must be numeric',
		shipperId: 'Shipper id must be numeric',
		role: 'Role must be string',
		fromDate: 'From date must be 2020-01-01',
		toDate: 'To date must be 2020-01-01'
	};
	let validation = new Validator(data, rules, error);
	return validation;
};
exports.getTrackingAnalysis = (req) => {
	let data = {
		userId: req.userId,
		shipperId: req.shipperId,
		role: req.role,
		fromDate: req.fromDate,
		toDate: req.toDate,
		type: req.type
	};
	let rules = {
		userId: 'required|numeric',
		shipperId: 'numeric',
		role: 'required|string',
		fromDate: 'required|date',
		toDate: 'required|date',
		type: 'required|string'
	};
	let error = {
		userId: 'User id must be numeric',
		shipperId: 'Shipper id must be numeric',
		role: 'Role must be string',
		fromDate: 'From date must be 2020-01-01',
		toDate: 'To date must be 2020-01-01',
		type: 'Type must be string'
	};
	let validation = new Validator(data, rules, error);
	return validation;
};
exports.getFailedAnalysis = (req) => {
	let data = {
		userId: req.userId,
		shipperId: req.shipperId,
		role: req.role,
		fromDate: req.fromDate,
		toDate: req.toDate,
		type: req.type
	};
	let rules = {
		userId: 'required|numeric',
		shipperId: 'numeric',
		role: 'required|string',
		fromDate: 'required|date',
		toDate: 'required|date',
		type: 'required|string'
	};
	let error = {
		userId: 'User id must be numeric',
		shipperId: 'Shipper id must be numeric',
		role: 'Role must be string',
		fromDate: 'From date must be 2020-01-01',
		toDate: 'To date must be 2020-01-01',
		type: 'Type must be string'
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
		organizationName: 'string',
	};
	let error = {
		organizationId: 'Organization id must be numeric',
		organizationName: 'Organization Name must be string'
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
		vehicleNnumber: 'string',
		organizationId: 'numeric',
		mobileNumber: 'numeric',
	};
	let error = {
		trackingId: 'Organization id must be numeric',
		vehicleNnumber: 'Vehicle Nnumber must be string',
		organizationId: 'Organization id must be numeric',
		mobileNumber: 'Mobile Number must be numeric',
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
		type: 'required|string',
		count: 'required|numeric'
	};
	let error = {
		fromDate: 'From date must be 2020-01-01',
		toDate: 'To date must be 2020-01-01',
		type: 'Type must be string',
		count: 'Count must be string'
	};
	let validation = new Validator(data, rules, error);
	return validation;
};
exports.getTrackingAdd = (req) => {
	let data = {
		userId: req.userId,
		organizationId: req.organizationId,
		loadId: req.loadId,
		branchId: req.branchId,
		startDate: req.startDate,
		vehicleNumber: req.vehicleNumber,
		driverNumber: req.driverNumber,
		driverName: req.driverName,
		otherMobileNumber: req.otherMobileNumber,
		driverMobileOnTrack: req.driverMobileOnTrack,
		from: req.from,
		to: req.to,
		totalTrackCount: req.totalTrackCount
	};
	let rules = {
		userId: 'required|numeric',
		organizationId: 'required|numeric',
		loadId: 'required|numeric',
		branchId: 'required|numeric',
		startDate: 'required|date',
		vehicleNumber: 'required|alpha_num',
		driverNumber: 'required|numeric',
		driverName: 'required|string',
		otherMobileNumber: 'required|array',
		driverMobileOnTrack: 'required|string',
		from: 'required',
		to: 'required',
		totalTrackCount: 'required|numeric'
	};
	let error = {
		userId: 'User id must be numeric',
		organizationId: 'Organization id must be numeric',
		loadId: 'Load id must be numeric',
		branchId: 'Branch id must be numeric',
		startDate: 'Start date must be 2020-01-01',
		vehicleNumber: 'Vehicle number must be alphanumeric',
		driverNumber: 'Driver number must be numeric',
		driverName: 'Driver name may only contain alpha-numeric characters, as well as dashes and underscores',
		otherMobileNumber: 'Other mobile number must be string',
		driverMobileOnTrack: 'driver mobile on track must be array',
		from:'From must be required',
		to:'To must be required',
		totalTrackCount: 'Count must be string'
	};
	let validation = new Validator(data, rules, error);
	return validation;
};
exports.getTrackingEdit = (req) => {
	let data = {
		trackingId: req.trackingId,
		userId: req.userId,
		organizationId: req.organizationId,
		loadId: req.loadId,
		branchId: req.branchId,
		startDate: req.startDate,
		vehicleNumber: req.vehicleNumber,
		driverNumber: req.driverNumber,
		driverName: req.driverName,
		otherMobileNumber: req.otherMobileNumber,
		driverMobileOnTrack: req.driverMobileOnTrack,
		from: req.from,
		to: req.to,
		totalTrackCount: req.totalTrackCount
	};
	let rules = {
		trackingId: 'required|numeric',
		userId: 'required|numeric',
		organizationId: 'required|numeric',
		loadId: 'required|numeric',
		branchId: 'required|numeric',
		startDate: 'required|date',
		vehicleNumber: 'required|alpha_num',
		driverNumber: 'required|numeric',
		driverName: 'required|string',
		otherMobileNumber: 'required|array',
		driverMobileOnTrack: 'required|string',
		from: 'required',
		to: 'required',
		totalTrackCount: 'required|numeric'
	};
	let error = {
		trackingId: 'User id must be numeric',
		userId: 'User id must be numeric',
		organizationId: 'Organization id must be numeric',
		loadId: 'Load id must be numeric',
		branchId: 'Branch id must be numeric',
		startDate: 'Start date must be 2020-01-01',
		vehicleNumber: 'Vehicle number must be alphanumeric',
		driverNumber: 'Driver number must be numeric',
		driverName: 'Driver name may only contain alpha-numeric characters, as well as dashes and underscores',
		otherMobileNumber: 'Other mobile number must be string',
		driverMobileOnTrack: 'driver mobile on track must be array',
		from:'From must be required',
		to:'To must be required',
		totalTrackCount: 'Count must be string'
	};
	let validation = new Validator(data, rules, error);
	return validation;
};
exports.setOrganizationStatus = (req) => {
	let data = {
		userId: req.userId,
		organizationId: req.organizationId,
		status: req.status
	};
	let rules = {
		userId: 'required|numeric',
		organizationId: 'required|numeric',
		status: 'required|alpha'
	};
	let error = {
		userId: 'User id must be numeric',
		organizationId: 'Organization id must be numeric',
		status: 'Status id must be alpha'
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
		fromDate: 'User id must be 2020-01-01',
		organizationId: 'Organization id must be numeric',
		toDate: 'Status id must be  2020-01-01'
	};
	let validation = new Validator(data, rules, error);
	return validation;
};
exports.getCompleteOrganizationList = (req) => {
	let data = {
		fromDate: req.fromDate,
		toDate: req.toDate,
		fromCount: req.fromCount,
		toCount: req.toCount,
		sortBy: req.sortBy,
	};
	let rules = {
		fromDate: 'required|date',
		toDate: 'required|date',
		fromCount: 'required|numeric',
		toCount: 'required|numeric',
		sortBy: 'required|alpha',
	};
	let error = {
		fromDate: 'User id must be 2020-01-01',
		toDate: 'Status id must be  2020-01-01',
		fromCount: 'User id must be numeric',
		toCount: 'Status id must be  numeric',
		sortBy: 'Sort by id must be alpha',
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
		organizationId: 'Organization id must be numeric'
	};
	let validation = new Validator(data, rules, error);
	return validation;
};
exports.addUserToOrganization = (req) => {
	let data = {
		organizationId: req.organizationId,
		userName: req.userName,
		emailId: req.emailId,
		userMobileNumber: req.userMobileNumber,
		userRole: req.userRole
	};
	let rules = {
		organizationId: 'required|numeric',
		userName: 'required|string',
		emailId: 'required|email',
		userMobileNumber: 'required|numeric',
		userRole: 'required|alpha'
	};
	let error = {
		organizationId: 'Organization id must be numeric',
		userName: 'Organization id must be string',
		emailId: 'Organization id must be email',
		userMobileNumber: 'Organization id must be numeric',
		userRole: 'Organization id must be alpha'
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
		organizationId: 'Organization id must be numeric',
		userId: 'User id must be numeric'
	};
	let validation = new Validator(data, rules, error);
	return validation;
};
exports.addBranchToOrganization = (req) => {
	let data = {
		organizationId: req.organizationId,
		BranchName: req.BranchName,
		BranchContactPerson: req.BranchContactPerson,
		BranchContactNumber: req.BranchContactNumber,
		lat: req.BranchLocation.lat,
		lang: req.BranchLocation.lang
	};
	let rules = {
		organizationId: 'required|numeric',
		BranchName: 'required|string',
		BranchContactPerson: 'required|string',
		BranchContactNumber: 'required|numeric',
		lat: ['required','regex:/^(\\+|-)?(?:90(?:(?:\\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\\.[0-9]{1,6})?))$/'],
		lang: ['required','regex:/^(\\+|-)?(?:180(?:(?:\\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\\.[0-9]{1,6})?))$/']
	};
	let error = {
		organizationId: 'Organization id must be numeric',
		BranchName: 'Organization id must be numeric',
		BranchContactPerson: 'Organization id must be numeric',
		BranchContactNumber: 'Organization id must be numeric',
		lat: 'Organization id must be numeric',
		lang: 'User id must be numeric'
	};
	let validation = new Validator(data, rules, error);
	return validation;
};
exports.removeBranchToOrganization = (req) => {
	let data = {
		organizationId: req.organizationId,
		branchId: req.branchId
	};
	let rules = {
		organizationId: 'required|numeric',
		branchId: 'required|numeric'
	};
	let error = {
		organizationId: 'Organization id must be numeric',
		branchId: 'Branch id must be numeric'
	};
	let validation = new Validator(data, rules, error);
	return validation;
};
exports.editOrganizationById = (req) => {
	let data = {
		organizationId: req.organizationId,
		organisationName: req.organisationName,
		type: req.type,
		country: req.country,
		city: req.city,
		state: req.state,
		pincode: req.pincode,
		contactNo: req.contactNo,
		currency: req.currency
	};
	let rules = {
		organizationId: 'required|numeric',
		organisationName: 'required|string',
		type: 'required|string',
		country: 'required|string',
		city: 'required|string',
		state: 'required|string',
		pincode: 'required|numeric',
		contactNo: 'required|numeric',
		currency: 'required|string'
	};
	let error = {
		organizationId: 'Organization id must be numeric',
		organisationName: 'Organization id must be string',
		type: 'Organization id must be string',
		country: 'Organization id must be string',
		city: 'Organization id must be string',
		state: 'Organization id must be string',
		pincode: 'Organization id must be numeric',
		contactNo: 'Organization id must be numeric',
		currency: 'Organization id must be string'
	};
	let validation = new Validator(data, rules, error);
	return validation;
};
exports.createOrganizationById = (req) => {
	let data = {
		organisationName: req.organisationName,
		emailId: req.emailId,
		type: req.type,
		country: req.country,
		city: req.city,
		state: req.state,
		pincode: req.pincode,
		contactNo: req.contactNo,
		currency: req.currency
	};
	let rules = {
		organisationName: 'required|string',
		emailId: 'required|email',
		type: 'required|string',
		country: 'required|string',
		city: 'required|string',
		state: 'required|string',
		pincode: 'required|numeric',
		contactNo: 'required|numeric',
		currency: 'required|string'
	};
	let error = {
		organisationName: 'Organization id must be string',
		emailId: 'Organization email must be string',
		type: 'Organization type must be string',
		country: 'Organization country must be string',
		city: 'Organization city must be string',
		state: 'Organization state must be string',
		pincode: 'Organization pincode must be numeric',
		contactNo: 'Organization contactNo must be numeric',
		currency: 'Organization currency must be string'
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
		organizationId: 'Organization id must be numeric',
		trackingId: 'Tracking id must be numeric'
	};
	let validation = new Validator(data, rules, error);
	return validation;
};
exports.getCompleteTrackingList = (req) => {
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
		organizationId: 'Organization id must be numeric',
		fromDate: 'From date id must be 2020-01-01',
		toDate: 'To date must be 2020-01-01'
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
		status: 'required|string'
	};
	let error = {
		trackingId: 'Tracking id must be numeric',
		status: 'Status must be string'
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
		active: 'required|string'
	};
	let error = {
		trackingId: 'Tracking id must be numeric',
		active: 'Active must be string'
	};
	let validation = new Validator(data, rules, error);
	return validation;
};
exports.getTrackingDetails = (req) => {
	let data = {
		trackingId: req.trackingId
	};
	let rules = {
		trackingId: 'required|numeric'
	};
	let error = {
		trackingId: 'Tracking id must be numeric'
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
		trackingId: 'Tracking id must be numeric'
	};
	let validation = new Validator(data, rules, error);
	return validation;
};
exports.particularTrackingDetails = (req) => {
	let data = {
		trackingId: req.trackingId,
		organizationId: req.organizationId,
		userId: req.userId
	};
	let rules = {
		trackingId: 'required|numeric',
		organizationId: 'required|numeric',
		userId: 'required|numeric'
	};
	let error = {
		trackingId: 'Tracking id must be numeric',
		organizationId: 'Organization id must be numeric',
		userId: 'User id must be numeric'
	};
	let validation = new Validator(data, rules, error);
	return validation;
};
exports.updateTrackingStatus = (req) => {
	let data = {
		trackingId: req.trackingId,
		organizationId: req.organizationId,
		status: req.status,
		userId: req.userId
	};
	let rules = {
		trackingId: 'required|numeric',
		organizationId: 'required|numeric',
		status: 'required|string',
		userId: 'required|numeric'
	};
	let error = {
		trackingId: 'Tracking id must be numeric',
		organizationId: 'Organization id must be numeric',
		status: 'Status must be numeric',
		userId: 'User id must be numeric'
	};
	let validation = new Validator(data, rules, error);
	return validation;
};
exports.updateTrackingActive = (req) => {
	let data = {
		trackingId: req.trackingId,
		organizationId: req.organizationId,
		active: req.active,
		userId: req.userId
	};
	let rules = {
		trackingId: 'required|numeric',
		organizationId: 'required|numeric',
		active: 'required|string',
		userId: 'required|numeric'
	};
	let error = {
		trackingId: 'Tracking id must be numeric',
		organizationId: 'Organization id must be numeric',
		active: 'Active must be numeric',
		userId: 'User id must be numeric'
	};
	let validation = new Validator(data, rules, error);
	return validation;
};
exports.updateActiveMobileNumber = (req) => {
	let data = {
		trackingId: req.trackingId,
		organizationId: req.organizationId,
		activeMobileNumber: req.activeMobileNumber,
		userId: req.userId
	};
	let rules = {
		trackingId: 'required|numeric',
		organizationId: 'required|numeric',
		activeMobileNumber: 'required|numeric',
		userId: 'required|numeric'
	};
	let error = {
		trackingId: 'Tracking id must be numeric',
		organizationId: 'Organization id must be numeric',
		activeMobileNumber: 'Active mobile number must be numeric',
		userId: 'User id must be numeric'
	};
	let validation = new Validator(data, rules, error);
	return validation;
};
exports.addContactandMobileNumber = (req) => {
	let data = {
		trackingId: req.trackingId,
		organizationId: req.organizationId,
		contactName: req.contactName,
		contactMobileNumber: req.contactMobileNumber,
		trackables: req.trackables,
		userId: req.userId
	};
	let rules = {
		trackingId: 'required|numeric',
		organizationId: 'required|numeric',
		contactName: 'required|string',
		contactMobileNumber: 'required|numeric',
		trackables: 'required|numeric',
		userId: 'required|numeric'
	};
	let error = {
		trackingId: 'Tracking id must be numeric',
		organizationId: 'Organization id must be numeric',
		contactName: 'Contact name must be string',
		contactMobileNumber: 'Contact mobile number must be numeric',
		trackables: 'Trackables must be numeric',
		userId: 'User id must be numeric'
	};
	let validation = new Validator(data, rules, error);
	return validation;
};
exports.updateTrackingDetails = (req) => {
	let data = {
		trackingId: req.trackingId,
		organizationId: req.organizationId,
		timeStamp: req.timeStamp,
		latitude: req.latitude,
		longitude: req.longitude,
		userId: req.userId
	};
	let rules = {
		trackingId: 'required|numeric',
		organizationId: 'required|numeric',
		timeStamp: ['required','regex:/^$|^(([01][0-9])|(2[0-3])):[0-5][0-9]$/'],
		latitude: ['required','regex:/^(\\+|-)?(?:90(?:(?:\\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\\.[0-9]{1,6})?))$/'],
		longitude: ['required','regex:/^(\\+|-)?(?:180(?:(?:\\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\\.[0-9]{1,6})?))$/'],
		userId: 'required|numeric'
	};
	let error = {
		trackingId: 'Tracking id must be numeric',
		organizationId: 'Organization id must be numeric',
		timeStamp: 'Time Stamp must be numeric',
		latitude: 'Latitude must be numeric',
		longitude: 'Longitude must be numeric',
		userId: 'User id must be numeric'
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
		organizationId: 'required|numeric',
		fromDate: 'required|date',
		toDate: 'required|date',
		type: 'required|string'
	};
	let error = {
		organizationId: 'Organization id must be numeric',
		fromDate: 'From date id must be 2020-01-01',
		toDate: 'To date must be 2020-01-01',
		type: 'Type id must be string'
	};
	let validation = new Validator(data, rules, error);
	return validation;
};