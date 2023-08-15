interface Props {
  text: string;
  flippedProps?: object;
  isDragging?: boolean;
}

function Tile({ text, flippedProps, isDragging = false }: Props) {
  const long = text.length > 30;
  const med = text.length > 15;
  return (
    <div
      className={` aspect-square rounded-lg select-none
      bg-zinc-100 border-b-4 border-zinc-300 
      absolute flex justify-center items-center w-24
      text-center shadow-md font-sans p-1 font-medium
      ${isDragging ? " scale-150" : " scale-100 "} 
      ${long ? "text-xs" : med ? "text-sm" : "text-md"}`}
      {...flippedProps}
    >
      {text}
    </div>
  );
}

export default Tile;
