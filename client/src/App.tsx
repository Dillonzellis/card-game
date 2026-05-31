import { useEffect } from "react";
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
  useEffect(() => {
    const handleConnect = () => {
      console.log("connected to server", socket.id);
    };

    const handlePongFromServer = (msg: string) => {
      console.log("message from server:", msg);
    };

    const handleRoomState = (room: Room) => {
      console.log("room state from server", room);
    };

    socket.on("connect", handleConnect);
    socket.on("pongFromServer", handlePongFromServer);
    socket.on("roomState", handleRoomState);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("pongFromServer", handlePongFromServer);
      socket.off("roomState", handleRoomState);
    };
  }, []);

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
    </section>
  );
}

export default App;
