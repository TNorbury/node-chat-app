// import path from "path"
const path = require("path");
const http = require("http");

import * as express from "express";
import * as socketio from "socket.io";
const Filter = require("bad-words")

import {
    generateMessage,
    generateLocationMessage,
    Coordinate,
} from "./utils/messages";
import { addUser, removeUser, getUser, getUsersInRoom } from "./utils/users";

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
app.use(express.static(path.join(__dirname, "../public")));

io.on("connection", (socket) => {
    console.log("New WebSocket connection");

    socket.on("join", ({ username, room }, callback) => {
        const { error, user } = addUser({ id: socket.id, username, room });

        if (error) {
            return callback(error);
        }

        socket.join(user.room);

        socket.emit("message", generateMessage("Admin", "Welcome!"));
        socket.broadcast
            .to(user.room)
            .emit(
                "message",
                generateMessage("Admin", `${user.username} has joined!`)
            );

        io.to(user.room).emit("roomData", {
            room: user.room,
            users: getUsersInRoom(user.room),
        });

        callback();
    });

    socket.on(
        "sendMessage",
        (message: string, callback: (arg0?: string) => void) => {
            const filter = new Filter();

            if (filter.isProfane(message)) {
                return callback("Profanity is not allowed");
            }

            // Get the user who sent this message
            const user = getUser(socket.id);

            io.to(user.room).emit(
                "message",
                generateMessage(user.username, message)
            );
            callback();
        }
    );

    socket.on("sendLocation", (location: Coordinate, callback: () => void) => {
        // Get the user who sent this message
        const user = getUser(socket.id);
        io.to(user.room).emit(
            "locationMessage",
            generateLocationMessage(user.username, location)
        );

        callback();
    });

    socket.on("disconnect", () => {
        const user = removeUser(socket.id);

        if (user) {
            io.to(user.room).emit(
                "message",
                generateMessage("Admin", `${user.username} has left!`)
            );

            io.to(user.room).emit("roomData", {
                room: user.room,
                users: getUsersInRoom(user.room),
            });
        }
    });
});

server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});
