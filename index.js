const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  "postgres://postgres:secret@localhost:5432/postgres",
  { logging: false }
);

const Message = sequelize.define("new_message", {
  body: Sequelize.TEXT,
  line_count: Sequelize.INTEGER
});

sequelize
  .sync() // Calling sync creates the table if it does not already exist
  // Message.create() inserts a new row
  .then(() =>
    Message.create({
      body: `This message was created at ${new Date()}`,
      line_count: "1"
    })
  )
  // Message.findAll() selects all rows, and resolves with an array of objects:
  .then(() => Message.findAll())
  // Log the raw "dataValues" to the console.
  .then(messagesArray =>
    console.log("All messages: ", messagesArray.map(m => m.dataValues))
  )
  .catch(err => console.error(err));
