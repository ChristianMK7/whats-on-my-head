import React, { useState, useEffect } from "react";
import socket from "./socket";
const playSound = (filename) => {
  const audio = new Audio(`/sounds/${filename}`);
  audio.play();
};

function Game({ playerData, setInGame, setGameOverData, setPhase}) {
    const [players, setPlayers] = useState(playerData.players || []);
    const [guess, setGuess] = useState("");
    const [feedback, setFeedback] = useState("");
    const [hasGuessed, setHasGuessed] = useState(false);
    const [turnIndex, setTurnIndex] = useState(playerData.turnIndex || 0);
    const [categoryUsed, setCategoryUsed] = useState(null);

    const yourPlayerId = playerData.playerId;

    useEffect(() => {
        const handleGameStarted = ({ players, turnIndex, chosenCategory }) => {
            setPlayers(players);
            setFeedback("");
            setGuess("");
            setHasGuessed(false);
            setTurnIndex(turnIndex);
            setCategoryUsed(chosenCategory || null);
            setGameOverData(null);
            setInGame(true);  
            console.log("✅ Category used this round:", chosenCategory);

        };

        const handleNewRound = ({ players, message, turnIndex, chosenCategory }) => {
            setPlayers(players);
            setFeedback("");
            setGuess("");
            setHasGuessed(false);
            setTurnIndex(turnIndex);
            setCategoryUsed(chosenCategory || null);

        };


        const handleGuessResult = ({ correct, points }) => {
            if (correct) {
                playSound("correct.mp3");
                setFeedback("✅ Correct! You earned points!");
            } else {
                playSound("wrong.mp3");
                setFeedback("❌ Not quite. Try again next round.");
            }
            setGuess("")
            setHasGuessed(true);
        };
        socket.on("turn_updated", ({ turnIndex }) => {
            setTurnIndex(turnIndex);

            const currentTurnPlayer = players[turnIndex];
            const isNowMyTurn = currentTurnPlayer?.id === yourPlayerId;

            if (isNowMyTurn) {
                playSound("turn.mp3");
                setHasGuessed(false);
                setFeedback("");
            }
        });

        socket.on("game_over", ({ winner, score, players, roomCode, hostId }) => {
            setGameOverData({ winner, score, players, roomCode, hostId });
            setPhase("gameover");
        });



        socket.on("game_started", handleGameStarted);
        socket.on("new_round", handleNewRound);
        socket.on("guess_result", handleGuessResult);
        return () => {
            socket.off("game_started", handleGameStarted);
            socket.off("new_round", handleNewRound);
            socket.off("guess_result", handleGuessResult);
            socket.off("turn_updated");
            socket.off("game_over");
        };

    },[players, setGameOverData, setInGame, setPhase, yourPlayerId]);

    const handleGuess = () => {
        if (!guess.trim() || hasGuessed) return;
        socket.emit("submit_guess", {
            roomCode: playerData.roomCode,
            playerId: yourPlayerId,
            guess
        });
        setGuess("")
    };

    const handlePassTurn = () => {
        socket.emit("pass_turn", { roomCode: playerData.roomCode });
    };
    const currentTurnPlayer = players[turnIndex] || {};
    const isMyTurn = currentTurnPlayer.id === playerData.playerId;

    return (
        <div className="game">
            <h1>Guess What's on Your Head!</h1>

            <h3 style={{ marginBottom: "20px", color: isMyTurn ? "#0f0" : "#fff" }}>
                🎯 {isMyTurn
                    ? "It's your turn!"
                    : `Waiting for ${players[turnIndex]?.name}...`}
            </h3>

            <h2 style={{ marginBottom: "10px" }}>🧑‍🤝‍🧑 Players:</h2>
            <div className="player-list">
                {players.map((p, i) => (
                    <div
                        key={i}
                        className="player"
                        style={{
                            fontWeight: i === turnIndex ? "bold" : "normal",
                            color: i === turnIndex ? "#0f0" : "#fff",
                            textAlign: "center"
                        }}
                    >
                        {p.name}{p.item === "???" ? " (You!)" : ""}
                    </div>
                ))}
            </div>

            <h2>🤔 What everyone got:</h2>
            {categoryUsed && (
                <p className="category-reveal">
                    Category: <strong>{categoryUsed}</strong>
                </p>
            )}


            <div className="player-reveal">
                {players.map((p, i) => (
                    <div key={i} className="player-reveal-entry">
                        {p.name} → {p.item}
                    </div>
                ))}
            </div>

            <h2 style={{ marginTop: "30px" }}>🏆 Leaderboard</h2>
            <div className="leaderboard">
                {players
                    .slice()
                    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
                    .map((p, i) => (
                        <div key={i} className="leaderboard-entry" style={{ animationDelay: `${i * 0.1}s` }}>
                            <span>{i + 1}. {p.name}{p.item === "???" ? " (You!)" : ""}</span>
                            <span>🎯 {p.score ?? 0}</span>
                        </div>
                    ))}
            </div>

            {isMyTurn && !hasGuessed && (
                <>
                    <input
                        placeholder="Enter your guess"
                        value={guess}
                        onChange={(e) => setGuess(e.target.value)}
                    />
                    <button type="button" onClick={handleGuess}>Submit Guess</button>
                    <button type="button" onClick={handlePassTurn}>Pass Turn</button>
                </>
            )}

            {feedback && <p>{feedback}</p>}
        </div>
    );
}

export default Game;
