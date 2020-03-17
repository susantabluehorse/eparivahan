var path = require('path');
var modelsPath = path.join(__dirname, '../../../', 'models');
var models = require(modelsPath);
var jwt = require('jsonwebtoken');
var SECRET = 'nodescratch';
var fs = require('file-system');
var bcrypt = require('bcrypt-nodejs');
var configPath = path.join(__dirname, '../../../', 'config', 'config.json');
var config = require(configPath);
var validationPath = path.join(__dirname, '../../../', 'validations', 'validation.js');
var validation = require(validationPath);
const http = require('http');
var Sequelize = require("sequelize");
var sequelize = new Sequelize(
    config.development.database, 
    config.development.username,
    config.development.password, {
        host: 'localhost',
        port: '3306',
        dialect: 'mysql',
        pool: {
            max: 5,
            min: 0,
            idle: 10000
        },
        // SQLite only
        //storage: 'path/to/database.sqlite'
    }
);
/************************* getPriceByOrganizationId api start *******************************/
exports.getPriceByOrganizationId = async function(req, res, next) {
    const { access_token } = req.headers;
    var header = validation.accessToken(req.headers);
    if(header.passes()===true){
        var accessToken =await sequelize.query("SELECT `id`,`remember_token` FROM `users` WHERE `remember_token`='"+access_token+"'",{ type: Sequelize.QueryTypes.SELECT });
        if(accessToken.length > 0){
            const { organizationId } = req.body;
            var mobileVali = validation.getPriceByOrganizationId(req.body);
            if(mobileVali.passes()===true){                
                var PriceByOrganizationId = await sequelize.query("SELECT `id` AS PriceId, `enterprise_id` AS organizationId, `price` AS Price, `status` AS Status, `created_at` AS CreatedDate FROM `billing_price` WHERE `enterprise_id`="+organizationId+"",{ type: Sequelize.QueryTypes.SELECT });
                if(PriceByOrganizationId.length > 0){
                    res.status(200).json({ success: true, data: PriceByOrganizationId });
                } else {
                    res.status(200).json({ success: false, data:"Not found data" });
                }
            } else {
                res.status(200).json({ success: mobileVali.passes(),data: mobileVali.errors.errors}); // Return json with error massage
            }
        } else {
            res.status(200).json({ success: false,data: 'You dont have permission to access'});// Return json with error massage
        }
    } else {
        res.status(200).json({ success: header.passes(),data: header.errors.errors});// Return json with error massage
    }
}
/************************* getPriceByOrganizationId api ends *******************************/

/************************* getGST api start *******************************/
exports.getGST = async function(req, res, next) {
    const { access_token } = req.headers;
    var header = validation.accessToken(req.headers);
    if(header.passes()===true){
        var accessToken =await sequelize.query("SELECT `id`,`remember_token` FROM `users` WHERE `remember_token`='"+access_token+"'",{ type: Sequelize.QueryTypes.SELECT });
        if(accessToken.length > 0){                
            var gst = await sequelize.query("SELECT `id` AS GSTId, `gst` AS GST FROM `billing_gst` WHERE `status`='active'",{ type: Sequelize.QueryTypes.SELECT });
            if(gst.length > 0){
                res.status(200).json({ success: true, data: gst });
            } else {
                res.status(200).json({ success: false, data:"Not found data" });
            }
        } else {
            res.status(200).json({ success: false,data: 'You dont have permission to access'});// Return json with error massage
        }
    } else {
        res.status(200).json({ success: header.passes(),data: header.errors.errors});// Return json with error massage
    }
}
/************************* getGST api ends *******************************/

