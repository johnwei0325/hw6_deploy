import express from 'express';
import bodyParser from 'body-parser';
import db from './db';
import cors from 'cors';
import mongoose from 'mongoose';
import routes from './routes';
import path from "path";

const app=express();
const port=process.env.PORT || 4000;

if (process.env.NODE_ENV === "development") {
	app.use(cors());
}
//app.use(cors());
console.log(process.env.NODE_ENV)
if (process.env.NODE_ENV === "production") {
    const __dirname = path.resolve();
    app.use(express.static(path.join(__dirname, "../frontend", "build")));
    app.get("/*", function (req, res) {
      res.sendFile(path.join(__dirname, "../frontend", "build", "index.html"));
    });
}

app.use(bodyParser.json());
app.use(express.json());

app.use('/',routes);
db.connect();
app.listen(port,()=>
    console.log(`example app listening on port ${port}!`),
);

