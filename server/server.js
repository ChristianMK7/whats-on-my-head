// server/server.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const categories = {
    food: [
        "Pizza", "Burger", "Banana", "Sushi", "Donut", "Ice Cream", "Tacos", "Spaghetti", "Hot Dog", "Croissant",
        "Popcorn", "Fried Chicken", "Burrito", "Avocado", "Ramen", "Steak", "Salmon", "Waffles", "Pancakes", "Omelette",
        "Bagel", "Cupcake", "Lollipop", "Muffin", "Cereal", "Nachos", "Meatballs", "Spring Rolls",
        "Dumplings", "Quiche", "Lasagna", "Mac & Cheese", "Fajitas", "Samosa", "Tofu", "Falafel", "Pita", "Hummus",
        "Cornbread", "Tuna", "Grilled Cheese", "Lentil Soup", "Shrimp", "Cake", "Chili", "Risotto",
        "Curry", "Biryani", "Kebab", "Tortilla", "Gnocchi", "Tabouleh",
        "Bruschetta", "Teriyaki", "Crepe",
        "Bisque", "Jambalaya", "Chicken Tenders", "French Fries", "Onion Rings", "Garlic Bread", "Pudding", "Yogurt",
        "Smoothie", "Milkshake", "Chocolate", "Candy", "Cheesecake", "Apple Pie", "Brownie", "Trifle", "Souffle", "Tiramisu",
        "Eclair", "Baklava", "Muffin", "Sundae", "Fruit Salad", "Jello", "Popsicle", "Toffee", "Marshmallow"
    ],

    animal: [
        "Cat", "Dog", "Elephant", "Lion", "Tiger", "Zebra", "Giraffe", "Kangaroo", "Panda", "Penguin",
        "Koala", "Bear", "Fox", "Wolf", "Rabbit", "Deer", "Hippopotamus", "Crocodile", "Alligator",
        "Frog", "Toad", "Turtle", "Lizard", "Snake", "Eagle", "Hawk", "Owl", "Flamingo", "Parrot",
        "Peacock", "Goose", "Duck", "Swan", "Chicken", "Rooster", "Turkey", "Dove", "Seagull", "Whale",
        "Dolphin", "Shark", "Octopus", "Squid", "Crab", "Lobster", "Starfish", "Jellyfish", "Seal", "Walrus",
        "Antelope", "Armadillo", "Badger", "Bat", "Beaver", "Bison", "Boar", "Buffalo", "Camel", "Chameleon",
        "Cheetah", "Chimpanzee", "Cougar", "Coyote", "Donkey", "Ferret", "Gazelle", "Gorilla", "Hamster", "Hedgehog",
        "Hyena", "Iguana", "Jackal", "Jaguar", "Leopard",
        "Moose", "Mule", "Newt", "Ocelot", "Ostrich", "Porcupine", "Possum", "Raccoon", "Raven",
        "Rhinoceros", "Salamander", "Skunk", "Sloth", "Tapir", "Vulture", "Weasel", "Woodpecker"
    ],

    object: [
        "Backpack", "Lamp", "Phone", "Chair", "Notebook", "Pillow", "Headphones", "Sunglasses", "Camera", "Blanket",
        "Wallet", "Watch", "Bottle", "Mug", "Pen", "Pencil", "Eraser", "Scissors", "Stapler", "Ruler",
        "Shoes", "Slippers", "Socks", "Hat", "Helmet", "Mirror", "Toothbrush", "Toothpaste", "Towel", "Comb",
        "Brush", "Soap", "Shampoo", "Conditioner", "Lotion", "Deodorant", "Remote", "Television", "Laptop", "Keyboard",
        "Mouse", "Charger", "USB", "Back Scratcher", "Fan", "Heater", "Air Conditioner", "Clock", "Alarm", "Calendar",
        "Bookshelf", "Drawer", "Desk", "Bed", "Mattress", "Cushion", "Curtain", "Door", "Window", "Doormat",
        "Spoon", "Fork", "Knife", "Plate", "Bowl", "Pan", "Pot", "Blender", "Microwave", "Toaster",
        "Fridge", "Oven", "Stove", "Kettle", "Coffee Maker", "Vacuum", "Broom", "Dustpan", "Mop", "Trash Can",
        "Suitcase", "Luggage", "Gloves", "Mask", "Umbrella", "Key", "Keychain", "Ring", "Necklace", "Bracelet",
        "Tablet", "Monitor", "Projector", "Speaker", "Tripod", "Light Bulb", "Lantern", "Whiteboard", "Marker", "Tape"
    ],

    movie: [
        "Titanic", "Inception", "The Matrix", "Avatar", "Interstellar", "Forrest Gump", "The Lion King", "The Godfather",
        "Pulp Fiction", "The Dark Knight", "Avengers: Endgame", "Iron Man", "Frozen", "Finding Nemo", "Toy Story", "Up",
        "Coco", "Shrek", "The Incredibles", "Spider-Man: No Way Home", "Black Panther", "The Avengers", "Doctor Strange",
        "Guardians of the Galaxy", "Captain Marvel", "WALL-E", "Brave", "Ratatouille", "Inside Out", "Monsters, Inc.",
        "Luca", "Turning Red", "Soul", "The Good Dinosaur", "Moana", "Mulan", "Beauty and the Beast", "Aladdin",
        "Cinderella", "Snow White", "Sleeping Beauty", "Tangled", "Frozen II", "Zootopia", "Big Hero 6", "Cars",
        "Cars 2", "Cars 3", "Finding Dory", "The Little Mermaid", "Tarzan", "Bambi", "Dumbo",
        "Jungle Book", "The Lego Movie", "The Lego Batman Movie", "Minions", "Despicable Me", "Despicable Me 2",
        "Despicable Me 3", "Sing", "Secret Life of Pets", "Madagascar", "Kung Fu Panda", "How to Train Your Dragon",
        "The Croods", "The Boss Baby", "Trolls", "Rise of the Guardians", "Megamind", "Hotel Transylvania",
        "Cloudy with a Chance of Meatballs", "Rio", "Ferdinand", "Ice Age", "Ice Age: The Meltdown",
        "Ice Age: Dawn of the Dinosaurs", "Ice Age: Continental Drift", "Ice Age: Collision Course", "Bee Movie",
        "Antz", "Chicken Run", "Coraline", "Spirit: Stallion of the Cimarron", "Happy Feet",
        "Surf's Up", "Flushed Away", "The Polar Express", "A Bug’s Life", "Braveheart", "Gladiator",
        "The Shawshank Redemption", "Good Will Hunting", "The Greatest Showman"
    ],

    celebrity: [
        "Taylor Swift", "Beyonce", "Elon Musk", "Cristiano Ronaldo", "Lionel Messi", "Ariana Grande", "Billie Eilish", "Drake", "Selena Gomez", "Zendaya",
        "Rihanna", "Emma Watson", "Dwayne Johnson", "Leonardo DiCaprio", "Robert Downey Jr.", "Tom Holland", "Scarlett Johansson", "Chris Hemsworth", "Chris Evans", "Tom Hiddleston",
        "Zac Efron", "Timothée Chalamet", "Jennifer Lawrence", "Margot Robbie", "Ryan Reynolds", "Hugh Jackman", "Justin Bieber", "Shawn Mendes", "Katy Perry", "Lady Gaga",
        "Kylie Jenner", "Kendall Jenner", "Kim Kardashian", "Khloe Kardashian", "Post Malone", "Travis Scott", "Harry Styles", "Olivia Rodrigo", "Doja Cat", "Bad Bunny",
        "J Balvin", "Nicki Minaj", "Cardi B", "Ed Sheeran", "Dua Lipa", "Machine Gun Kelly", "Megan Fox", "Millie Bobby Brown", "Noah Schnapp",
        "Finn Wolfhard", "Gaten Matarazzo", "Natalia Dyer", "Charlie D'Amelio", "Addison Rae", "James Charles", "MrBeast", "PewDiePie", "Markiplier", "Jacksepticeye",
        "Emma Chamberlain", "Lana Del Rey", "Shakira", "Jennifer Lopez", "Ben Affleck", "Matt Damon", "Angelina Jolie", "Brad Pitt", "Johnny Depp", "Amber Heard",
        "Will Smith", "Jada Pinkett Smith", "Chris Rock", "Steve Harvey", "Oprah Winfrey", "Ellen DeGeneres", "Trevor Noah", "Stephen Colbert", "Jimmy Fallon", "Jimmy Kimmel",
        "Conan O'Brien", "Joe Rogan", "Barack Obama", "Michelle Obama", "Donald Trump", "Melania Trump", "Prince Harry", "Meghan Markle", "Queen Elizabeth II", "King Charles III",
        "Pope Francis", "Dalai Lama", "Greta Thunberg", "Malala Yousafzai", "Emma Stone", "Gal Gadot", "Jason Momoa", "Keanu Reeves", "Natalie Portman", "Anne Hathaway",
        "Michael B. Jordan"
    ],

    country: [
        "United States", "Canada", "Mexico", "Brazil", "Argentina", "United Kingdom", "France", "Germany", "Italy", "Spain",
        "Portugal", "Netherlands", "Belgium", "Switzerland", "Austria", "Sweden", "Norway", "Denmark", "Finland", "Ireland",
        "Poland", "Czech Republic", "Slovakia", "Hungary", "Romania", "Bulgaria", "Greece", "Turkey", "Russia", "Ukraine",
        "India", "Pakistan", "Bangladesh", "Sri Lanka", "Nepal", "China", "Japan", "South Korea", "North Korea", "Thailand",
        "Vietnam", "Indonesia", "Malaysia", "Philippines", "Singapore", "Australia", "New Zealand", "South Africa", "Egypt", "Morocco",
        "Algeria", "Tunisia", "Nigeria", "Kenya", "Ghana", "Ethiopia", "Tanzania", "Sudan", "Saudi Arabia", "Iran",
        "Iraq", "Syria", "Israel", "Jordan", "Lebanon", "United Arab Emirates", "Qatar", "Kuwait", "Oman", "Yemen",
        "Kazakhstan", "Uzbekistan", "Turkmenistan", "Afghanistan", "Georgia", "Armenia", "Azerbaijan", "Belarus", "Lithuania", "Latvia",
        "Estonia", "Iceland", "Luxembourg", "Liechtenstein", "Monaco", "Andorra", "Malta", "Cyprus", "Bahamas", "Jamaica",
        "Cuba", "Dominican Republic", "Panama", "Costa Rica", "Guatemala", "Honduras", "Paraguay", "Uruguay"
    ]
};



