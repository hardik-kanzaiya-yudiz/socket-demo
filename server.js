const axios 	= 	require('axios');
const express 	= 	require('express');
const app 		= 	express();
const server 	= 	require("http").Server(app);
const path 		= 	require('path');
const cors 		= 	require('cors');
const dotenv 	=  	require("dotenv").config();
const port 		= 	process.env.CHAT_PORT;
const CORS_URL 	=  	process.env.CHAT_CORS_URL;
const APP_URL 	= 	process.env.APP_URL;

const io 		= 	require('socket.io')(server, {
	cors: {
		origin: CORS_URL,
   	 	methods: ["GET", "POST"],
    	allowedHeaders: ["my-custom-header"],
    	credentials: true
  	},
  	pingInterval: 2000, pingTimeout: 10000, allowEIO3: true
});
const mysql 	= 	require('mysql');
const tech 		= 	io.of('/');

app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

/* MySQL Connections */
var connection = mysql.createConnection({

	host     : 	process.env.DB_HOST,
	port     : 	process.env.DB_PORT,
	user     : 	process.env.DB_USERNAME,
	password : 	process.env.DB_PASSWORD,
	database : 	process.env.DB_DATABASE,
	charset  : 	'utf8mb4'  // to store emoji into database with utf8mb4 format
});

/* Listen On Respective Port */
server.listen(port, ()=> { console.log(':: SERVER IS LISTEN ON '+ port+' ::'); });
connection.connect((error) => { if( error ) throw error; });

var i = 0;
let users = [];
let overallAdmins = [];
let overallUsers = [];

io.on('connection', (socket)=>{

	/* User Joined The Global Chat When It's Online */
	socket.on('join-global',(request)=>{
		socket.join(request.user_id);
		console.log("********* OVERALL JOINED With ID :: "+request.user_id + " *********");

        if(request.user_type == 'admin'){
            if (!overallAdmins.includes(request.user_id)) overallAdmins.push(request.user_id);
        }else if(request.user_type == 'user'){
            if (!overallUsers.includes(request.user_id)) overallUsers.push(request.user_id);
        }

        sendOnlineOffline();
	});

	/* User Joined The Room Chat When Enter In Any Room */
	socket.on('join-room',(request)=>{
		socket.join(request.room_id);
		console.log("********* CHAT JOINED With Room ID :: "+request.room_id + " *********");

		if( !users[request.room_id] ) users[request.room_id] = [];

		// Ignore user if already added into the array
		if (!users[request.room_id].includes(request.user_id)) users[request.room_id].push(request.user_id);
	});

	/* User Disconnected From Chat Room */
	socket.on('disconnect-room', (request)=>{
		console.log('**** DISCONNECT ROOM ****');

		// Remove From ChatRoom
		for (const [key, value] of Object.entries(users)) {
			if (value.includes(request.user_id)) {
				value.splice( value.indexOf(request.user_id) ,1)

				// Free Room Key If No Users Are There
					if (value.length == 0) delete users[key]
			}
		}
	});

    /* typing */
    socket.on('typing', (request)=>{
		console.log("********* TYPING With Room ID :: "+request.room_id + " *********");

        var returnDetails = {
            'user_id'     :   request.user_id,
            'room_id'     :   request.room_id,
            'user_type'   :   request.user_type,
            'typing_mode' :   request.typing_mode,
            'chat_status' :   request.chat_status
        };

        // Send Typing Method
		io.sockets.emit("typing", returnDetails);
    });

	/* Offline (Auto Disconnect By Socket) */
  	socket.on("disconnecting", (reason) => {
  		let user_id = [...socket.rooms][1];  // request.user_id (custom_id) which we have pass at join time
      	console.log("Disconnect User ID ::", user_id);

      	// Remove From ChatRoom
		for (const [key, value] of Object.entries(users)) {
			if (value.includes(user_id)) {
				value.splice( value.indexOf(user_id) ,1)

				// Free Room Key If No Users Are There
				if (value.length == 0) delete users[key]
			}
		}

        // Remove From Over List
        let adminDetail = overallAdmins.indexOf(user_id);
        if (adminDetail > -1) overallAdmins.splice(user_id, 1);

        let userDetail = overallUsers.indexOf(user_id);
        if (userDetail > -1) overallUsers.splice(user_id, 1);

        sendOnlineOffline();
  	});

    /* online offline */
    function sendOnlineOffline() {
        var returnDetails = {
            'overallUsers'  :   overallUsers,
            'overallAdmins' :   overallAdmins
        };

        // Send Offline Method
		console.log("online-offline", returnDetails);
		io.sockets.emit("online-offline", returnDetails);
    }

	/* Send New Message */
	socket.on('send-message', (request) => {
		if(request.id && request.message && request.room_id && request.admin_id && request.user_id && request.message_type && request.sender && request.status && request.time){
            let addMessageData = {
                custom_id	    : 	request.id,
                message	        : 	request.message,
                room_id		    : 	request.room_id,
                admin_id        : 	request.admin_id,
                user_id	        : 	request.user_id,
                message_type	: 	request.message_type,
                sender 	        : 	request.sender,
                status 		    : 	request.status,
                created_at 	    : 	request.time,
                updated_at 	    : 	request.time
            };

            let addRecord = "INSERT INTO `chat_messages` SET ?";
            connection.query(addRecord, addMessageData, (error, _addMessage) => {
                if( error ) throw error;

                io.in(request.room_id).emit('new-message', addMessageData);
                console.log("New Message Object ::"+JSON.stringify(addMessageData));
            });
		}else{
			console.log("Precondition Failed !!!");
			return false;
		}
	});


});

