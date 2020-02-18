var express = require('express');
var router = express.Router();
var expressValidator = require('express-validator');
router.use(expressValidator());
var analysisController = require('../controllers/api/analysis/analysisController');
var dashboardController = require('../controllers/api/dashboard/dashboardController');
var organizationController = require('../controllers/api/organization/organizationController');
var reportController = require('../controllers/api/report/reportController');
var trackingController = require('../controllers/api/tracking/trackingController');
var loginController = require('../controllers/api/login/loginController');

/*Analysis Controller Start*/
router.post('/login',loginController.getLogin);
router.post('/login/verify-otp',loginController.getLoginVerifyOtp);
/*Analysis Controller End*/

/*Analysis Controller Start*/
router.post('/analysis/search-tracking',analysisController.getSearchTracking);
router.post('/analysis/complete-tracking-list',analysisController.getCompleteTrackingList);
router.post('/analysis/change-tracking-status',analysisController.getChangeTrackingStatus);
router.post('/analysis/enable-disable-tracking',analysisController.getEnableDisableTracking);
router.post('/analysis/tracking-details',analysisController.getTrackingDetails);
/*Analysis Controller End*/

/*Dashboard Controller Start*/
router.post('/dashboard/tracking-count',dashboardController.getTrackingCount);
router.post('/dashboard/tracking-history',dashboardController.getTrackingHistory);
router.post('/dashboard/tracking-analysis',dashboardController.getTrackingAnalysis);
router.post('/dashboard/failed-analysis',dashboardController.getFailedAnalysis);
router.post('/dashboard/tracking-add',dashboardController.getTrackingAdd);
router.post('/dashboard/organization-search',dashboardController.getOrganizationSearch);
router.post('/dashboard/tracking-search',dashboardController.getTrackingSearch);
router.post('/dashboard/active-inactive-Shipper',dashboardController.getActiveInactiveShipper);
/*Dashboard Controller End*/

/*Organization Controller Start*/
router.post('/organization/set-organization-status',organizationController.setOrganizationStatus);
router.post('/organization/load-by-organization-by-id',organizationController.getLoadByOrganizationById);
router.post('/organization/complete-organization-list',organizationController.getCompleteOrganizationList);
router.post('/organization/search-organization-in-details',organizationController.searchOrganizationInDetails);
router.post('/organization/add-user-organization',organizationController.addUserToOrganization);
router.post('/organization/remove-user-organization',organizationController.removeUserFromOrganization);
router.post('/organization/add-branch-organization',organizationController.addBranchToOrganization);
router.post('/organization/remove-branch-organization',organizationController.removeBranchToOrganization);
router.post('/organization/search-user',organizationController.searchUser);
router.post('/organization/edit-organization-by-id',organizationController.editOrganizationById);
router.post('/organization/add-organization-by-id',organizationController.createOrganizationById);
/*Organization Controller End*/

/*Report Controller Start*/
router.post('/report/generate-report',reportController.generateReport);
/*Report Controller End*/

/*Tracking Controller Start*/
router.post('/tracking/search-tracking',trackingController.getSearchTracking);
router.post('/tracking/complete-tracking-list',trackingController.getCompleteTrackingList);
router.post('/tracking/change-tracking-status',trackingController.getChangeTrackingStatus);
router.post('/tracking/enable-disable-tracking',trackingController.getEnableDisableTracking);
router.post('/tracking/tracking-details',trackingController.getTrackingDetails);
router.post('/tracking/view/tracking-detail',trackingController.particularTrackingDetails);
router.post('/tracking/search-organization',trackingController.getSearchOrganization);
router.post('/tracking/tracking-list',trackingController.getTracking);
router.post('/tracking/create-tracking',trackingController.createTracking);
router.post('/tracking/edit-tracking',trackingController.editTracking);
router.post('/tracking/update-tracking-status',trackingController.updateTrackingStatus);
router.post('/tracking/update-tracking-details',trackingController.updateTrackingDetails);
router.post('/tracking/update-tracking-active',trackingController.updateTrackingActive);
router.post('/tracking/update-active-mobile-number',trackingController.updateActiveMobileNumber);
router.post('/tracking/add-contact-mobile-number',trackingController.addContactandMobileNumber);
/*Tracking Controller End*/
module.exports = router;