/************************* getLicenseDetailsByOrganizationId api start *******************************/
exports.getLicenseDetailsByOrganizationId = async function(req, res, next) {
    const { access_token } = req.headers;
    var header = validation.accessToken(req.headers);
    if(header.passes()===true){
        var accessToken =await sequelize.query("SELECT `id`,`remember_token` FROM `users` WHERE `remember_token`='"+access_token+"'",{ type: Sequelize.QueryTypes.SELECT });
        if(accessToken.length > 0){
            const { organizationId } = req.body;
            var mobileVali = validation.getLicenseDetailsByOrganizationId(req.body);
            if(mobileVali.passes()===true){                
                var LicenseDetailsByOrganizationId = await sequelize.query("SELECT `id` AS licenseId, `enterprise_id` AS organizationId, `purchase_license_count` AS PurchaseLicenseCount, `purchase_date` AS PurchaseDate, `total_used_license` AS TotalUsedLicense, `total_purchase_license_count` AS TotalPurchaseLicenseCount, `status` AS Status, `created_at` AS CreatedDate FROM `billing_license` WHERE `enterprise_id`="+organizationId+"",{ type: Sequelize.QueryTypes.SELECT });
                if(LicenseDetailsByOrganizationId.length > 0){
                    res.status(200).json({ success: true, data: LicenseDetailsByOrganizationId });
                } else {
                    res.status(200).json({ success: false, data: 'Not found data' });
                }
            } else {
                res.status(200).json({ success: mobileVali.passes(),data: mobileVali.errors.errors}); // Return json with error massage
            }
        } else {
            res.status(200).json({ success: false,data: 'You dont have permission to access'});// Return json with error massage
        }
    } else {
        res.status(200).json({ success: header.passes(),data: header.errors.errors});// Return json with error massage
    }
}
/************************* getLicenseDetailsByOrganizationId api ends *******************************/

/************************* getPaynemtHistoryByOrganizationId api start *******************************/
exports.getPaynemtHistoryByOrganizationId = async function(req, res, next) {
    const { access_token } = req.headers;
    var header = validation.accessToken(req.headers);
    if(header.passes()===true){
        var accessToken =await sequelize.query("SELECT `id`,`remember_token` FROM `users` WHERE `remember_token`='"+access_token+"'",{ type: Sequelize.QueryTypes.SELECT });
        if(accessToken.length > 0){
            const { organizationId } = req.body;
            var mobileVali = validation.getPaynemtHistoryByOrganizationId(req.body);
            if(mobileVali.passes()===true){                
                var PaynemtHistoryByOrganizationId = await sequelize.query("SELECT `id` AS BillingId, `enterprise_id` AS organizationId, `mode` AS BillingMode, `amount` AS BIllingAmount, `date` AS BillingDate, `license_count` AS BillingLicenseCount, `enterprise_cheque_number` AS OrganizationChequeNumber, `enterprise_bank_name` AS OrganizationBankName, `enterprise_bank_branch` AS OrganizationBankBranch, `enterprise_account_number` AS OrganizationAccountNumber, `enterprise_purchase_rate` AS PurchaseRate, `status` AS Status, `created_at` AS CreatedDate FROM `billing` WHERE `enterprise_id`="+organizationId+"",{ type: Sequelize.QueryTypes.SELECT });
                if(PaynemtHistoryByOrganizationId.length > 0){
                    res.status(200).json({ success: true, data: PaynemtHistoryByOrganizationId });
                } else {
                    res.status(200).json({ success: false, data: 'Not found data' });
                }
            } else {
                res.status(200).json({ success: mobileVali.passes(),data: mobileVali.errors.errors}); // Return json with error massage
            }
        } else {
            res.status(200).json({ success: false,data: 'You dont have permission to access'});// Return json with error massage
        }
    } else {
        res.status(200).json({ success: header.passes(),data: header.errors.errors});// Return json with error massage
    }
}
/************************* getPaynemtHistoryByOrganizationId api ends *******************************/