const rooms = {};

function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}
function startNewRound(roomCode) {
    const room = rooms[roomCode];
    if (!room) return;

    room.roundTimeout = setTimeout(() => {
        console.log("⏰ Round timeout. Forcing new round.");
        startNewRound(roomCode);
    }, 60000);

    room.correctGuessers = [];
    room.guessedPlayers = [];

    let chosenCategory = room.category;
    if (room.category === "random") {
        const keys = Object.keys(categories);
        chosenCategory = keys[Math.floor(Math.random() * keys.length)];
    }
    room.chosenCategory = chosenCategory;

    const selectedItems = [...categories[chosenCategory]];
    const players = room.players;
    const shuffledItems = players.map(() => getRandomItem(selectedItems));

    let lowestScore = Infinity;
    let lowestIndex = 0;
    players.forEach((p, i) => {
        const score = room.scores[p.id] || 0;
        if (score < lowestScore) {
            lowestScore = score;
            lowestIndex = i;
        }
    });

    room.turnIndex = lowestIndex;

    players.forEach((player, index) => {
        const others = players.map((p, i) => ({
            name: p.name,
            id: p.id,
            item: i === index ? "???" : shuffledItems[i],
            actualItem: shuffledItems[i],
            score: room.scores[p.id] || 0
        }));

        room.items[player.id] = shuffledItems[index];

        io.to(player.id).emit("new_round", {
            players: others,
            message: "New round started!",
            turnIndex: room.turnIndex,
            chosenCategory: room.chosenCategory
        });
    });
    io.to(roomCode).emit("turn_updated", { turnIndex: room.turnIndex });
}

