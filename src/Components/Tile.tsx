interface Props {
  text: string;
  flippedProps?: object;
  isDragging?: boolean;
}

function Tile({ text, flippedProps, isDragging = false }: Props) {
  const long = text.length > 40;
  const med = text.length > 30;
  return (
    <div
      className={` aspect-square rounded-lg select-none
      bg-stone-100 border-b-4 border-stone-300 
      absolute flex justify-center items-center w-24
      text-center shadow-md font-sans p-1 font-medium
      ${isDragging ? " scale-150" : " scale-100 "} 
      ${long ? "text-xs" : med ? "text-sm" : "text-base"}`}
      {...flippedProps}
    >
      {text}
    </div>
  );
}

export default Tile;
