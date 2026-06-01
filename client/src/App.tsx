import { useEffect, useState } from "react";
import "./App.css";
import { socket } from "./socket";

type Player = {
  id: string;
};

type Room = {
  id: string;
  players: Player[];
};

function App() {
  const [roomIdInput, setRoomIdInput] = useState("");
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);

  useEffect(() => {
    const handleConnect = () => {
      console.log("connected to server", socket.id);
    };

    const handlePongFromServer = (msg: string) => {
      console.log("message from server:", msg);
    };

    const handleRoomState = (room: Room) => {
      console.log("room state from server", room);
      setCurrentRoom(room);
    };

    const handleErrorMessage = (message: string) => {
      console.log("error from server:", message);
    };

    socket.on("connect", handleConnect);
    socket.on("pongFromServer", handlePongFromServer);
    socket.on("roomState", handleRoomState);
    socket.on("errorMessage", handleErrorMessage);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("pongFromServer", handlePongFromServer);
      socket.off("roomState", handleRoomState);
      socket.off("errorMessage", handleErrorMessage);
    };
  }, []);

  const joinRoomHandler = () => {
    socket.emit("joinRoom", {
      roomId: roomIdInput.trim(),
    });
  };

  const btnHandler = () => {
    socket.emit("pingServer", "ayoo river electric boogaloo");
  };

  const btnRoomHandler = () => {
    socket.emit("createRoom");
  };

  return (
    <section id="center">
      <div>yeppers</div>
      <button onClick={btnHandler}>Ping Server</button>
      <button onClick={btnRoomHandler}>Create Room</button>

      <input
        value={roomIdInput}
        onChange={(event) => setRoomIdInput(event.target.value)}
        placeholder="Room ID"
        style={{ marginTop: "50px" }}
      />

      <button onClick={joinRoomHandler}>Join Room</button>

      {currentRoom && (
        <div>
          <h2>Current Room</h2>
          <p>Room ID: {currentRoom.id}</p>
          <p>Players: {currentRoom.players.length} / 2</p>

          <ul>
            {currentRoom.players.map((player, index) => (
              <li key={player.id}>
                Player {index + 1}: {player.id}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

export default App;
