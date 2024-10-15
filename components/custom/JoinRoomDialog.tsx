"use client";
import { SendHorizonal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import socket from "@/utils/socket";
import { useAtom } from "jotai";
import { globalTeamName } from "@/store/app-store";

export function JoinRoomDialog() {
  const router = useRouter();
  const [roomID, setRoomID] = useState("");
  const [, setErrorMessage] = useState("");
  const [teamName, setTeamName] = useAtom(globalTeamName);

  useEffect(() => {
    socket.on("error", (message: string) => {
      setErrorMessage(message); // Set error message to be displayed
    });
  });
  const joinRoom = () => {
    console.log("??");
    if (roomID.trim() !== "") {
      setErrorMessage(""); // Clear previous error messages
      socket.emit("joinRoom", roomID);
      setTeamName(teamName); // Assign the custom Team B name to the user who joins
      console.log("??");
      // Listen for a successful room join to navigate
      socket.on("startVeto", () => {
        router.push(`/room/${roomID}`); // Navigate to the new room route
      });
    } else {
      alert("Please enter a valid Room ID");
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Join Room</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Join Map Veto Room</DialogTitle>
          <DialogDescription>Please enter the room id.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-5 items-center gap-4">
            <Label htmlFor="name" className="text-left col-span-2">
              Team Name
            </Label>
            <Input
              id="name"
              placeholder="Team B"
              className="col-span-3"
              onChange={(e) => setTeamName(e.target.value)}
            />
          </div>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-5 items-center gap-4">
              <Label htmlFor="link" className=" col-span-2">
                Room ID
              </Label>
              <Input
                id="link"
                placeholder="ABC123"
                className="col-span-3"
                onChange={(e) => setRoomID(e.target.value)}
              />
            </div>
            <Button
              type="submit"
              size="sm"
              className="px-3"
              onClick={() => joinRoom()}
              disabled={teamName && roomID ? false : true}
            >
              <span className="sr-only">Copy</span>
              <SendHorizonal />
            </Button>
          </div>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
