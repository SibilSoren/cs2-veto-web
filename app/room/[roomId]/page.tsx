"use client";
import ImageCard from "@/components/custom/ImageCard";
import { Button } from "@/components/ui/button";
import { globalTeamName } from "@/store/app-store";
import socket from "@/utils/socket";
import { useAtom } from "jotai";
import { Copy } from "lucide-react";

import { useState, useEffect } from "react";

interface VetoedMap {
  map: string;
  action: "ban" | "pick";
  teamName: string;
}

const maps = [
  "Dust2",
  "Inferno",
  "Mirage",
  "Nuke",
  "Overpass",
  "Vertigo",
  "Anubis",
];

const MAPS = [
  {
    name: "Dust2",
    imgUrl: "https://liquipedia.net/commons/images/d/d7/CS2_Dust_2_A_Site.jpg",
    imgIcon: "",
  },
  {
    name: "Inferno",
    imgUrl:
      "https://liquipedia.net/commons/images/f/fb/De_infernoCS2BSite.jpeg",
    imgIcon: "",
  },
  {
    name: "Mirage",
    imgUrl:
      "https://liquipedia.net/commons/images/c/cd/CS2_Mirage_A_site_behind_triple.jpg",
    imgIcon: "",
  },
  {
    name: "Nuke",
    imgUrl: "https://liquipedia.net/commons/images/f/f5/CS2_Nuke_Outside.jpeg",
    imgIcon: "",
  },
  {
    name: "Ancient",
    imgUrl: "https://liquipedia.net/commons/images/5/56/AncientASite.jpg",
    imgIcon: "",
  },
  {
    name: "Anubis",
    imgUrl: "https://liquipedia.net/commons/images/3/39/CS2AnubisWater.jpg",
    imgIcon: "",
  },
  {
    name: "Vertigo",
    imgUrl: "https://liquipedia.net/commons/images/d/d4/CS2VertigoASite.jpeg",
    imgIcon: "",
  },
];
const Room = ({ params }: { params: { roomId: string } }) => {
  const [vetoRound, setVetoRound] = useState<number>(1);
  const [currentRoom, setCurrentRoom] = useState<string | null>(params.roomId);
  const [, setAvailableMaps] = useState<string[]>(maps);
  const [teamName] = useAtom(globalTeamName);
  const [, setTurnMessage] = useState<string>("");
  const [vetoedMaps, setVetoedMaps] = useState<VetoedMap[]>([]);
  const [, setDeciderMap] = useState<string>("");
  useEffect(() => {
    // Handle room creation
    // socket.on("roomCreated", (createdRoomID: string) => {
    //   console.log("Room created with ID:", createdRoomID);
    //   setCurrentRoom(createdRoomID);
    // //   setIsRoomCreator(true);
    //   setTeam("Team A"); // Assign Team A to the room creator
    // });

    // Handle starting the veto
    socket.on("startVeto", (maps: string[], roomId: string) => {
      console.log("Veto started, available maps:", maps);
      if (!currentRoom) {
        setCurrentRoom(roomId);
      }
      setAvailableMaps(maps);
      setTurnMessage(`${teamName} bans a map`);
    });

    // Handle veto updates
    socket.on("mapVetoUpdate", ({ map, action, teamName }: VetoedMap) => {
      setVetoedMaps((prev) => [...prev, { map, action, teamName }]);
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

  const vetoMap = (map: string): void => {
    console.log("sada", map);
    if (currentRoom) {
      socket.emit("vetoMap", currentRoom, map, teamName);
    }
  };
  console.log(vetoedMaps);
  const copyRoomId = () => {
    navigator.clipboard.writeText(params.roomId);
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const vetoData = (mapName: string): { action: string; teamName: string } => {
    for (const item of vetoedMaps) {
      if (item.map === mapName && item.action === "ban") {
        return { action: item.action, teamName: item.teamName };
      }
      if (item.map === mapName && item.action === "pick") {
        return { action: item.action, teamName: item.teamName };
      }
    }
    return { action: "", teamName: "" };
  };
  return (
    <div className="mx-10 my-10">
      <h2 className="font-bold flex gap-3 items-center">
        Room ID: <span className="text-orange-600">{params.roomId}</span>
        <Button variant={"ghost"} onClick={copyRoomId}>
          <Copy size={15} />
        </Button>
      </h2>
      <div></div>
      <div className="">
        <h3>Maps</h3>
        <div className="grid grid-cols-7 gap-4">
          {MAPS.map((map) => (
            <ImageCard
              key={map.name}
              name={map.name}
              imgUrl={map.imgUrl}
              vetoData={vetoData(map.name)}
              vetoMap={vetoMap}
            />
          ))}
        </div>

        {/* <ul>
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
        </ul> */}
      </div>
    </div>
  );
};

export default Room;
