import { useDraggable } from "@dnd-kit/core";

interface Props {
  text: string;
  id: string;
  flippedProps: object;
}

function Tile({ text, id, flippedProps }: Props) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
  });
  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : "none",
    transitionProperty: `width`,
  };

  return (
    <button
      className={` aspect-square rounded-lg select-none
      bg-zinc-100 border-b-4 border-zinc-300 
      absolute place-self-center origin-center
      flex justify-center items-center text-center 
      ${transform ? "w-32" : "w-24"} ${transform ? "z-10" : "z-0"} 
      transition`}
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      {...flippedProps}
    >
      {text}
    </button>
  );
}

export default Tile;
