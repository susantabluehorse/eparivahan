var models = require('../../../models');
var jwt = require('jsonwebtoken');
var SECRET = 'nodescratch';
var fs = require('file-system');
var bcrypt = require('bcrypt-nodejs');
var config = require('../../../config/config.json');
var Sequelize = require("sequelize");
var sequelize = new Sequelize(
    config.development.database, 
    config.development.username,
    config.development.password, {
        host: 'localhost',
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

/*************************TrackingCount / TrackingSnapshot start *******************************/
exports.getTrackingCount = async function(req, res, next) {
    console.log(req.body);
    var userId = req.body.userId;
    var role = req.body.role;
    var fromDate = req.body.fromDate;
    var toDate = req.body.toDate;
    if(userId !='' && role !='' && fromDate !='' && toDate !=''){
       // var blockList =await sequelize.query("SELECT * FROM block_list limit 1",{ type: Sequelize.QueryTypes.SELECT });

        models.block_list.create({
                
                blocked_by_enterprise_id : 1,
                blocked_enterprise_id : 2,
                blocked_status : 0,
                blocked_by : 33,
                created_at: '2020-02-07 08:38:20',
                updated_at: '2020-02-07 08:38:20'
                
            });

        res.status(200).json({ success: "false",message: "All fileds are required!"});
    }else{
        res.status(200).json({ success: "false",message: "All fileds are required!"});
    }   
}
/*************************TrackingCount / TrackingSnapshot ends *******************************/

/*************************Tracking History start *******************************/
exports.getTrackingHistory = async function(req, res, next) {
    var username = req.body.data.username;
    var password = req.body.data.password;
   //var hash = bcrypt.hashSync(password);

    //var candidate =await sequelize.query("SELECT candidates.*, candidate_looking_for.category from candidates LEFT JOIN candidate_looking_for ON candidates.candidate_id = candidate_looking_for.candidate_id where candidates.username ='"+username+"'",{ type: Sequelize.QueryTypes.SELECT });
    var candidate =await sequelize.query("SELECT candidates.*, candidate_looking_for.category, categories.title as category_title from candidates LEFT JOIN candidate_looking_for ON candidates.candidate_id = candidate_looking_for.candidate_id LEFT JOIN categories ON candidate_looking_for.category = categories.category_id where candidates.username ='"+username+"'",{ type: Sequelize.QueryTypes.SELECT });

    //models.candidates.findOne({ where: {username :username} }).then(function(candidate) {
    if(candidate.length > 0){
        if(!bcrypt.compareSync(password, candidate[0].password)){
            res.status(200).send({ success: "false", message: "Invalid username and password!" });
        }else{
            var token =    jwt.sign({candidate}, SECRET, { expiresIn: 18000 });
            res.status(200).send({ success: "true", message:"successfully login", candidatedetail:candidate[0], token: token }); 
        }
        
    }else{				
        res.status(200).send({ success: "false", message: "Invalid username and password!" });
    }  
}
/*************************Tracking History ends *******************************/

/************************* Tracking Analysis start *******************************/
exports.getTrackingAnalysis = async function(req, res, next) {

    var category_list = await sequelize.query("SELECT categories.category_id, categories.title, (SELECT COUNT(*) FROM candidate_looking_for WHERE categories.category_id=candidate_looking_for.category) as candidate_count_by_category FROM categories where categories.status='active' order by categories.title ASC",{ type: Sequelize.QueryTypes.SELECT });
    var location_list = await sequelize.query("SELECT COUNT(*) as candidate_count_by_location, location as candidate_location FROM candidate_looking_for GROUP BY location",{ type: Sequelize.QueryTypes.SELECT });
    
    //if(category_list){
        res.status(200).send({ success: true, category_list: category_list, location_list: location_list});
    // }else{
    //     res.status(200).send({ message: "No category found" });
    // }    
}
/************************* Tracking Analysis ends *******************************/

/************************* Create tracking start *******************************/
exports.getTrackingAdd = async function(req, res, next) {

    var category_list = await sequelize.query("SELECT categories.category_id, categories.title, (SELECT COUNT(*) FROM candidate_looking_for WHERE categories.category_id=candidate_looking_for.category) as candidate_count_by_category FROM categories where categories.status='active' order by categories.title ASC",{ type: Sequelize.QueryTypes.SELECT });
    var location_list = await sequelize.query("SELECT COUNT(*) as candidate_count_by_location, location as candidate_location FROM candidate_looking_for GROUP BY location",{ type: Sequelize.QueryTypes.SELECT });
    
    //if(category_list){
        res.status(200).send({ success: true, category_list: category_list, location_list: location_list});
    // }else{
    //     res.status(200).send({ message: "No category found" });
    // }    
}
/************************* Create tracking ends *******************************/

/************************* search organization start *******************************/
exports.getOrganizationSearch = async function(req, res, next) {

    var category_list = await sequelize.query("SELECT categories.category_id, categories.title, (SELECT COUNT(*) FROM candidate_looking_for WHERE categories.category_id=candidate_looking_for.category) as candidate_count_by_category FROM categories where categories.status='active' order by categories.title ASC",{ type: Sequelize.QueryTypes.SELECT });
    var location_list = await sequelize.query("SELECT COUNT(*) as candidate_count_by_location, location as candidate_location FROM candidate_looking_for GROUP BY location",{ type: Sequelize.QueryTypes.SELECT });
    
    //if(category_list){
        res.status(200).send({ success: true, category_list: category_list, location_list: location_list});
    // }else{
    //     res.status(200).send({ message: "No category found" });
    // }    
}
/************************* search organization ends *******************************/

/************************* search tracking start *******************************/
exports.getTrackingSearch = async function(req, res, next) {

    var category_list = await sequelize.query("SELECT categories.category_id, categories.title, (SELECT COUNT(*) FROM candidate_looking_for WHERE categories.category_id=candidate_looking_for.category) as candidate_count_by_category FROM categories where categories.status='active' order by categories.title ASC",{ type: Sequelize.QueryTypes.SELECT });
    var location_list = await sequelize.query("SELECT COUNT(*) as candidate_count_by_location, location as candidate_location FROM candidate_looking_for GROUP BY location",{ type: Sequelize.QueryTypes.SELECT });
    
    //if(category_list){
        res.status(200).send({ success: true, category_list: category_list, location_list: location_list});
    // }else{
    //     res.status(200).send({ message: "No category found" });
    // }    
}
/************************* search tracking ends *******************************/

/************************* active Inactive Shipper start *******************************/
exports.getActiveInactiveShipper = async function(req, res, next) {

    var category_list = await sequelize.query("SELECT categories.category_id, categories.title, (SELECT COUNT(*) FROM candidate_looking_for WHERE categories.category_id=candidate_looking_for.category) as candidate_count_by_category FROM categories where categories.status='active' order by categories.title ASC",{ type: Sequelize.QueryTypes.SELECT });
    var location_list = await sequelize.query("SELECT COUNT(*) as candidate_count_by_location, location as candidate_location FROM candidate_looking_for GROUP BY location",{ type: Sequelize.QueryTypes.SELECT });
    
    //if(category_list){
        res.status(200).send({ success: true, category_list: category_list, location_list: location_list});
    // }else{
    //     res.status(200).send({ message: "No category found" });
    // }    
}
/************************* active Inactive Shipper ends *******************************/