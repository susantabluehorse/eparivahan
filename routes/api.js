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
var billingController = require('../controllers/api/billing/billingController');

/*Login Controller Start*/
router.post('/login',loginController.getLogin);
router.post('/login/verify-otp',loginController.getLoginVerifyOtp);
/*Login Controller End*/

/*Billing Controller Start*/
router.post('/billing/price-by-organization-id',billingController.getPriceByOrganizationId);
router.post('/billing/gst',billingController.getGST);
router.post('/billing/license-details-by-organization-id',billingController.getLicenseDetailsByOrganizationId);
router.post('/billing/paynemt-history-by-organization-id',billingController.getPaynemtHistoryByOrganizationId);
router.post('/billing/paynemt-history-by-billing-id',billingController.getPaynemtHistoryByBillingId);
router.post('/billing/purchase-license-by-organization-id',billingController.purchaseLicenseByOrganizationId);
router.post('/billing/purchase-license-by-organizations-id',billingController.purchaseLicenseByOrganizationsId);
router.post('/billing/all-payment-by-organization-id-mode',billingController.getAllPaymentByOrganizationIdAndMode);
router.post('/billing/total-purchase-by-organization-id',billingController.getTotalPurchaseByOrganizationId);
router.post('/billing/total-used-by-organization-id',billingController.getTotalUsedByOrganizationId);
router.post('/billing/used-vs-pending-license-by-organization-id',billingController.getUsedVsPendingLicenseByOrganizationId);
/*Billing Controller End*/

/*Analysis Controller Start*/
router.post('/analysis/change-tracking-status',analysisController.getChangeTrackingStatus);
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
router.post('/organization/edit-user-organization',organizationController.editUserToOrganization);
router.post('/organization/remove-user-organization',organizationController.removeUserFromOrganization);
router.post('/organization/add-branch-organization',organizationController.addBranchToOrganization);
router.post('/organization/edit-branch-organization',organizationController.editBranchToOrganization);
router.post('/organization/remove-branch-organization',organizationController.removeBranchToOrganization);
router.post('/organization/search-user',organizationController.searchUser);
router.post('/organization/search-branch',organizationController.searchBranch);
router.post('/organization/edit-organization-by-id',organizationController.editOrganizationById);
router.post('/organization/add-organization-by-id',organizationController.createOrganizationById);
router.post('/organization/get-organization-by-id',organizationController.getOrganizationById);
router.post('/organization/get-organization-totalorg-count',organizationController.getTotalorgCount);
router.post('/organization/upload-image',organizationController.uploadOrganizationLogo);
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
router.post('/tracking/bulk-traking-upload',trackingController.bulkTrakingUpload);
router.post('/tracking/total-tracking-count',trackingController.getTotalTrackingCount);
router.post('/tracking/edit-other-mobile-number',trackingController.editOtherMobileNumber);
router.post('/tracking/edit-other-location',trackingController.editOtherLocation);
router.post('/tracking/edit-to-location',trackingController.editToLocation);
router.post('/tracking/edit-to-count',trackingController.editTrakingCount);
router.post('/tracking/edit/tracking',trackingController.editParticularSection);
router.post('/tracking/send-sms',trackingController.sendSmsForDrop);
/*Tracking Controller End*/
module.exports = router;