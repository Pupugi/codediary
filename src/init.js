import "dotenv/config";
import "./db";
import "./models/Contents";
import "./models/User";
import "./models/Comment";
import app from "./server";

const PORT = process.env.PORT || 4000;

const handleListening = () => console.log("✅ server is listening");

app.listen(PORT, handleListening);
