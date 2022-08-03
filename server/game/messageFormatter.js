module.exports = {
    createSelectingWordMessage: (username) => {
        return {
            type: "SELECTING_WORD",
            author: username,
            guess: "is selecting a word."
        };
    },

    createDrawingNowMessage: (username) => {
        return {
            type: "DRAWING_NOW",
            author: username,
            guess: "is drawing now."
        };
    },

    createJoinedGameMessage: (username) => {
        return {
            type: "JOINED_GAME",
            author: username,
            guess: "joined the game."
        };
    },

    createLeftGameMessage: (username) => {
        return {
            type: "LEFT_GAME",
            author: username,
            guess: "left the game."
        };
    },

    createMessageOnlyGuessedUsers: (messageObj) => {
        return {
            ...messageObj,
            type: "ALREADY_GUESSED"
        };
    },

    createCorrectMessage: (username) => {
        return {
            type: "CORRECT_GUESS",
            author: username,
            guess: "guessed the word."
        };
    },

    createAllCorrectGuessMessage: () => {
        return {
            type: "ALL_CORRECT",
            author: "",
            guess: "EVERYONE GUESSED CORRECTLY"
        };
    },
}
