import { Colors, Borders } from "../Classes/Colors";

interface Props {
  text: string;
  colorID?: number;
  flippedProps?: object;
  isDragging?: boolean;
  glow?: boolean;
}

function Tile({
  text,
  colorID = -1,
  glow = false,
  flippedProps,
  isDragging = false,
}: Props) {
  const long = text.length > 35;
  const med = text.length > 20;

  return (
    <div
      className={` aspect-square rounded-lg select-none
      border-b-4 ${Colors[colorID + 1]} ${Borders[colorID + 1]}       
      absolute flex justify-center items-center lg:w-28 sm:w-24 xs:w-20
      text-center font-sans font-medium shadow-sm shadow-gray-400
      transition-[width,font-size,line-height]
      ${isDragging ? " scale-150" : " scale-100"} 
      ${
        long
          ? "lg:text-sm xs:text-xs px-1"
          : med
          ? "lg:text-base sm:text-sm xs:text-xs px-2"
          : "lg:text-lg sm:text-base xs:text-sm px-3"
      }
      ${colorID === -1 ? "text-slate-700" : "text-slate-100"}`}
      {...flippedProps}
    >
      {glow && (
        <div
          className={`-inset-1 absolute rounded-lg aspect-square border-amber-200 blur-sm
          ${colorID === -1 ? "border-4" : "border-[6px]"} `}
        />
      )}
      {text}
    </div>
  );
}

export default Tile;
