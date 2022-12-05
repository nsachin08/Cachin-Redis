const express = require("express");
const axios = require("axios");
const cors = require("cors");
const Redis = require("redis");
const redisClient = Redis.createClient();

const DEFAULT_EXPIRATION = 3600;

const app = express();

app.use(expresss.urlencoded({ extended: true }));
app.use(cors());

app.get("/photos", async (req, res) => {
  const albumId = req.query.albumId;
  redisClient.get("photos", async (error, photos) => {
    if (err) console.error(error);
    if (photos != null) {
      console.log("Cache Hit");
      return res.json(JSON.parse(photos));
    } else {
      console.log("Cache Miss");
      const { data } = await axios.get(
        "https://jsonplaceholder.typicode.com/photos",
        {
          params: { albumId },
        }
      );
      redisClient.setEx("photos", DEFAULT_EXPIRATION, JSON.stringify(data));
      res.json(data);
    }
  });
});
