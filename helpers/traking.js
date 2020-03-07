const formidable = require('formidable');
const glob = require("glob");
const fs = require("fs-extra");
var fsFile = require('file-system');
const path = require('path');
const readXlsxFile = require('read-excel-file/node');
const ds = path.sep;
module.exports = {
    /*** upload Xlsx ***/
    uploadXlsx: function(file) {
        let date_ob = new Date();let date = ("0" + date_ob.getDate()).slice(-2);let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);let year = date_ob.getFullYear();let hours = date_ob.getHours();let minutes = date_ob.getMinutes();let seconds = date_ob.getSeconds();
        let fileName = 'bulkFile_'+year+month+date+hours+minutes+seconds+'.xlsx';
        const pathN = './public/traking/'+fileName;
        const base64Data = file.replace(/^data:([A-Za-z-+/]+);base64,/, '');
        fs.writeFileSync(pathN, base64Data,  {encoding: 'base64'});
        return fileName;
    },
    /*** get file ***/
    getFile: function(file) {
        let filePath = path.join(__dirname, '../', 'public/traking', file);
        return filePath;
    },
    /*** get data ***/
    getData: async function(filePath) {
        let near = [];
        readXlsxFile(filePath).then((rows) => {
            var newExcelArray = []; // new array
            let arrkey = rows[0]; // get key
            let rows1 = {}; // get key
            delete rows[0];// delete 0 position
            rows.forEach(function(k,p){
                let newArray = {};
                for(var j = 0; j < k.length; j++){
                    newArray[arrkey[j]]=k[j];
                }
                newExcelArray.push(newArray);
            });
            //console.log(newExcelArray);
            return JSON.stringify(newExcelArray);
        });
    },    
    /*** delete File ***/
    deleteFile: function(filePath) {
        fsFile.unlink(filePath, (err) => {
            if(err) {
                return 0;
            } else {
                return 1;
            }
        });        
    },
};