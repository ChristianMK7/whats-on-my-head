import React from "react";
import socket from "./socket";

function GameOverScreen({ data, setGameOverData, setPhase }) {
    if (!data) return null;

    const isHost = socket.id === data.hostId;

    const handlePlayAgain = () => {
        if (isHost) {
            socket.emit("play_again", { roomCode: data.roomCode });
        }
    };

    return (
        <div className="game">
            <h1>🎉 Game Over!</h1>
            <h2>🏆 Winner: {data.winner} with {data.score} points!</h2>

            <h3>🏁 Final Leaderboard:</h3>
            <div className="leaderboard">
                {data.players
                    .slice()
                    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
                    .map((p, i) => (
                        <div key={i} className="leaderboard-entry">
                            <span>{i + 1}. {p.name}</span>
                            <span>🎯 {p.score ?? 0}</span>
                        </div>
                    ))}
            </div>

            {isHost && (
                <button onClick={handlePlayAgain}>🔁 Play Again</button>
            )}
        </div>
    );
}

export default GameOverScreen;
