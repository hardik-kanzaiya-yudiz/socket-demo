// const axios 	= 	require('axios');
const express = require("express");
const app = express();
const server = require("http").Server(app);
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv").config();
const port = process.env.CHAT_PORT;
// console.log(port);
const CORS_URL = process.env.CHAT_CORS_URL;
const APP_URL = process.env.APP_URL;

const io = require("socket.io")(server, {
    cors: {
        origin: CORS_URL,
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true,
    },
    pingInterval: 2000,
    pingTimeout: 10000,
    allowEIO3: true,
});
const mysql = require("mysql");
const tech = io.of("/");

app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

/* MySQL Connections */
var connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    charset: "utf8mb4", // to store emoji into database with utf8mb4 format
});

/* Listen On Respective Port */
server.listen(port, () => {
    console.log(":: SERVER IS LISTEN ON " + port + " ::");
});
connection.connect((error) => {
    if (error) throw error;
});

var i = 0;
let users = [];
let overallAdmins = [];
let overallUsers = [];

io.on("connection", (socket) => {
    // console.log(socket);
    /* Offline (Auto Disconnect By Socket) */
    socket.on("disconnecting", (reason) => {
        // let user_id = [...socket.rooms][1]; // request.user_id (custom_id) which we have pass at join time
        // console.log("Disconnect User ID ::", user_id);
        // Remove From ChatRoom
        // for (const [key, value] of Object.entries(users)) {
        //     if (value.includes(user_id)) {
        //         value.splice(value.indexOf(user_id), 1);
        //         // Free Room Key If No Users Are There
        //         if (value.length == 0) delete users[key];
        //     }
        // }
        // Remove From Over List
        // let adminDetail = overallAdmins.indexOf(user_id);
        // if (adminDetail > -1) overallAdmins.splice(user_id, 1);
        // let userDetail = overallUsers.indexOf(user_id);
        // if (userDetail > -1) overallUsers.splice(user_id, 1);
        // sendOnlineOffline();
    });

    /* start :: Send New Message */
    socket.on("send-message", (request) => {
        // console.log(request);
        if (
            request.message &&
            request.send_user &&
            request.recieve_user &&
            request.time
        ) {
            let addMessageData = {
                message: request.message,
                send_user: request.send_user,
                recieve_user: request.recieve_user,
                created_at: request.time,
                updated_at: request.time,
            };

            // console.log(addMessageData);

            let addRecord = "INSERT INTO `chat_messages` SET ?";
            connection.query(
                addRecord,
                addMessageData,
                (error, _addMessage) => {
                    if (error) throw error;
                    // console.log("hii hardik");
                    addMessageData.sendUserType = request.send_user_type;
                    addMessageData.recieveUserType = request.recieve_user_type;
                    // console.log(addMessageData);
                    io.emit("new-message", addMessageData);
                }
            );
        } else {
            console.log("Something went wrong.");
            return false;
        }
    });

    /** end :: send new message */
});