/************************* getPaynemtHistortByBillingId api start *******************************/
exports.getPaynemtHistoryByBillingId = async function(req, res, next) {
    const { access_token } = req.headers;
    var header = validation.accessToken(req.headers);
    if(header.passes()===true){
        var accessToken =await sequelize.query("SELECT `id`,`remember_token` FROM `users` WHERE `remember_token`='"+access_token+"'",{ type: Sequelize.QueryTypes.SELECT });
        if(accessToken.length > 0){
            const { BillingId } = req.body;
            var mobileVali = validation.getPaynemtHistoryByBillingId(req.body);
            if(mobileVali.passes()===true){                
                var PaynemtHistoryByBillingId = await sequelize.query("SELECT `id` AS BillingId, `enterprise_id` AS organizationId, `mode` AS BillingMode, `amount` AS BIllingAmount, `date` AS BillingDate, `license_count` AS BillingLicenseCount, `enterprise_cheque_number` AS OrganizationChequeNumber, `enterprise_bank_name` AS OrganizationBankName, `enterprise_bank_branch` AS OrganizationBankBranch, `enterprise_account_number` AS OrganizationAccountNumber, `enterprise_purchase_rate` AS PurchaseRate, `status` AS Status, `created_at` AS CreatedDate FROM `billing` WHERE `id`="+BillingId+"",{ type: Sequelize.QueryTypes.SELECT });
                if(PaynemtHistoryByBillingId.length > 0){
                    res.status(200).json({ success: true, data: PaynemtHistoryByBillingId });
                } else {
                    res.status(200).json({ success: false, data: 'Not found data' });
                }
            } else {
                res.status(200).json({ success: mobileVali.passes(),data: mobileVali.errors.errors}); // Return json with error massage
            }
        } else {
            res.status(200).json({ success: false,data: 'You dont have permission to access'});// Return json with error massage
        }
    } else {
        res.status(200).json({ success: header.passes(),data: header.errors.errors});// Return json with error massage
    }
}
/************************* getPaynemtHistoryByBillingId api ends *******************************/

/************************* purchaseLicenseByOrganizationId api start *******************************/
exports.purchaseLicenseByOrganizationId = async function(req, res, next) {
    const { access_token } = req.headers;
    var header = validation.accessToken(req.headers);
    if(header.passes()===true){
        var accessToken =await sequelize.query("SELECT `id`,`remember_token` FROM `users` WHERE `remember_token`='"+access_token+"'",{ type: Sequelize.QueryTypes.SELECT });
        if(accessToken.length > 0){
            const { organizationId } = req.body;
            var mobileVali = validation.purchaseLicenseByOrganizationId(req.body);
            if(mobileVali.passes()===true){                
                var PurchaseLicenseByOrganizationId = await sequelize.query("SELECT `id` AS licenseId, `enterprise_id` AS organizationId, `purchase_license_count` AS PurchaseLicenseCount, `purchase_date` AS PurchaseDate, `total_used_license` AS TotalUsedLicense, `total_purchase_license_count` AS TotalPurchaseLicenseCount, `status` AS Status, `created_at` AS CreatedDate FROM `billing_license` WHERE `enterprise_id`="+organizationId+"",{ type: Sequelize.QueryTypes.SELECT });
                if(PurchaseLicenseByOrganizationId.length > 0){
                    res.status(200).json({ success: true, data: PurchaseLicenseByOrganizationId });
                } else {
                    res.status(200).json({ success: false, data: 'Not found data' });
                }
            } else {
                res.status(200).json({ success: mobileVali.passes(),data: mobileVali.errors.errors}); // Return json with error massage
            }
        } else {
            res.status(200).json({ success: false,data: 'You dont have permission to access'});// Return json with error massage
        }
    } else {
        res.status(200).json({ success: header.passes(),data: header.errors.errors});// Return json with error massage
    }
}
/************************* purchaseLicenseByOrganizationId api ends *******************************/

/************************* purchaseLicenseByOrganizationsId api start *******************************/
exports.purchaseLicenseByOrganizationsId = async function(req, res, next) {
    const { access_token } = req.headers;
    var header = validation.accessToken(req.headers);
    if(header.passes()===true){
        var accessToken =await sequelize.query("SELECT `id`,`remember_token` FROM `users` WHERE `remember_token`='"+access_token+"'",{ type: Sequelize.QueryTypes.SELECT });
        if(accessToken.length > 0){
            const { organizationId } = req.body;
            var mobileVali = validation.purchaseLicenseByOrganizationsId(req.body);
            if(mobileVali.passes()===true){                
                var reports = await sequelize.query("SELECT `id` AS licenseId, `enterprise_id` AS organizationId, `purchase_license_count` AS PurchaseLicenseCount, `purchase_date` AS PurchaseDate, `total_used_license` AS TotalUsedLicense, `total_purchase_license_count` AS TotalPurchaseLicenseCount, `status` AS Status, `created_at` AS CreatedDate FROM `billing_license` WHERE `enterprise_id`="+organizationId+"",{ type: Sequelize.QueryTypes.SELECT });
                if(reports.length > 0){
                    res.status(200).json({ success: true, data: 'Not found data' });
                } else {
                    res.status(200).json({ success: false });
                }
            } else {
                res.status(200).json({ success: mobileVali.passes(),data: mobileVali.errors.errors}); // Return json with error massage
            }
        } else {
            res.status(200).json({ success: false,data: 'You dont have permission to access'});// Return json with error massage
        }
    } else {
        res.status(200).json({ success: header.passes(),data: header.errors.errors});// Return json with error massage
    }
}
/************************* purchaseLicenseByOrganizationsId api ends *******************************/

