"use client";
import { CreateRoomDialog } from "@/components/custom/CreateRoomDialog";
import { ModeToggle } from "@/components/custom/DarkModeToggle";
import { JoinRoomDialog } from "@/components/custom/JoinRoomDialog";
import NavBar from "@/components/custom/navbar";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative">
      <NavBar />
      <ModeToggle />
      {/* CS2 Map Veto */}
      {/* <MapSelector /> */}
      <div className="flex justify-center gap-10">
        <Button onClick={() => setIsOpen(true)}>Create Room</Button>
        <JoinRoomDialog />
      </div>
      <CreateRoomDialog open={isOpen} setOpen={setIsOpen} />
    </div>
  );
}
