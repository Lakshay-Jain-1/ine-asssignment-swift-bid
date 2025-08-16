import express from "express";
import cors from "cors";
import sendGridMail from "@sendgrid/mail";
import { createServer } from "http";
import { Server } from "socket.io";
import { supabase } from "./supabase-client.js";
import dotenv from "dotenv";
dotenv.config();
import path from "path";
import { fileURLToPath } from "url";
import { setupSockets } from "./modules/socket.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);


app.get("/", (req, res) => {
  res.send("Hello, world!");
});



const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
  },
});

const userSocketMap = new Map();

setupSockets(io,supabase,userSocketMap)

const PORT = process.env.PORT_NUMBER || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