/************************* getAllPaymentByOrganizationIdAndMode api start *******************************/
exports.getAllPaymentByOrganizationIdAndMode = async function(req, res, next) {
    const { access_token } = req.headers;
    var header = validation.accessToken(req.headers);
    if(header.passes()===true){
        var accessToken =await sequelize.query("SELECT `id`,`remember_token` FROM `users` WHERE `remember_token`='"+access_token+"'",{ type: Sequelize.QueryTypes.SELECT });
        if(accessToken.length > 0){
            const { organizationId, mode } = req.body;
            var mobileVali = validation.getAllPaymentByOrganizationIdAndMode(req.body);
            if(mobileVali.passes()===true){                
                var AllPaymentByOrganizationIdAndMode = await sequelize.query("SELECT `id` AS BillingId, `enterprise_id` AS organizationId, `mode` AS BillingMode, `amount` AS BIllingAmount, `date` AS BillingDate, `license_count` AS BillingLicenseCount, `enterprise_cheque_number` AS OrganizationChequeNumber, `enterprise_bank_name` AS OrganizationBankName, `enterprise_bank_branch` AS OrganizationBankBranch, `enterprise_account_number` AS OrganizationAccountNumber, `enterprise_purchase_rate` AS PurchaseRate, `status` AS Status, `created_at` AS CreatedDate FROM `billing` WHERE `enterprise_id`="+organizationId+" AND `mode`='"+mode+"'",{ type: Sequelize.QueryTypes.SELECT });
                if(AllPaymentByOrganizationIdAndMode.length > 0){
                    res.status(200).json({ success: true, data: AllPaymentByOrganizationIdAndMode });
                } else {
                    res.status(200).json({ success: false, data: 'Not found data' });
                }
            } else {
                res.status(200).json({ success: mobileVali.passes(),data: mobileVali.errors.errors}); // Return json with error massage
            }
        } else {
            res.status(200).json({ success: false,data: 'You dont have permission to access'});// Return json with error massage
        }
    } else {
        res.status(200).json({ success: header.passes(),data: header.errors.errors});// Return json with error massage
    }
}
/************************* getAllPaymentByOrganizationIdAndMode api ends *******************************/

/************************* getTotalPurchaseByOrganizationId api start *******************************/
exports.getTotalPurchaseByOrganizationId = async function(req, res, next) {
    const { access_token } = req.headers;
    var header = validation.accessToken(req.headers);
    if(header.passes()===true){
        var accessToken =await sequelize.query("SELECT `id`,`remember_token` FROM `users` WHERE `remember_token`='"+access_token+"'",{ type: Sequelize.QueryTypes.SELECT });
        if(accessToken.length > 0){
            const { organizationId } = req.body;
            var mobileVali = validation.getTotalPurchaseByOrganizationId(req.body);
            if(mobileVali.passes()===true){                
                var TotalPurchaseByOrganizationId = await sequelize.query("SELECT `id` AS licenseId, `enterprise_id` AS organizationId, `purchase_license_count` AS PurchaseLicenseCount, `purchase_date` AS PurchaseDate, `total_used_license` AS TotalUsedLicense, `total_purchase_license_count` AS TotalPurchaseLicenseCount, `status` AS Status, `created_at` AS CreatedDate FROM `billing_license` WHERE `enterprise_id`="+organizationId+"",{ type: Sequelize.QueryTypes.SELECT });
                if(TotalPurchaseByOrganizationId.length > 0){
                    res.status(200).json({ success: true, data: TotalPurchaseByOrganizationId });
                } else {
                    res.status(200).json({ success: false, data: 'Not found data' });
                }
            } else {
                res.status(200).json({ success: mobileVali.passes(),data: mobileVali.errors.errors}); // Return json with error massage
            }
        } else {
            res.status(200).json({ success: false,data: 'You dont have permission to access'});// Return json with error massage
        }
    } else {
        res.status(200).json({ success: header.passes(),data: header.errors.errors});// Return json with error massage
    }
}
/************************* getTotalPurchaseByOrganizationId api ends *******************************/

