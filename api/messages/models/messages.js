'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/models.html#lifecycle-hooks)
 * to customize this model
 */

 const Filter = require('bad-words');
 const filter = new Filter();
console.log("fuck!")
module.exports = {
    lifecycles:{
        async beforeCreate(data){
            const filteredMessage = filter.clean(data.message)
            const filteredName = filter.clean(data.name);
            data.name = filteredName;
            data.message =  filteredMessage;
        }
    }
};
