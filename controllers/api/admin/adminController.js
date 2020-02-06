var models = require('../../../models');
var jwt = require('jsonwebtoken');
var SECRET = 'nodescratch';
var fs = require('file-system');
var bcrypt = require('bcrypt-nodejs');
var config = require('../../../config/config.json');
const emailConfig = require('../../../config/email-config')();
const mailgun = require('mailgun-js')(emailConfig);
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


/*************************admin sign-in start *******************************/

exports.admin_signin_222 = function(req, res, next) {

    var username = req.body.data.username;
    var password = req.body.data.password;

    if(username !='' && password !=''){
        models.admins.findOne({ where: {username :username} }).then(function(admin) {
            if(admin!=null){
                adm = admin.toJSON();	   
                if(!bcrypt.compareSync(password, adm.password)) {		   
                    res.status(200).send({ message: "No user found" });
                } else {	  
                    if (username == admin.username) {              
                        var token =    jwt.sign({admin}, SECRET, { expiresIn: 18000 });  
                        res.status(200).send({ success: "true", message:"successfully login", token :token, admin_id:admin.admin_id,user_name:admin.username,mobile: admin.mobile });
                    }else{				
                        res.status(200).send({ message: "No user found" });
                    }            
                }//password check end                 
            }else{                
                res.status(200).send({ message: "No user found" });
            }    
        })
        .catch(function(error) {
            return res.send(error);        
        }); 
    }else{
        res.status(200).send({ message: "All fields are required!" });
    }
}
/*************************admin sign-in ends *******************************/


/*************************admin sign-in start *******************************/

exports.admin_signin = async function(req, res, next) {

    var username = req.body.data.username;
    var password = req.body.data.password;
   
    if(username && username !='' && password && password !=''){

    var admin_user =await sequelize.query("SELECT admins.* from admins where admins.username ='"+username+"'",{ type: Sequelize.QueryTypes.SELECT });

        if(admin_user.length > 0){
            if(!bcrypt.compareSync(password, admin_user[0].password)){
                res.status(200).send({ success: "false", message: "Invalid username and password!" });
            }else{
                var token =    jwt.sign({admin_user}, SECRET, { expiresIn: 18000 });
                res.status(200).send({ success: "true", message:"successfully login", admindetail:admin_user[0], token: token }); 
            }
            
        }else{				
            res.status(200).send({ success: "false", message: "Invalid username and password!" });
        }
    }else{				
         res.status(200).json({ success: "false", message: "Username and password is required!"});
    }

}

/*************************admin sign-in ends *******************************/





