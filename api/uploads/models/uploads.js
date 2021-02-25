'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/models.html#lifecycle-hooks)
 * to customize this model
 */
const readXlsxFile = require('read-excel-file/node');
const fs = require("fs");
const  path = require('path');
global.appRoot = path.resolve("./public/");

module.exports = {
    lifecycles:{
        async beforeCreate(data){
            console.log("uploads data: ", data);
            console.log("root: ", appRoot + data.spreadsheet[0].url);
            const excelFileName = data.spreadsheet[0].name;
            const excelFilePath = appRoot + data.spreadsheet[0].url;
            await readXlsxFile(fs.createReadStream(excelFilePath)).then((rows) => {
               console.log(rows);
              })
        }
    }
};
