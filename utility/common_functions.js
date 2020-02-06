const formidable = require('formidable');
const glob = require("glob");
const fs = require("fs-extra");
const path = require('path');
const ds = path.sep;

module.exports = {

    /**
     * Create folder
     */
    createDirectory: function(folder_path) {
        var str = __dirname;
        var n = str.lastIndexOf('\\');
        var path = str.substring(0, n+1);

        var dir = path + folder_path; 

        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);                  
        }
    },



    uploadFile: async function(temp_path, target_path) {

        var str = __dirname;
        var n = str.lastIndexOf('\\');
        var path = str.substring(0, n+1);

        var new_location = path + 'public' + ds + 'user_contents' + ds + target_path;
    
        // fs.copy(temp_path, new_location, function(err) {  
        //     if (err) {
        //         return "no";
        //     } else {
        //         //console.log("success!")
        //         return "yes";
        //     }
        // });

        

        var result = await new Promise((resolve, reject) => {
            fs.copy(temp_path, new_location, function(err, res) {  
                //return void err ? reject(err) : resolve("yes")
                if(!err){
                    resolve("yes");
                } else {
                    reject("NO");
                }
            });
        });

        return result;
    },




    /**
     *  Upload file(s) into the public/user_contents directory
     *  Params: 
     *  files - files object, generated from multiparty() while form.parse() called
     *  target_folder - Exact location of the file within the user_contents directory
     */
    uploadFiles: function(files, target_folder) {

        var str = __dirname;
        var n = str.lastIndexOf('\\');
        var path = str.substring(0, n+1);

        base_path = path + 'public' + ds + 'user_contents' + ds;

        for(key in files) {
            var file = files[key];
            if(file[0].originalFilename != '') {
                var file_name = file[0].fieldName;
                var file_ext  = file[0].originalFilename.split('.').pop();
                var temp_path = file[0].path;
                var target_path = base_path + target_folder + file_name + '.' + file_ext;

                fs.copy(temp_path, target_path);
            }    
        }

        // var str = __dirname;
        // var n = str.lastIndexOf('\\');
        // var path = str.substring(0, n+1);

        // var new_location = path + 'public' + ds + 'user_contents' + ds + target_path;
    
       
        // var result = await new Promise((resolve, reject) => {
        //     fs.copy(temp_path, new_location, function(err, res) {  
        //         //return void err ? reject(err) : resolve("yes")
        //         if(!err){
        //             resolve("yes");
        //         } else {
        //             reject("NO");
        //         }
        //     });
        // });

        // return result;
    },









    /**
     *  Upload image(s) and videos into the public/user_contents/{id}/gallery/ directory
     *  Params: 
     *  files - files object, generated from multiparty() while form.parse() called
     *  target_folder - Exact location of the file within the user_contents directory
     */
    uploadFilesToGallery: function(files, vendor_id, folder_name) {

        base_path = this.getBasePath() + 'public' + ds + 'user_contents' + ds + "vendor" + ds + vendor_id + ds + 'gallery/' + folder_name + ds;
        for(key in files) {
            var file_array = files[key];

            file_array.forEach(function (file) {
                if(file.originalFilename != '') {
                    var file_name = file.originalFilename;
                    var file_ext  = file.originalFilename.split('.').pop();
                    var temp_path = file.path;
                    var target_path = base_path + file_name;
    
                    if(file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'png' || file_ext == "mp4") {
                        fs.copy(temp_path, target_path);
                    }
                } 
            });  
        }
    },



    getGalleryFileList: function(vendor_id) {
        const directoryPath = this.getBasePath() + "public" + ds + "user_contents" + ds + "vendor" + ds + vendor_id + ds + "gallery" + ds;
        console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA = " + directoryPath);
        /*fs.readdir(directoryPath, function (err, files) {
            //handling error
            if (err) {
                return console.log('Unable to scan directory: ' + err);
            } 
            //listing all files using forEach
            files.forEach(function (file) {
                // Do whatever you want to do with the file
                console.log("FILE = " + file); 
            });
        });*/
        // var xxxx= [];
        // fs.readdir(directoryPath, function (err, files) {
        //     console.log("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF" + files);
        //     //xxxx =  files;
        //     return files;
        // });

        // var object = {};
        // glob(directoryPath + "*.jpg", function (er, files) {
        //     console.log("BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB " + files);
        //     files.forEach(function (file) {
        //         // Do whatever you want to do with the file
        //         console.log("FILE = " + file); 
        //         object['name'] = file;
        //     });
        // }).then(
        //     console.log("CCCCCCCCCCCCCCCCCCCCCCCCCCCCC " + object);
        // );
        
        return object;

        

        //return "Mitrajit";
    },



    /**
     * This function returns the base path of this js file
     * Returns - E:\Projects\BH\outcry\
     */
    getBasePath: function() {
        var str = __dirname;
        var n = str.lastIndexOf('\\');
        var path = str.substring(0, n+1);
        return path;
    }    

};