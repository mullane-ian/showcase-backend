const fs = require("fs");
const express = require("express");
const app = express();
var cors = require("cors");
app.use(express.json());
app.use(
  cors({
    origin: "*",
    credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 200,
  })
);

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const getdata = async () => {
  try {
    const datae = await fetch(
      "https://testnets-api.opensea.io/assets?asset_contract_address=0x00529bf7DC6d4E831272632b3db5723406cb68E3&order_direction=asc",
      {
        method: "GET",
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
    const data = await datae.json();
    console.log(data);
    return data;
  } catch (err) {
    return err;
  }
};

app.get("/", async (req, res) => {
  const mainreturn = await getdata();
  console.log("user hit the resource");

  res.status(200).json(mainreturn);
});
let mesh = [];

// fs.readFile("./count.txt", "utf8", function (err, data) {
//   let array = JSON.parse("[" + data + "]");
//   res.send(array);
// });
// fs.writeFile("count.txt", req.body.data.toString(), (err) => {
//   if (err) console.log(err);
// });
app.post("/meshitemclicked", (req, res) => {
  console.log("post called");
  fs.writeFile("count.txt", req.body.data.toString(), (err) => {
    if (err) {
      console.log(err);
    } else {
      res.send("written");
    }
  });
});
app.get("/meshitemclicked", (req, res) => {
  fs.readFile("./count.txt", "utf8", function (err, data) {
    let array = JSON.parse("[" + data + "]");
    console.log("get called");
    res.send(array);
  });
});

const port = process.env.PORT || 30002;
app.listen(port, console.log("listening on " + port));
