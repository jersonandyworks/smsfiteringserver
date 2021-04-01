'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/models.html#lifecycle-hooks)
 * to customize this model
 */

 const Filter = require('bad-words');
 const filter = new Filter();
console.log("fuck!")
// NOTE: .*(?:(\d)\1{4}) - for number has repititions.
module.exports = {
    lifecycles:{
        async afterCreate(data){
            // const filteredMessage = filter.clean(data.message)
            // const filteredName = filter.clean(data.name);
            // data.name = filteredName;
            // data.message =  filteredMessage;

            console.log("messages created: ", data)
        }
    }
};
