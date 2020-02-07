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

/*************************candidate sign-up start *******************************/

exports.candidate_registration = async function(req, res, next) {

    console.log(req.body.data);
    
    var password = req.body.data.password;
    var hash = bcrypt.hashSync(password);
    var first_name = req.body.data.first_name;
    var last_name = req.body.data.last_name;
    var email = req.body.data.email;
    var mob_country_code = req.body.data.mob_country_code;
    var mobile = req.body.data.mobile;
    var terms = req.body.data.terms;
    var category_id = req.body.data.category_id;

    
    if(first_name !='' && last_name !='' && email !='' && mobile !='' && password !='' && mob_country_code !='' && category_id !=''){

        var check_email =await sequelize.query("SELECT * FROM candidates  WHERE username='"+email+"' limit 1",{ type: Sequelize.QueryTypes.SELECT });
        var check_mobile =await sequelize.query("SELECT * FROM candidates  WHERE mobile='"+mobile+"' limit 1",{ type: Sequelize.QueryTypes.SELECT });

        var email_msg='';
        var mobile_msg='';
        if(check_email.length>0){
            email_msg= "Email ID already exists!";
        }if (check_mobile.length>0){
            mobile_msg= "Mobile number already exists!";
        }

        if(check_email.length==0 && check_mobile.length==0){
            console.log('111111111111111111111111111');

            models.candidates.create({
                
                first_name : first_name,
                last_name : last_name,
                email : email,
                username : email,
                mob_country_code : mob_country_code,
                mobile : mobile,
                password : hash,
                type : "candidate", 
                terms : terms      
                
            }).then(async function(candidate) { 

                if(candidate){
                    console.log('222222222222222222222222');
                    models.candidate_looking_for.create({
                        candidate_id: candidate.candidate_id,
                        category : category_id,
                    }).then(async function(candidate_looking_for){
            
                        var dir = './public/contents/candidates/'+candidate.candidate_id; 
                        console.log(dir);
                        if (!fs.existsSync(dir)){
                            fs.mkdirSync(dir);                  
                        }

                        var candidate_full_data =await sequelize.query("SELECT candidates.*, candidate_looking_for.category, categories.title as category_title from candidates LEFT JOIN candidate_looking_for ON candidates.candidate_id = candidate_looking_for.candidate_id LEFT JOIN categories ON candidate_looking_for.category = categories.category_id where candidates.candidate_id ="+candidate.candidate_id,{ type: Sequelize.QueryTypes.SELECT });

                        var token = jwt.sign({candidate}, SECRET, { expiresIn: 18000 });
                        res.status(200).send({ success: "true", message: "User successfully registered. You can login now.", details:candidate_full_data[0], token:token  });         
                    });
                }else{
                    res.status(200).json({ success: "false",message: "Registration failed!"});
                }

                // var dir = './public/contents/candidates/'+candidate.candidate_id; 
                // console.log(dir);
                // if (!fs.existsSync(dir)){
                //     fs.mkdirSync(dir);                  
                // }
                // var token = jwt.sign({candidate}, SECRET, { expiresIn: 18000 });

                
                // res.status(200).send({ success: "true", message: "User successfully registered. You can login now.",token:token, details:candidate  });         
            })
        }else{
            res.status(200).json({ success: "false", message: "Email or mobile already already exists!" });
        }
    }else{
        res.status(200).json({ success: "false",message: "All fileds are required!"});
    }  
}

/*************************candidate sign-up ends *******************************/

/*************************candidate sign-in start *******************************/

exports.candidate_signin = async function(req, res, next) {

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

/*************************candidate sign-in ends *******************************/

/************************* candidate category list api start *******************************/

exports.candidate_category_list = async function(req, res, next) {

    var category_list = await sequelize.query("SELECT categories.category_id, categories.title, (SELECT COUNT(*) FROM candidate_looking_for WHERE categories.category_id=candidate_looking_for.category) as candidate_count_by_category FROM categories where categories.status='active' order by categories.title ASC",{ type: Sequelize.QueryTypes.SELECT });
    var location_list = await sequelize.query("SELECT COUNT(*) as candidate_count_by_location, location as candidate_location FROM candidate_looking_for GROUP BY location",{ type: Sequelize.QueryTypes.SELECT });
    
    //if(category_list){
        res.status(200).send({ success: true, category_list: category_list, location_list: location_list});
    // }else{
    //     res.status(200).send({ message: "No category found" });
    // }
    
}

/************************* candidate category list api ends *******************************/


