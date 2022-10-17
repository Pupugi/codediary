import "dotenv/config";
import "./db";
import "./models/Contents";
import "./models/User";
import "./models/Comment";
import app from "./server";

const handleListening = () => console.log("✅ server is listening");

app.listen(4000, handleListening);
