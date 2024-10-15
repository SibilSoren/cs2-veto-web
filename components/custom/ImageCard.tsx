import Image from "next/image";
import React from "react";

const ImageCard = ({
  name,
  imgUrl,
  vetoData,
  vetoMap,
}: {
  name: string;
  imgUrl: string;
  vetoData: { action: string; teamName: string };
  vetoMap: (name: string) => void;
}) => {
  console.log("vetoData", vetoData);
  return (
    <div
      className={`h-96  transition-all ease-in-out delay-150 relative ${
        vetoData.action === "ban" || vetoData.action === "pick"
          ? "cursor-not-allowed"
          : "cursor-pointer"
      } `}
      onClick={() => vetoMap(name)}
    >
      {/* <Image src={imgUrl} alt={name} width={30} height={400} /> */}
      <Image
        src={imgUrl}
        alt={name}
        className="object-cover h-full w-96 "
        width={0}
        height={0}
        sizes="100vw"
      />
      <h2 className="text-center text-xl font-medium p-2">{name}</h2>
      {vetoData.action === "ban" || vetoData.action === "pick" ? (
        <div
          className={`absolute top-0 h-full w-full text- ${
            vetoData.action === "ban"
              ? "bg-red-600 opacity-40 cursor-not-allowed "
              : ""
          } ${
            vetoData.action === "pick"
              ? "bg-green-600 opacity-40 cursor-not-allowed "
              : ""
          }`}
        >
          {/* {vetoData.teamName}{" "}
          {vetoData.action === "ban" ? "Banned this map" : ""}{" "}
          {vetoData.action === "pick" ? "Picked this map" : ""} */}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default ImageCard;