/************************* getTotalUsedByOrganizationId api start *******************************/
exports.getTotalUsedByOrganizationId = async function(req, res, next) {
    const { access_token } = req.headers;
    var header = validation.accessToken(req.headers);
    if(header.passes()===true){
        var accessToken =await sequelize.query("SELECT `id`,`remember_token` FROM `users` WHERE `remember_token`='"+access_token+"'",{ type: Sequelize.QueryTypes.SELECT });
        if(accessToken.length > 0){
            const { organizationId } = req.body;
            var mobileVali = validation.getTotalUsedByOrganizationId(req.body);
            if(mobileVali.passes()===true){                
                var TotalUsedByOrganizationId = await sequelize.query("SELECT `id` AS licenseId, `enterprise_id` AS organizationId, `purchase_license_count` AS PurchaseLicenseCount, `purchase_date` AS PurchaseDate, `total_used_license` AS TotalUsedLicense, `total_purchase_license_count` AS TotalPurchaseLicenseCount, `status` AS Status, `created_at` AS CreatedDate FROM `billing_license` WHERE `enterprise_id`="+organizationId+"",{ type: Sequelize.QueryTypes.SELECT });
                if(TotalUsedByOrganizationId.length > 0){
                    res.status(200).json({ success: true, data: TotalUsedByOrganizationId });
                } else {
                    res.status(200).json({ success: false, data: 'Not found data' });
                }
            } else {
                res.status(200).json({ success: mobileVali.passes(),data: mobileVali.errors.errors}); // Return json with error massage
            }
        } else {
            res.status(200).json({ success: false,data: 'You dont have permission to access'});// Return json with error massage
        }
    } else {
        res.status(200).json({ success: header.passes(),data: header.errors.errors});// Return json with error massage
    }
}
/************************* getTotalUsedByOrganizationId api ends *******************************/

/************************* getUsedVsPendingLicenseByOrganizationId api start *******************************/
exports.getUsedVsPendingLicenseByOrganizationId = async function(req, res, next) {
    const { access_token } = req.headers;
    var header = validation.accessToken(req.headers);
    if(header.passes()===true){
        var accessToken =await sequelize.query("SELECT `id`,`remember_token` FROM `users` WHERE `remember_token`='"+access_token+"'",{ type: Sequelize.QueryTypes.SELECT });
        if(accessToken.length > 0){
            const { organizationId } = req.body;
            var mobileVali = validation.getUsedVsPendingLicenseByOrganizationId(req.body);
            if(mobileVali.passes()===true){                
                var UsedVsPendingLicenseByOrganizationId = await sequelize.query("SELECT `id` AS licenseId, `enterprise_id` AS organizationId, `purchase_license_count` AS PurchaseLicenseCount, `purchase_date` AS PurchaseDate, `total_used_license` AS TotalUsedLicense, `total_purchase_license_count` AS TotalPurchaseLicenseCount, `status` AS Status, `created_at` AS CreatedDate FROM `billing_license` WHERE `enterprise_id`="+organizationId+"",{ type: Sequelize.QueryTypes.SELECT });
                if(UsedVsPendingLicenseByOrganizationId.length > 0){
                    res.status(200).json({ success: true, data: UsedVsPendingLicenseByOrganizationId });
                } else {
                    res.status(200).json({ success: false, data: 'Not found data' });
                }
            } else {
                res.status(200).json({ success: mobileVali.passes(),data: mobileVali.errors.errors}); // Return json with error massage
            }
        } else {
            res.status(200).json({ success: false,data: 'You dont have permission to access'});// Return json with error massage
        }
    } else {
        res.status(200).json({ success: header.passes(),data: header.errors.errors});// Return json with error massage
    }
}
/************************* getUsedVsPendingLicenseByOrganizationId api ends *******************************/