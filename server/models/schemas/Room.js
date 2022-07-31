const mongoose = require("mongoose");

const playerSchema = mongoose.Schema(
    {
        socketId: {
            type: String,
            required: true
        },
        username: {
            type: String,
            required: true
        },
        score: {
            type: Number,
            required: false,
            default: 0
        },
    },
    {
        _id: false
    }
);

const gameSchema = mongoose.Schema(
    {
        hasStarted: {
            type: Boolean,
            required: true,
            default: false
        }

    },
    {
        _id: false
    }
);

const roomSchema = mongoose.Schema(
    {
        roomCode: {
            type: String,
            require: true,
        },
        users: [playerSchema],
        game: { type: gameSchema, default: () => ({}) }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Room", roomSchema);
