import React, { useState, useEffect } from "react";
import socket from "./socket";

function Lobby({ setPhase, setPlayerData, isRejoining = false, playerData }) {
    const [name, setName] = useState(playerData.name || "");
    const [roomCodeInput, setRoomCodeInput] = useState("");
    const [roomCode, setRoomCode] = useState(playerData.roomCode || "");
    const [players, setPlayers] = useState([]);
    const [category, setCategory] = useState("food");
    const [pointLimit, setPointLimit] = useState(10);

    const isHost = playerData?.playerId === playerData?.hostId;

    useEffect(() => {
        if (playerData?.roomCode) {
            socket.emit("get_players", { roomCode: playerData.roomCode });
        }

        if (isRejoining) {
            setRoomCode(playerData.roomCode);
            setName(playerData.name || "");
        }

        socket.on("update_players", (players) => {
            console.log("✅ Received updated players:", players.map(p => p.name));
            setPlayers(players);
        });

        socket.on("game_started", (data) => {
            setPlayerData({
                ...data,
                roomCode: roomCode || playerData.roomCode,
                playerId: data.playerId,
                name: name,
            });
            setPhase("game");

        });

        return () => {
            socket.off("update_players");
            socket.off("game_started");
        };
    }, [isRejoining, playerData, name, roomCode, setPlayerData, setPhase]);

    const handleCreate = () => {
        if (!name || name.length < 3 || name.length > 20) {
            alert("Name must be between 3 and 20 characters.");
            return;
        }
        socket.emit("create_room", { name }, ({ roomCode, hostId, playerId }) => {
            console.log("✅ Received from server:", roomCode, hostId, playerId);
            setRoomCode(roomCode);
            setPlayerData({
                name,
                roomCode,
                playerId,
                hostId 
            });
        });
    };

    const handleJoin = () => {
        if (!name || name.length < 3 || name.length > 20) {
            alert("Name must be between 3 and 20 characters.");
            return;
        }
        if (!roomCodeInput) return;

        socket.emit("join_room", { name, roomCode: roomCodeInput }, (res) => {
            if (res.error) {
                alert(res.error);
            } else {
                setRoomCode(roomCodeInput);
                setPlayerData({
                    name,
                    roomCode: roomCodeInput,
                    playerId: res.playerId,
                    hostId: res.hostId 
                });
            }
        });
    };


    const handleStart = () => {
        if (players.length < 2) {
            alert("You need at least 2 players to start the game.");
            return;
        }
        socket.emit("set_category", { roomCode, category });
        socket.emit("set_point_limit", { roomCode, pointLimit });
        socket.emit("start_game", roomCode);
    };

    return (
        <div className="lobby">
            <h1>What's on My Head</h1>

            {!roomCode && !isRejoining ? (
                <>
                    <input
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <button type="button" onClick={handleCreate}>Create Room</button>

                    <input
                        placeholder="Enter room code"
                        value={roomCodeInput}
                        onChange={(e) => setRoomCodeInput(e.target.value)}
                        maxLength={5}
                    />
                    <button type="button" onClick={handleJoin}>Join Room</button>
                </>
            ) : (
                <>
                    <p>Room Code: <strong>{roomCode}</strong></p>
                    <h2>Players:</h2>
                    <div className="player-list">
                        {players.map((p) => (
                            <div key={p.id} className=" player player-name">
                                {p.name}
                            </div>
                        ))}
                    </div>

                    {isHost && (
                        <>
                            <label>Categories:</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option value="random">🎲 Random</option>
                                <option value="food">🍽️ Food</option>
                                <option value="animal">🐾 Animal</option>
                                <option value="object">📦 Object</option>
                                <option value="movie">🎬 Movie</option>
                                <option value="celebrity">🎨 Celebrity</option>
                                <option value="country">🌍 Country</option>
                            </select>

                            <label>Points to win:</label>
                            <select
                                value={pointLimit}
                                onChange={(e) => setPointLimit(Number(e.target.value))}
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={15}>15</option>
                            </select>

                            <button type="button" onClick={handleStart}>Start Game</button>
                        </>
                    )}
                </>
            )}
        </div>
    );
}

export default Lobby;
