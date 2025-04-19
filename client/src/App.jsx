﻿import React, { useState, useEffect } from "react";
import Lobby from "./Lobby";
import Game from "./Game";
import GameOverScreen from "./GameOverScreen";
import socket from "./socket";

function App() {
    const [playerData, setPlayerData] = useState({});
    const [gameOverData, setGameOverData] = useState(null);
    const [phase, setPhase] = useState("menu");
    useEffect(() => {
        const name = localStorage.getItem("name");
        const roomCode = localStorage.getItem("roomCode");
        const playerId = localStorage.getItem("playerId");

        if (name && roomCode && playerId) {
            setPlayerData({ name, roomCode, playerId });
            setPhase("lobby");
        }
    }, []);


    useEffect(() => {
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
        const handleReconnect = () => {
            const name = localStorage.getItem("name");
            const roomCode = localStorage.getItem("roomCode");
            const playerId = localStorage.getItem("playerId");

            if (name && roomCode && playerId) {
                socket.emit("reconnect_player", {
                    name,
                    roomCode,
                    playerId,
                });
            }
        };

        socket.on("return_to_lobby", handleReturnToLobby);
        socket.on("game_started", handleGameStarted);
        socket.on("connect", handleReconnect);

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