function getNextEligibleTurn(room) {
    const total = room.players.length;
    for (let i = 1; i <= total; i++) {
        const nextIndex = (room.turnIndex + i) % total;
        const nextPlayer = room.players[nextIndex];
        if (!room.correctGuessers.includes(nextPlayer.id)) {
            return nextIndex;
        }
    }
    return room.turnIndex;
}

io.on("connection", (socket) => {
    console.log("👤 A user connected:", socket.id);

    socket.on("get_players", ({ roomCode }) => {
        const room = rooms[roomCode];
        console.log("📦 get_players requested for room:", roomCode);
        if (room) {
            console.log("👥 Sending back players:", room.players.map(p => p.name));
            io.to(socket.id).emit("update_players", room.players);
        }
    });

    socket.on("create_room", ({ name }, callback) => {
        const roomCode = Math.floor(10000 + Math.random() * 90000).toString();
        rooms[roomCode] = {
            host: socket.id,
            players: [],
            category: null,
            items: {},
            scores: {},
            correctGuessers: [],
            turnIndex: 0,
            customCategory: null,
            customWords: []
        };

        socket.join(roomCode);
        rooms[roomCode].players.push({ id: socket.id, name });

        console.log("🧠 Creating room:", {
            roomCode,
            host: rooms[roomCode].host,
            socketId: socket.id
        });

        callback({
            roomCode,
            hostId: rooms[roomCode].host,
            playerId: socket.id
        });

        io.to(roomCode).emit("update_players", rooms[roomCode].players);
    });


    socket.on("join_room", ({ name, roomCode }, callback) => {
        if (!rooms[roomCode]) return callback({ error: "Room not found" });

        socket.join(roomCode);
        rooms[roomCode].players.push({ id: socket.id, name });

        callback({
            hostId: rooms[roomCode].host,
            playerId: socket.id
        });

        io.to(roomCode).emit("update_players", rooms[roomCode].players);
    });

    socket.on("set_category", ({ roomCode, category }) => {
        if (rooms[roomCode]) {
            rooms[roomCode].category = category;
        }
    });
    socket.on("set_custom_category", ({ roomCode, customCategory, customWords }) => {
        const room = rooms[roomCode];
        if (room) {
            room.customCategory = customCategory;
            room.customWords = customWords;
        }
    });

    socket.on("set_point_limit", ({ roomCode, pointLimit }) => {
        const room = rooms[roomCode];
        if (room) {
            room.pointLimit = pointLimit;
        }
    });

    socket.on("start_game", (roomCode) => {
        const room = rooms[roomCode];
        if (!room) return;

        room.correctGuessers = [];
        room.guessedPlayers = [];

        const turnPlayerId = room.players[room.turnIndex].id;
        let chosenCategory = room.category;
        let selectedItems = [];

        if (room.category === "custom" && room.customWords.length > 0) {
            chosenCategory = room.customCategory || "Custom";
            selectedItems = [...room.customWords];
        } else if (room.category === "random") {
            const keys = Object.keys(categories);
            chosenCategory = keys[Math.floor(Math.random() * keys.length)];
            selectedItems = [...categories[chosenCategory]];
        } else {
            selectedItems = [...categories[chosenCategory]];
        }

        room.chosenCategory = chosenCategory;


        const players = room.players;
        const shuffledItems = players.map(() => getRandomItem(selectedItems));

        const firstTurnIndex = Math.floor(Math.random() * players.length);
        room.turnIndex = firstTurnIndex;


        players.forEach((player, index) => {
            const visiblePlayers = players.map((otherPlayer, i) => ({
                name: otherPlayer.name,
                id: otherPlayer.id,
                item: i === index ? "???" : shuffledItems[i],
                actualItem: shuffledItems[i],
                score: room.scores[otherPlayer.id] || 0
            }));


            room.items[player.id] = shuffledItems[index];

            io.to(player.id).emit("game_started", {
                players: visiblePlayers,
                turnIndex: room.turnIndex,
                playerId: player.id,
                hostId: room.host,
                roomCode,
                chosenCategory,

            });
        });
    });

    socket.on("submit_guess", ({ roomCode, playerId, guess }) => {
        const room = rooms[roomCode];
        if (!room) return;

        if (!room.guessedPlayers.includes(playerId)) {
            room.guessedPlayers.push(playerId);
        }

        const actualItem = room.items[playerId];
        if (!actualItem || room.correctGuessers.includes(playerId)) return;

        const normalizedGuess = guess.trim().toLowerCase();
        const normalizedAnswer = actualItem.trim().toLowerCase();

        let wasCorrect = false;

        if (normalizedGuess === normalizedAnswer) {
            room.correctGuessers.push(playerId);
            wasCorrect = true;

            if (!room.scores[playerId]) room.scores[playerId] = 0;
            if (room.correctGuessers.length === 1) room.scores[playerId] += 2;
            else if (room.correctGuessers.length === 2) room.scores[playerId] += 1;

            io.to(playerId).emit("guess_result", {
                correct: true,
                points: room.scores[playerId]
            });

            if (room.scores[playerId] >= room.pointLimit) {
                io.to(roomCode).emit("game_over", {
                    winner: room.players.find(p => p.id === playerId).name,
                    score: room.scores[playerId],
                    players: room.players.map(p => ({
                        name: p.name,
                        score: room.scores[p.id] || 0,
                        id: p.id
                    })),
                    roomCode,
                    hostId: room.host
                });
                return;
            }
        } else {
            io.to(playerId).emit("guess_result", { correct: false });
        }


        const roundOver = room.correctGuessers.length >= 2;

        if (roundOver) {
            setTimeout(() => {
                room.chosenCategory = null;
                startNewRound(roomCode);
            }, 1000);
        } else {
            room.turnIndex = getNextEligibleTurn(room);

            room.players.forEach((player, index) => {
                io.to(player.id).emit("turn_updated", {
                    turnIndex: room.turnIndex
                });
            });
        }
    });
    socket.on("pass_turn", ({ roomCode }) => {
        const room = rooms[roomCode];
        if (!room) return;

        const total = room.players.length;
        room.turnIndex = getNextEligibleTurn(room);

        room.players.forEach((player, index) => {
            io.to(player.id).emit("turn_updated", {
                turnIndex: room.turnIndex,
            });
        });
    });
    socket.on("play_again", ({ roomCode }) => {
        const room = rooms[roomCode];
        if (!room || socket.id !== room.host) return;

        room.scores = {};
        room.correctGuessers = [];
        room.guessedPlayers = [];
        room.turnIndex = 0;
        room.customCategory = null;
        room.customWords = [];

        io.to(roomCode).emit("return_to_lobby");
    });

    socket.on("reconnect_player", ({ roomCode, playerId, name }) => {
        const room = rooms[roomCode];
        if (!room) return;

        const playerIndex = room.players.findIndex(p => p.id === playerId);
        if (playerIndex !== -1) {
            room.players[playerIndex].id = socket.id;
        } else {
            room.players.push({ id: socket.id, name });
        }

        io.to(roomCode).emit("update_players", room.players);

        const fullState = {
            players: room.players.map((p, i) => ({
                name: p.name,
                id: p.id,
                item: i === playerIndex ? "???" : room.items[p.id],
                actualItem: room.items[p.id],
                score: room.scores[p.id] || 0
            })),
            turnIndex: room.turnIndex,
            playerId: socket.id,
            hostId: room.host,
            roomCode,
            chosenCategory: room.chosenCategory
        };

        io.to(socket.id).emit("restore_state", fullState);
    });


    socket.on("disconnect", () => {
        for (const code in rooms) {
            const room = rooms[code];
            const player = room.players.find(p => p.id === socket.id);
            if (player) {
                player.disconnected = true;

                io.to(code).emit("update_players", room.players);

                // INCREASE THIS TO 2 MINUTES (120000ms)
                setTimeout(() => {
                    const stillDisconnected = room.players.find(p => p.id === socket.id && p.disconnected);
                    if (stillDisconnected) {
                        room.players = room.players.filter(p => p.id !== socket.id);
                        delete room.items[socket.id];

                        if (room.players.length === 0) {
                            delete rooms[code];
                        } else {
                            io.to(code).emit("update_players", room.players);
                        }
                    }
                }, 120000);
            }
        }
    });
});

server.listen(3001, () => {
    console.log("✅ Server is running on port 3001");
});