var express = require("express");
var app = express();
app.use(express.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE, HEAD"
  );
  next();
});
const port = process.env.PORT || 2410;

const messages = [
  {
    id: 121,
    sent: false,
    from: "tweets@twitter.com",
    to: "jack@test.com",
    subject: "18 tweets from those you follow",
    text: "Go to your twitter page and see the tweets from those you follow.",
    folder: "Social",
  },
  {
    id: 141,
    sent: true,
    from: "jack@test.com",
    to: "mary@test.com",
    subject: "Bug 461 in Customer Flow",
    text: "When the checkbox is left unchecked and the option Important is selected in the dropdown, clicking on Submit, shows no results.",
    folder: "Sent",
  },
  {
    id: 158,
    sent: false,
    from: "email@facebook.com",
    to: "jack@test.com",
    subject: "New post from William Jones",
    text: "William Jones has just uploaded a new post -How i loved the Avengers Endgame.",
    folder: "Social",
  },
  {
    id: 177,
    sent: true,
    from: "jack@test.com",
    to: "williams@test.com",
    subject: "Movie tomorrow",
    text: "Avengers Endgame is releasing tomorrow. Wanna see.",
    folder: "Sent",
  },
  {
    id: 179,
    sent: false,
    from: "williams@test.com",
    to: "jack@test.com",
    subject: "Re: Movie tomorrow",
    text: "The movie is supposed to be a blast. Lets do the 8:30 show. Want to have a quick bite before.",
    folder: "Inbox",
  },
  {
    id: 194,
    sent: false,
    from: "retweet@twitter.com",
    to: "jack@test.com",
    subject: "Your tweet has been retweeted by Thomas",
    text: "Your tweet on the Marvel Superheroes and Avengers has been retweeted bt Thomas. It has now 41 retweets and 27 likes.",
    folder: "Social",
  },
  {
    id: 204,
    sent: true,
    from: "jack@test.com",
    to: "jack@test.com",
    subject: "To do on Friday",
    text: "Test the bugs on the employee form in Release 0.7.9 and fix them.",
    folder: "Work",
  },
  {
    id: 255,
    sent: true,
    from: "mary@test.com",
    to: "jack@test.com",
    subject: "Release 0.8.4 deployed",
    text: "Release 0.8.4 has been deployed in the test environment.",
    folder: "Inbox",
  },
  {
    id: 278,
    sent: false,
    from: "mary@test.com",
    to: "jack@test.com",
    subject: "Re: Bug 461 in Customer Flow",
    text: "The bug has been fixed in the release 0.8.7. \nPlease test the issue and close it.\nCan you do it but tomorrow\nMary",
    folder: "Work",
  },
  {
    id: 281,
    sent: true,
    from: "jack@test.com",
    to: "mary@test.com",
    subject: "Re: Re: Bug 461 in Customer Flow",
    text: "Bug 461 has been closed.\nRegards,\nJack",
    folder: "Sent",
  },
  {
    id: 289,
    sent: false,
    from: "email@facebook.com",
    to: "jack@test.com",
    subject: "5 Shares, 2 Posts from your friends",
    text: "Jack, while you were away, your friends are having fun on Facebook.\nDon't miss their posts.\nKeep up with your friends.",
    folder: "Social",
  },
];


app.get("/messages/:type", function(req,res){
    let type = req.params.type;
    let filterData = messages
    if(type)
    {
        filterData = messages.filter((m) => m.folder === type)
    }
    res.send(filterData)
})
app.get("/messages", function(req, res) {
  const msgQuery = req.query.q;
  let filteredData = messages;

  if (msgQuery) {
    filteredData = messages.filter((msg) =>
      msg.subject.toLowerCase().includes(msgQuery.toLowerCase()) ||
      msg.from.toLowerCase().includes(msgQuery.toLowerCase()) ||
      msg.text.toLowerCase().includes(msgQuery.toLowerCase())
    );
  }

  res.send(filteredData);
});

app.post("/postMsg", function(req,res){
  let body = req.body;
  let maxId = messages.reduce((acc,curr) => curr.id > acc.id ? curr : acc).id
  console.log(maxId)
  let msg = {
    id : maxId + 7,
    sent : true,
    from : "jack@test.com",
    to : body.to,
    subject : body.subject,
    text : body.text,
    folder : "Sent"
  }
  messages.push(msg)
  res.send(msg)
})

app.put("/updateFolder", function(req,res){
  let body = req.body
  let ids = body.msg;
  let folder = body.folder
  console.log(ids)
  console.log(folder)

  for (const id of ids) {
    const message = messages.find((msg) => msg.id === parseInt(id));
    if (message) {
      message.folder = folder;
    }
  }

  res.send({ message: "Folders updated successfully" });
  
})


app.delete("/deleteMsg/:id", function(req,res){
  let id = +req.params.id
  console.log("Id",id)

  let index = messages.findIndex((obj1) => obj1.id === id);
  if (index >= 0) {
    let msg = messages.splice(index, 1);
    res.send(msg);
  } else res.send("not found");
})

app.listen(port, () => console.log(`Node app listening on port ${port}!`));
