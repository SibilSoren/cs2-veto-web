"use client";
import { useState, useEffect } from "react";
import socket from "../../utils/socket";

interface VetoedMap {
  map: string;
  action: "ban" | "pick";
}

const maps = ["Dust2", "Inferno", "Mirage", "Nuke", "Overpass", "Vertigo"];

export default function Home() {
  const [roomID, setRoomID] = useState<string>("");
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);
  const [availableMaps, setAvailableMaps] = useState<string[]>(maps);
  const [vetoedMaps, setVetoedMaps] = useState<VetoedMap[]>([]);
  const [, setIsRoomCreator] = useState<boolean>(false);
  const [vetoRound, setVetoRound] = useState<number>(1);
  const [turnMessage, setTurnMessage] = useState<string>("");
  const [deciderMap, setDeciderMap] = useState<string>("");
  const [team, setTeam] = useState<string>(""); // Team assignment

  useEffect(() => {
    // Handle room creation
    socket.on("roomCreated", (createdRoomID: string) => {
      console.log("Room created with ID:", createdRoomID);
      setCurrentRoom(createdRoomID);
      setIsRoomCreator(true);
      setTeam("Team A"); // Assign Team A to the room creator
    });

    // Handle starting the veto
    socket.on("startVeto", (maps: string[], roomId: string) => {
      console.log("Veto started, available maps:", maps);
      if (!currentRoom) {
        setCurrentRoom(roomId);
      }
      setAvailableMaps(maps);
      setTurnMessage("Team A bans a map");
    });

    // Handle veto updates
    socket.on("mapVetoUpdate", ({ map, action }: VetoedMap) => {
      setVetoedMaps((prev) => [...prev, { map, action }]);
      setAvailableMaps((prev) => prev.filter((m) => m !== map));
      setVetoRound((prev) => prev + 1);

      if (vetoRound === 1 || vetoRound === 5) {
        setTurnMessage("Team B bans a map");
      } else if (vetoRound === 2 || vetoRound === 6) {
        setTurnMessage("Team A picks a map");
      } else if (vetoRound === 3) {
        setTurnMessage("Team B picks a map");
      } else {
        setTurnMessage("Team A bans a map");
      }
    });

    // Handle decider map
    socket.on("deciderMap", (map: string) => {
      setDeciderMap(map);
    });

    return () => {
      socket.off("roomCreated");
      socket.off("startVeto");
      socket.off("mapVetoUpdate");
      socket.off("deciderMap");
    };
  }, [vetoRound]);

  const createRoom = () => {
    const generatedRoomID =
      roomID || Math.random().toString(36).substring(2, 10);
    setRoomID(generatedRoomID);
    socket.emit("createRoom", generatedRoomID);
  };

  const joinRoom = () => {
    if (roomID.trim() !== "") {
      socket.emit("joinRoom", roomID);
      setTeam("Team B"); // Assign Team B to the user who joins
    } else {
      alert("Please enter a valid Room ID");
    }
  };

  const vetoMap = (map: string) => {
    if (currentRoom) {
      socket.emit("vetoMap", currentRoom, map);
    }
  };
  console.log(availableMaps, vetoedMaps);
  return (
    <div>
      <h1>CS2 Map Veto</h1>

      {!currentRoom && (
        <div>
          <input
            type="text"
            placeholder="Enter Room ID"
            value={roomID}
            onChange={(e) => setRoomID(e.target.value)}
          />
          <button onClick={createRoom}>Create Room</button>
          <button onClick={joinRoom}>Join Room</button>
        </div>
      )}

      {currentRoom && (
        <div>
          <h2>Room ID: {currentRoom}</h2>
          <p>Your Team: {team}</p>
          <p>{turnMessage}</p>

          {deciderMap ? (
            <div>
              <h2>Decider Map: {deciderMap}</h2>
            </div>
          ) : (
            <></>
          )}
          <div>
            <h3>Available Maps</h3>
            <ul>
              {availableMaps.map((map) => (
                <li key={map}>
                  {map} <button onClick={() => vetoMap(map)}>Veto</button>
                </li>
              ))}
            </ul>
            <h3>Vetoed Maps</h3>
            <ul>
              {vetoedMaps.map((veto) => (
                <li key={veto.map}>
                  {veto.map} - {veto.action}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
