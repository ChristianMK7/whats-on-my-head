import React, { useState, useEffect } from "react";
import Lobby from "./Lobby";
import Game from "./Game";
import GameOverScreen from "./GameOverScreen";
import socket from "./socket";

function App() {
    const [playerData, setPlayerData] = useState({});
    const [gameOverData, setGameOverData] = useState(null);
    const [phase, setPhase] = useState("menu");

    useEffect(() => {
        const handleReconnect = () => {
            if (playerData.roomCode && playerData.playerId && playerData.name) {
                socket.emit("reconnect_player", {
                    name: playerData.name,
                    roomCode: playerData.roomCode,
                    playerId: playerData.playerId,
                });
            }
        };
        const handleReturnToLobby = () => {
            setGameOverData(null);
            setPhase("lobby");
            socket.emit("get_players", { roomCode: playerData.roomCode });
        };

        const handleGameStarted = ({ players, turnIndex, playerId, hostId, roomCode }) => {

            setPlayerData(prev => ({
                ...prev,
                players,
                turnIndex,
                playerId,
                hostId,
                roomCode
            }));
            setGameOverData(null);
            setPhase("game");
        };
        socket.on("connect", handleReconnect);
        socket.on("return_to_lobby", handleReturnToLobby);
        socket.on("game_started", handleGameStarted);

        return () => {
            socket.off("return_to_lobby", handleReturnToLobby);
            socket.off("game_started", handleGameStarted);
            socket.off("connect", handleReconnect);
        };
    }, [playerData.name, playerData.playerId, playerData.roomCode]);

    return (
        <div className="app">
            {phase === "menu" && (
                <Lobby
                    setPhase={setPhase}
                    setPlayerData={setPlayerData}
                    isRejoining={false}
                    playerData={playerData}
                />
            )}
            {phase === "lobby" && (
                <Lobby setPhase={setPhase} setPlayerData={setPlayerData} isRejoining={true} playerData={playerData} />
            )}
            {phase === "game" && (
                <Game playerData={playerData} setPhase={setPhase} setGameOverData={setGameOverData} />
            )}
            {phase === "gameover" && (
                <GameOverScreen
                    data={gameOverData}
                    setGameOverData={setGameOverData}
                    setPhase={setPhase}
                />
            )}
        </div>
    );
}

export default App;