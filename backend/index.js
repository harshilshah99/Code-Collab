const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const ACTIONS = require('../code-collab/src/Actions');
const cors = require('cors');
const { c, cpp, node, python, java } = require('compile-run');

const server = http.createServer(app);
const io = new Server(server);

app.use(cors());
app.use(express.json())


//Compiling code for all languages
app.post("/python", (req, res) => {
    const resultPromise = python.runSource(req.body.runcode);
    resultPromise
        .then(result => {
            if (result.exitCode == 0) {
                res.json(result.stdout)
            }
            else {
                res.json('SyntaxError')
            }
        })
        .catch(err => {
            console.log(err);
        });
})
app.post("/node", (req, res) => {
    const resultPromise = node.runSource(req.body.runcode);
    resultPromise
        .then(result => {
            if (result.exitCode == 0) {
                res.json(result.stdout)
            }
            else {
                res.json('SyntaxError')
            }
        })
        .catch(err => {
            console.log(err);
        });
})
app.post("/java", (req, res) => {
    const resultPromise = java.runSource(req.body.runcode);
    resultPromise
        .then(result => {
            console.log(result);
            if (result.exitCode == 0) {
                res.json(result.stdout)
            }
            else {
                res.json('SyntaxError')
            }
        })
        .catch(err => {
            console.log(err);
        });
})
app.post("/c", (req, res) => {
    const resultPromise = c.runSource(req.body.runcode);
    resultPromise
        .then(result => {
            console.log(result);
            if (result.exitCode == 0) {
                res.json(result.stdout)
            }
            else {
                res.json('SyntaxError')
            }
        })
        .catch(err => {
            console.log(err);
        });
})
app.post("/cpp", (req, res) => {
    const resultPromise = cpp.runSource(req.body.runcode);
    resultPromise
        .then(result => {
            console.log(result);
            if (result.exitCode == 0) {
                res.json(result.stdout)
            }
            else {
                res.json('SyntaxError')
            }
        })
        .catch(err => {
            console.log(err);
        });
})
app.post("/java", (req, res) => {
    const resultPromise = java.runSource(req.body.runcode);
    resultPromise
        .then(result => {
            console.log(result);
            if (result.exitCode == 0) {
                res.json(result.stdout)
            }
            else {
                res.json('SyntaxError')
            }
        })
        .catch(err => {
            console.log(err);
        });
})


const userSocketMap = {};
function getAllConnectedClients(roomId) {
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId) => {
        return {
            socketId,
            username: userSocketMap[socketId],
        }
    });
}

//Socket io connection
io.on('connection', (socket) => {
    console.log('socket connected', socket.id);

    socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
        userSocketMap[socket.id] = username;
        socket.join(roomId);
        const clients = getAllConnectedClients(roomId);
        console.log(clients);
        clients.forEach(({ socketId }) => {
            io.to(socketId).emit(ACTIONS.JOINED, {
                clients,
                username,
                socketId: socket.id,
            })
        })
    });

    //For code change
    socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
        socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
    });

    //For syncing code
    socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
        io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
    });

    //For chat message
    socket.on('message', ({ name, message }) => {
        io.emit('message', { name, message })
    })

    //For disconnection
    socket.on('disconnecting', () => {
        const rooms = [...socket.rooms]
        rooms.forEach((roomId) => {
            socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
                socketId: socket.id,
                username: userSocketMap[socket.id],
            })
        })
        delete userSocketMap[socket.id];
        socket.leave();
    })
})


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));