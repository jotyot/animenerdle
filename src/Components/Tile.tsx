interface Props {
  text: string;
  colorID?: number;
  flippedProps?: object;
  isDragging?: boolean;
  glow?: boolean;
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

function Tile({
  text,
  colorID = -1,
  glow = false,
  flippedProps,
  isDragging = false,
}: Props) {
  const long = text.length > 40;
  const med = text.length > 20;

  return (
    <div
      className={` aspect-square rounded-lg select-none
      border-b-4 ${Colors[colorID + 1]} ${Borders[colorID + 1]}       
      absolute flex justify-center items-center w-24
      text-center font-sans font-medium shadow-sm shadow-gray-400
      ${isDragging ? " scale-150" : " scale-100"} 
      ${long ? "text-xs px-1" : med ? "text-sm px-2" : "text-base px-3"}
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
