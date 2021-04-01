"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/models.html#lifecycle-hooks)
 * to customize this model
 */
const readXlsxFile = require("read-excel-file/node");
const fs = require("fs");
const path = require("path");
global.appRoot = path.resolve("./public/");
const Filter = require("bad-words");
const filter = new Filter();

const spamCheck = require("spam-check");

module.exports = {
  lifecycles: {
    async beforeCreate(data) {},

    async afterCreate(data) {
      console.log("data: ", data);

      const excelFilePath = appRoot + data.spreadsheet[0].url;
      await readXlsxFile(fs.createReadStream(excelFilePath)).then(
        async (rows) => {
          const messages = [];
          for (let i = 0; i < rows.length; i++) {
            const name = rows[i][0];
            const intials = rows[i][1];
            const contact = rows[i][2];
            const link = rows[i][3];
            const filteredMessage = filter.clean(name);
            const filteredName = filter.clean(name);

            console.log("filteredName: ", filteredName);

            const expressionNumber = `^[0-9]*$`;
            const reNumber = new RegExp(expressionNumber, "u");

            const expressOnlyAlphabets = `[a-zA-Z]`;
            const reAlphabets = new RegExp(expressOnlyAlphabets, "g");

            if (reNumber.test(contact) && reAlphabets.test(name)) {
              const expression = `.*(?:(\\d)\\1{4})`;
              const re = new RegExp(expression, "g");
              const filteredContact = re.test(contact); //No repeating numbers

              const expressionAsterisk = `.*(?:(\\*)\\1{3})`;
              const reAsterisk = new RegExp(expressionAsterisk, "g");

              const expressionRepeat = `(^|.*\\])(([\\p{L}\\p{M}\\p{N}]+[\\p{Pd}\\p{Pc}\\p{Po}]*)+)(\\[.*|$)`;

              const reRepeat = new RegExp(expressionRepeat, "u");

              // && !reAsterisk.test(filteredName) && ! reRepeat.test(name)
              if (!filteredContact) {
                if (reAsterisk.test(filteredName) === false) {
                  console.log(
                    "reRepeat.test(filteredName): ",
                    reRepeat.test(filteredName)
                  );

                  if (reRepeat.test(filteredName) === true) {
                    console.log("reRepeat.test(filteredName)");
                    console.log(
                      "reAsterisk: " +
                        filteredName +
                        " " +
                        reAsterisk.test(filteredName)
                    );
                    console.log(
                      "reRepeat: " +
                        filteredName +
                        " " +
                        reRepeat.test(filteredName)
                    );
                    const isMessageExists = await strapi
                      .query("messages")
                      .findOne({ contact_number: contact });

                    if (!isMessageExists) {
                      //CREATE AN ENTRY FOR MESSAGES
                      const messageCreated = await strapi
                        .query("messages")
                        .create({
                          name: filteredName + " " + intials,
                          message: "test",
                          contact_number: contact,
                          created_at: data.createdAt,
                          upload: data.id,
                        });

                         messages.push(messageCreated);
                    }
                  }
                }
              } //end check if all are good
            } //end if test contact
            console.log(
              "-------------------------------------------------------------------------"
            );
          } //end loop

          console.log("messuplages id: ", messages);

       
          // data.messages = messages;
          // await strapi.query("uploads").update(data.id,{
          //   messages: messages
          // })
        }
      );
    },

    async afterUpdate(data) {

    },
  },
};
