// require("./db")();
const mongoose = require("mongoose");
const express = require("express");
const app = express();
let cors = require("cors");
app.use(express.json());
app.use(
  cors({
    origin: "*",
    credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 200,
  })
);
const db = process.env.DB;
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log(`connected to mongoDB`))
  .catch((err) => console.log("error connecting to mongoDB", err));

const schema = new mongoose.Schema(
  {
    clicks: {
      type: String,
      required: true,
    },
  }
  // ,{ timestamps: true, }
);
const Click = mongoose.model("Click", schema);

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

let newClicks =
  "0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0";

app.post("/meshitemclicked", async (req, res) => {
  Click.findOneAndUpdate({ clicks: req.body.data.toString() })
    .then((data) => res.send(data))
    .catch(async (err) => {
      console.log(err);
    });
});
app.get("/meshitemclicked", async (req, res) => {
  const clicks = await Click.find();
  // res.send(clicks);
  if (clicks.length === 0) {
    let click = new Click({ clicks: newClicks });
    click = await click.save();
    res.send(click);
    console.log(click);
  } else {
    let result;
    try {
      result = JSON.parse("[" + clicks[0].clicks + "]");
    } catch (error) {
      console.log(error);
    }
    res.send(result);
  }
});

const port = process.env.PORT || 30002;
app.listen(port, console.log("listening on " + port));
