/* global process */
import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const { WPCC_CLIENT_ID, WPCC_CLIENT_SECRET } = process.env;

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/exchange-token", async (req, res) => {
  const { code, redirect_uri } = req.body;
  try {
    const response = await axios.post(
      "https://public-api.wordpress.com/oauth2/token",
      new URLSearchParams({
        client_id: WPCC_CLIENT_ID,
        client_secret: WPCC_CLIENT_SECRET,
        redirect_uri,
        code,
        grant_type: "authorization_code",
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message, details: err.response?.data });
  }
});

app.listen(4000, () => console.log("Backend running on http://localhost:4000"));
