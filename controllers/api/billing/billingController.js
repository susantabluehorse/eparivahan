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

/************************* setPriceByOrganizationId api start *******************************/
exports.setPriceByOrganizationId = async function(req, res, next) {
    const { access_token } = req.headers;
    var header = validation.accessToken(req.headers);
    if(header.passes()===true){
        var accessToken =await sequelize.query("SELECT `id`,`remember_token` FROM `users` WHERE `remember_token`='"+access_token+"'",{ type: Sequelize.QueryTypes.SELECT });
        if(accessToken.length > 0){
            const { organizationId, price } = req.body;
            var mobileVali = validation.setPriceByOrganizationId(req.body);
            if(mobileVali.passes()===true){                
                var setPriceByOrganizationId = await sequelize.query("SELECT `id` FROM `billing_price` WHERE `enterprise_id`="+organizationId+"",{ type: Sequelize.QueryTypes.SELECT });
                if(setPriceByOrganizationId.length <= 0){
                    var PriceIds = await sequelize.query("INSERT INTO `billing_price`(`enterprise_id`, `price`, `status`) VALUES ("+organizationId+",'"+price+"','active')",{ type: Sequelize.QueryTypes.INSERT });
                    if(PriceIds.slice(-1)[0] > 0) {
                        var PriceId = PriceIds.slice(0,1);
                        res.status(200).send({ success: true,"priceId":PriceId[0]}); //Return json with data or empty
                    } else {
                        res.status(200).json({success:false});// Return json with error massage
                    }
                } else {
                    var PriceIdsUpdate = await sequelize.query("UPDATE `billing_price` SET `price`="+price+" WHERE `enterprise_id`="+organizationId+"",{ type: Sequelize.QueryTypes.UPDATE });
                    if(PriceIdsUpdate.slice(-1)[0] > 0) {
                        res.status(200).json({ success:true }); //Return json with data or empty
                    } else {
                        res.status(200).json({success:false});// Return json with error massage
                    }
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
/************************* setPriceByOrganizationId api ends *******************************/

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
                var shipperIdQ = (organizationId!='' && organizationId!=undefined) ? " WHERE `enterprise_id`="+organizationId : "";
                var LicenseDetailsByOrganizationId = await sequelize.query("SELECT `id` AS licenseId, `enterprise_id` AS organizationId, `remaining_license_count` AS RemainingLicenseCount, `total_used_license` AS TotalUsedLicense, `total_purchase_license_count` AS TotalPurchaseLicenseCount, `status` AS Status, `created_at` AS CreatedDate FROM `billing_license`"+shipperIdQ+"",{ type: Sequelize.QueryTypes.SELECT });
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

/************************* getLicenseTotalByOrganizationId api start *******************************/
exports.getLicenseTotalByOrganizationId = async function(req, res, next) {
    const { access_token } = req.headers;
    var header = validation.accessToken(req.headers);
    if(header.passes()===true){
        var accessToken =await sequelize.query("SELECT `id`,`remember_token` FROM `users` WHERE `remember_token`='"+access_token+"'",{ type: Sequelize.QueryTypes.SELECT });
        if(accessToken.length > 0){
            const { organizationId } = req.body;
            var mobileVali = validation.getLicenseDetailsByOrganizationId(req.body);
            if(mobileVali.passes()===true){
                var shipperIdQ = (organizationId!='' && organizationId!=undefined) ? " WHERE `enterprise_id`="+organizationId : "";
                var LicenseDetailsByOrganizationId = await sequelize.query("SELECT SUM(`remaining_license_count`) AS RemainingLicenseCount, SUM(`total_used_license`) AS TotalUsedLicense, SUM(`total_purchase_license_count`) AS TotalPurchaseLicenseCount FROM `billing_license`"+shipperIdQ+"",{ type: Sequelize.QueryTypes.SELECT });
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
/************************* getLicenseTotalByOrganizationId api ends *******************************/

/************************* setLicenseDetailsByOrganizationId api start *******************************/
exports.setLicenseDetailsByOrganizationId = async function(req, res, next) {
    const { access_token } = req.headers;
    var header = validation.accessToken(req.headers);
    if(header.passes()===true){
        var accessToken =await sequelize.query("SELECT `id`,`remember_token` FROM `users` WHERE `remember_token`='"+access_token+"'",{ type: Sequelize.QueryTypes.SELECT });
        if(accessToken.length > 0){
            const { organizationId, PurchaseLicenseCount, PurchaseDate, TotalUsedLicense, TotalPurchaseLicenseCount } = req.body;
            var mobileVali = validation.setLicenseDetailsByOrganizationId(req.body);
            if(mobileVali.passes()===true){
                var setLicenseDetailsByOrganizationId = await sequelize.query("SELECT `id` FROM `billing_license` WHERE `enterprise_id`="+organizationId+"",{ type: Sequelize.QueryTypes.SELECT });
                if(setLicenseDetailsByOrganizationId.length <= 0){
                    var LicenseIds = await sequelize.query("INSERT INTO `billing_license`(`enterprise_id`, `purchase_license_count`, `purchase_date`, `total_used_license`, `total_purchase_license_count`, `status`) VALUES ("+organizationId+","+PurchaseLicenseCount+",'"+PurchaseDate+"',"+TotalUsedLicense+","+TotalPurchaseLicenseCount+",'active')",{ type: Sequelize.QueryTypes.INSERT });
                    if(LicenseIds.slice(-1)[0] > 0) {
                        var LicenseId = LicenseIds.slice(0,1);
                        res.status(200).send({ success: true,"licenseId":LicenseId[0]}); //Return json with data or empty
                    } else {
                        res.status(200).json({success:false});// Return json with error massage
                    }
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
/************************* setLicenseDetailsByOrganizationId api ends *******************************/

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
                var PaynemtHistoryByOrganizationId = await sequelize.query("SELECT `bl`.`id` AS billingId,`b`.`license_id` AS licenseId, `bl`.`enterprise_id` AS organizationId, `b`.`date` AS BillingDate, `b`.`amount` AS BIllingAmount, `b`.`mode` AS BillingMode, `b`.`license_count` AS BillingLicenseCount, `b`.`enterprise_cheque_number` AS OrganizationChequeNumber, `b`.`enterprise_bank_name` AS OrganizationBankName, `b`.`enterprise_bank_branch` AS OrganizationBankBranch, `b`.`enterprise_account_number` AS OrganizationAccountNumber, `b`.`enterprise_purchase_rate` AS PurchaseRate, `bl`.`remaining_license_count` AS RemainingLicenseCount, `bl`.`total_used_license` AS TotalUsedLicense, `bl`.`total_purchase_license_count` AS TotalPurchaseLicenseCount, `b`.`status` AS Status, `b`.`created_at` AS CreatedDate FROM `billing` AS b LEFT JOIN `billing_license` AS bl ON `bl`.`id`=`b`.`license_id` WHERE `b`.`enterprise_id`="+organizationId+"",{ type: Sequelize.QueryTypes.SELECT });
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
            const { billingId } = req.body;
            var mobileVali = validation.getPaynemtHistoryByBillingId(req.body);
            if(mobileVali.passes()===true){                
                var PaynemtHistoryByBillingId = await sequelize.query("SELECT `bl`.`id` AS billingId,`b`.`license_id` AS licenseId, `bl`.`enterprise_id` AS organizationId, `b`.`date` AS BillingDate, `b`.`amount` AS BIllingAmount, `b`.`mode` AS BillingMode, `b`.`license_count` AS BillingLicenseCount, `b`.`enterprise_cheque_number` AS OrganizationChequeNumber, `b`.`enterprise_bank_name` AS OrganizationBankName, `b`.`enterprise_bank_branch` AS OrganizationBankBranch, `b`.`enterprise_account_number` AS OrganizationAccountNumber, `b`.`enterprise_purchase_rate` AS PurchaseRate, `bl`.`remaining_license_count` AS RemainingLicenseCount, `bl`.`total_used_license` AS TotalUsedLicense, `bl`.`total_purchase_license_count` AS TotalPurchaseLicenseCount, `b`.`status` AS Status, `b`.`created_at` AS CreatedDate FROM `billing` AS b LEFT JOIN `billing_license` AS bl ON `bl`.`id`=`b`.`license_id` WHERE `b`.`id`="+billingId+"",{ type: Sequelize.QueryTypes.SELECT });
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
            const { organizationId, BillingLicenseCount, BIllingAmount, BillingMode, OrganizationChequeNumber, OrganizationBankName, OrganizationBankBranch, OrganizationAccountNumber, PurchaseRate } = req.body;
            var mobileVali = validation.purchaseLicenseByOrganizationId(req.body);
            if(mobileVali.passes()===true){
                var dateTime = new Date();
                var currentDate = dateTime.getFullYear()+'-'+dateTime.getMonth()+'-'+dateTime.getDate()+' '+dateTime.getHours()+':'+dateTime.getMinutes()+':'+dateTime.getSeconds();
                var BillingLicense = await sequelize.query("SELECT `id`, total_used_license, total_purchase_license_count FROM `billing_license` WHERE `enterprise_id`="+organizationId+"",{ type: Sequelize.QueryTypes.SELECT });
                if(BillingLicense.length > 0){
                    var crateBilling = await sequelize.query("INSERT INTO `billing`(`enterprise_id`, `license_id`, `mode`, `amount`, `date`, `license_count`, `enterprise_cheque_number`, `enterprise_bank_name`, `enterprise_bank_branch`, `enterprise_account_number`, `enterprise_purchase_rate`, `status`) VALUES ("+organizationId+","+BillingLicense[0].id+",'"+BillingMode+"','"+BIllingAmount+"', '"+currentDate+"', "+BillingLicenseCount+",'"+OrganizationChequeNumber+"','"+OrganizationBankName+"','"+OrganizationBankBranch+"','"+OrganizationAccountNumber+"','"+PurchaseRate+"','active')",{ type: Sequelize.QueryTypes.INSERT });
                    if(crateBilling.slice(-1)[0] > 0) {
                        var TotalPurchaseLicenseCount = (BillingLicense[0].total_purchase_license_count + BillingLicenseCount);
                        var RemainingLicenseCount = (TotalPurchaseLicenseCount - BillingLicense[0].total_used_license);
                        var BillingLicenseUpdate = await sequelize.query("UPDATE `billing_license` SET `remaining_license_count`="+RemainingLicenseCount+", `total_purchase_license_count`="+TotalPurchaseLicenseCount+" WHERE `id`="+BillingLicense[0].id+"",{ type: Sequelize.QueryTypes.UPDATE });
                        var billingId = crateBilling.slice(0,1);
                        res.status(200).send({ success: true,"billingId":billingId[0]}); //Return json with data or empty
                    } else {
                        res.status(200).json({success:false});// Return json with error massage
                    }
                } else {
                    var BillingLicenseInsert = await sequelize.query("INSERT INTO `billing_license`(`enterprise_id`, `remaining_license_count`, `total_used_license`, `total_purchase_license_count`, `status`) VALUES ("+organizationId+",0,0,0,'active')",{ type: Sequelize.QueryTypes.INSERT });
                    if(BillingLicenseInsert.slice(-1)[0] > 0) {
                        var lienceId = BillingLicenseInsert.slice(0,1);
                        var crateBilling = await sequelize.query("INSERT INTO `billing`(`enterprise_id`, `license_id`, `mode`, `amount`, `date`, `license_count`, `enterprise_cheque_number`, `enterprise_bank_name`, `enterprise_bank_branch`, `enterprise_account_number`, `enterprise_purchase_rate`, `status`) VALUES ("+organizationId+","+lienceId[0]+",'"+BillingMode+"','"+BIllingAmount+"', '"+currentDate+"', "+BillingLicenseCount+",'"+OrganizationChequeNumber+"','"+OrganizationBankName+"','"+OrganizationBankBranch+"','"+OrganizationAccountNumber+"','"+PurchaseRate+"','active')",{ type: Sequelize.QueryTypes.INSERT });
                        if(crateBilling.slice(-1)[0] > 0) {
                            var TotalPurchaseLicenseCount = BillingLicenseCount;
                            var RemainingLicenseCount = TotalPurchaseLicenseCount;
                            var BillingLicenseUpdate = await sequelize.query("UPDATE `billing_license` SET `remaining_license_count`="+RemainingLicenseCount+", `total_purchase_license_count`="+TotalPurchaseLicenseCount+" WHERE `id`="+lienceId[0]+"",{ type: Sequelize.QueryTypes.UPDATE });
                            var billingId = crateBilling.slice(0,1);
                            res.status(200).send({ success: true,"billingId":billingId[0]}); //Return json with data or empty
                        } else {
                            res.status(200).json({success:false});// Return json with error massage
                        }
                    } else {
                        res.status(200).json({success:false});// Return json with error massage
                    }
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
                var PurchaseLicenseByOrganizationsId = await sequelize.query("SELECT `bl`.`id` AS billingId,`b`.`license_id` AS licenseId, `bl`.`enterprise_id` AS organizationId, `b`.`date` AS BillingDate, `b`.`amount` AS BIllingAmount, `b`.`mode` AS BillingMode, `b`.`license_count` AS BillingLicenseCount, `b`.`enterprise_cheque_number` AS OrganizationChequeNumber, `b`.`enterprise_bank_name` AS OrganizationBankName, `b`.`enterprise_bank_branch` AS OrganizationBankBranch, `b`.`enterprise_account_number` AS OrganizationAccountNumber, `b`.`enterprise_purchase_rate` AS PurchaseRate, `bl`.`remaining_license_count` AS RemainingLicenseCount, `bl`.`total_used_license` AS TotalUsedLicense, `bl`.`total_purchase_license_count` AS TotalPurchaseLicenseCount, `b`.`status` AS Status, `b`.`created_at` AS CreatedDate FROM `billing` AS b LEFT JOIN `billing_license` AS bl ON `bl`.`id`=`b`.`license_id` WHERE `b`.`enterprise_id`="+organizationId+"",{ type: Sequelize.QueryTypes.SELECT });
                if(PurchaseLicenseByOrganizationsId.length > 0){
                    res.status(200).json({ success: true, data: PurchaseLicenseByOrganizationsId });
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
/************************* purchaseLicenseByOrganizationsId api ends *******************************/

/************************* getAllPaymentByOrganizationIdAndMode api start *******************************/
exports.getAllPaymentByOrganizationIdAndMode = async function(req, res, next) {
    const { access_token } = req.headers;
    var header = validation.accessToken(req.headers);
    if(header.passes()===true){
        var accessToken =await sequelize.query("SELECT `id`,`remember_token` FROM `users` WHERE `remember_token`='"+access_token+"'",{ type: Sequelize.QueryTypes.SELECT });
        if(accessToken.length > 0){
            const { organizationId, BillingMode } = req.body;
            var mobileVali = validation.getAllPaymentByOrganizationIdAndMode(req.body);
            if(mobileVali.passes()===true){                
                var AllPaymentByOrganizationIdAndMode = await sequelize.query("SELECT `bl`.`id` AS billingId,`b`.`license_id` AS licenseId, `bl`.`enterprise_id` AS organizationId, `b`.`date` AS BillingDate, `b`.`amount` AS BIllingAmount, `b`.`mode` AS BillingMode, `b`.`license_count` AS BillingLicenseCount, `b`.`enterprise_cheque_number` AS OrganizationChequeNumber, `b`.`enterprise_bank_name` AS OrganizationBankName, `b`.`enterprise_bank_branch` AS OrganizationBankBranch, `b`.`enterprise_account_number` AS OrganizationAccountNumber, `b`.`enterprise_purchase_rate` AS PurchaseRate, `bl`.`remaining_license_count` AS RemainingLicenseCount, `bl`.`total_used_license` AS TotalUsedLicense, `bl`.`total_purchase_license_count` AS TotalPurchaseLicenseCount, `b`.`status` AS Status, `b`.`created_at` AS CreatedDate FROM `billing` AS b LEFT JOIN `billing_license` AS bl ON `bl`.`id`=`b`.`license_id` WHERE `b`.`enterprise_id` WHERE `b`.`enterprise_id`="+organizationId+" AND `b`.`mode`='"+mode+"'",{ type: Sequelize.QueryTypes.SELECT });
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
                var TotalPurchaseByOrganizationId = await sequelize.query("SELECT `id` AS licenseId, `enterprise_id` AS organizationId, `total_purchase_license_count` AS TotalPurchaseLicenseCount FROM `billing_license` WHERE `enterprise_id`="+organizationId+"",{ type: Sequelize.QueryTypes.SELECT });
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
                var TotalUsedByOrganizationId = await sequelize.query("SELECT `id` AS licenseId, `enterprise_id` AS organizationId, `total_used_license` AS TotalUsedLicense FROM `billing_license` WHERE `enterprise_id`="+organizationId+"",{ type: Sequelize.QueryTypes.SELECT });
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
                var UsedVsPendingLicenseByOrganizationId = await sequelize.query("SELECT `id` AS licenseId, `enterprise_id` AS organizationId, `remaining_license_count` AS RemainingLicenseCount FROM `billing_license` WHERE `enterprise_id`="+organizationId+"",{ type: Sequelize.QueryTypes.SELECT });
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