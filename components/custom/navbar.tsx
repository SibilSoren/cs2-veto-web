import Image from "next/image";
import React from "react";
import CS2 from "../../assets/images/c2Logo.png";

const NavBar = () => {
  return (
    <div className="flex flex-col items-center my-8">
      <Image src={CS2} alt="CS2" width={150} />
      <h1 className="text-2xl m-4 font-bold">CS2 Map Veto Tool</h1>
    </div>
  );
};

export default NavBar;
