import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
// import { useState } from "react";
import socket from "@/utils/socket";
import { useAtom } from "jotai";
import { globalRoomID, globalTeamName } from "@/store/app-store";
import { useRouter } from "next/navigation";

export function CreateRoomDialog({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const router = useRouter();
  const [teamName, setTeamName] = useAtom(globalTeamName);
  const [, setRoomID] = useAtom(globalRoomID);
  // const [, setBestOf] = useState("3");

  const createRoom = () => {
    const generatedRoomID = Math.random().toString(36).substring(2, 10);
    setRoomID(generatedRoomID);
    socket.emit("createRoom", generatedRoomID);
    router.push(`/room/${generatedRoomID}`);
  };

  // const fun = (e, value: string): void => {
  //   setBestOf(value);
  // };
  return (
    <Dialog open={open}>
      {/* <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger> */}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Map Veto Room</DialogTitle>
          <DialogDescription>
            Provide a team name and select the total maps to be played and click
            on create.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-5 items-center gap-4">
            <Label htmlFor="name" className="text-left col-span-2">
              Team Name
            </Label>
            <Input
              id="name"
              placeholder="Team A"
              className="col-span-3"
              onChange={(e) => setTeamName(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-5 items-center gap-4">
            <Label htmlFor="username" className="text-left col-span-2">
              Best of
            </Label>
            <RadioGroup
              defaultValue="3"
              className="col-span-3 mt-2"
              // onChange={fun}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1" id="r1" disabled />
                <Label htmlFor="r1">1</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="3" id="r2" />
                <Label htmlFor="r2">3</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
        <DialogFooter>
          <Button variant={"outline"} onClick={() => setOpen(false)}>
            Close
          </Button>
          <Button
            type="submit"
            disabled={teamName ? false : true}
            onClick={() => createRoom()}
          >
            Create Room
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
