const mongoose = require("mongoose");
const Collab = require("../models/unicollab");

mongoose.connect("mongodb://localhost:27017/uni-collab");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error:"));
db.on("open", () => {
  console.log("Database Connected");
});

const seedDB = async () => {
  //await Collab.deleteMany({});
  const project = new Collab({
    image: "../images/hackathon.png",
    title: "EVENTYR Hackathon",
    skills: "Front End Development",
    description:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eum corrupti commodi odio reprehenderit officiis mollitia, amet obcaecati eligendi officia ullam debitis aperiam facere cumque deserunt, ex voluptatem? Maiores, culpa aut?",
    author: "6624a613eeaeb64842d24d72",
  });
  await project.save();
};

//Closing the connection
seedDB().then(() => {
  db.close();
});
