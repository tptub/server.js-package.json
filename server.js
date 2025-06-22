import express from "express";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());

const TOKEN = process.env.GH_TOKEN;
const OWNER = "tptub";
const REPO = "key-hack";
const FILE_PATH = "Key.txt";

app.post("/generate-key", async (req, res) => {
  try {
    const response = await axios.get(`https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE_PATH}`, {
      headers: { Authorization: `Bearer ${TOKEN}` }
    });

    const content = Buffer.from(response.data.content, "base64").toString("utf-8");
    const newKey = `${generateKey()} -1her`;
    const updatedContent = content + `\n${newKey}`;

    await axios.put(`https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE_PATH}`, {
      message: "Add 1-hour key",
      content: Buffer.from(updatedContent).toString("base64"),
      sha: response.data.sha
    }, {
      headers: { Authorization: `Bearer ${TOKEN}` }
    });

    res.json({ success: true, key: newKey });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "فشل التوليد" });
  }
});

function generateKey() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from({ length: 16 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

app.listen(3000, () => {
  console.log("✅ Server running on port 3000");
});
