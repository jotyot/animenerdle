interface Props {
  text: string;
  colorID?: number;
  flippedProps?: object;
  isDragging?: boolean;
}

const Colors = [
  "bg-stone-100",
  "bg-red-500",
  "bg-orange-500",
  "bg-cyan-500",
  "bg-fuchsia-600",
  "bg-emerald-500",
];

const Borders = [
  "border-stone-300",
  "border-red-700",
  "border-orange-700",
  "border-cyan-700",
  "border-fuchsia-800",
  "border-emerald-700",
];

function Tile({ text, colorID = -1, flippedProps, isDragging = false }: Props) {
  const long = text.length > 40;
  const med = text.length > 30;

  return (
    <div
      className={` aspect-square rounded-lg select-none
      border-b-4 ${Colors[colorID + 1]} ${Borders[colorID + 1]}       
      absolute flex justify-center items-center w-24
      text-center shadow-md font-sans font-medium
      ${isDragging ? " scale-150" : " scale-100 "} 
      ${long ? "text-xs px-1" : med ? "text-sm px-2" : "text-base px-3"}
      ${colorID === -1 ? "text-slate-700" : "text-slate-100"}`}
      {...flippedProps}
    >
      {text}
    </div>
  );
}

export default Tile;
