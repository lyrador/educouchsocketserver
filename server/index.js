const express = require('express');
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io")
app.use(cors());

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000", "http://localhost:19000"],
        methods: ["GET", "POST"],
    },
})

io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id)
    })

    //---------------TRIVIA------------------------------------
    //join
    socket.on("join_room_admin", (data) => {
        socket.join(data);
        console.log(`Instructor with ID: ${socket.id} joined room: ${data}`);
        instructorRoom = data
    });

    socket.on("join_room", (data) => {
        socket.join(data.room);
        console.log(`User with ID: ${socket.id} joined room: ${data}`);
        socket.to(data.room).emit("new_player_joined", data);
    });

    //start game
    socket.on("start_game", (data) => {
        console.log("START GAME")
        console.log(data)
        socket.to(data.room).emit("receive_start_game", data);
    });

    //send response
    socket.on("send_response", (data) => {
        console.log("Send response")
        console.log(data)
        socket.to(data.room).emit("receive_response", data);
    });

    //send answer and score
    socket.on("send_answer_and_score", (data) => {
        console.log("SEND ANSWER AND SCORE")
        console.log(data)
        socket.to(data.room).emit("receive_answer_and_score", data);
    });

    //send leaderboard
    socket.on("send_leaderboard", (data) => {
        socket.to(data.room).emit("receive_leaderboard", data);
    });

    //---------------POLL------------------------------------
    socket.on("join_room_admin_poll", (data) => {
        socket.join(data);
        console.log(`Poll Instructor with ID: ${socket.id} joined room: ${data}`);
    });

    socket.on("join_room_poll", (data) => {
        socket.join(data.room);
        console.log(`Poller with ID: ${socket.id} joined room: ${data.room}`);
        socket.to(data.room).emit("receive_request_poll_question", data);
    });

    socket.on("send_poll_question", (data) => {
        console.log("sending poll question to room: " + data.room)
        socket.to(data.room).emit("receive_poll_question", data);
    });

    socket.on("send_poll_response", (data) => {
        socket.to(data.room).emit("receive_poll_response", data);
    });

    socket.on("leave_room_admin_poll", (data) => {
        socket.join(data);
        socket.leave(data);
        console.log(`Instructor with ID: ${socket.id} left room: ${data}`);
    });
})

server.listen(3001, () => {
    console.log("Server Is Running!")
})