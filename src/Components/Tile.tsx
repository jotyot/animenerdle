import { useDraggable } from "@dnd-kit/core";

interface Props {
  text: string;
  id: string;
  flippedProps: object;
}

function Tile({ text, id, flippedProps }: Props) {
  const { isDragging, attributes, listeners, setNodeRef, transform } =
    useDraggable({
      id: id,
    });
  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : "none",
  };

  return (
    <div
      className={` aspect-square rounded-lg select-none
      bg-zinc-100 border-b-4 border-zinc-300 
      absolute 
      flex justify-center items-center text-center 
      ${isDragging ? "w-32 z-10" : "w-24 z-0"}
      transition-[width] `}
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      {...flippedProps}
    >
      {text}
    </div>
  );
}

export default Tile;
