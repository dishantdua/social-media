const mongoose = require('mongoose')

mongoose.connect("mongodb+srv://manav_DB:Mnv.jhamb002@cluster0.rt0k6.mongodb.net/test", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

db.on('error', ()=>{
  console.error("Error connecting to db");
})
db.once('open', ()=>{
    console.log("Connected to database")
})

