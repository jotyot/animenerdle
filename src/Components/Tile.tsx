interface Props {
  text: string;
  flippedProps?: object;
  isDragging?: boolean;
}

function Tile({ text, flippedProps, isDragging = false }: Props) {
  return (
    <div
      className={` aspect-square rounded-lg select-none
      bg-zinc-100 border-b-4 border-zinc-300 
      absolute flex justify-center items-center text-center 
      shadow-md
      ${isDragging ? "w-32 text-lg" : "w-24 text-sm"}`}
      {...flippedProps}
    >
      {text}
    </div>
  );
}

export default Tile;
