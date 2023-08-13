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
  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;
  // : {
  //     transitionProperty: "all",
  //     transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
  //     transitionDuration: "150ms",
  //   };

  return (
    <button
      className=" aspect-square w-24 rounded-lg select-none
      bg-zinc-100 border-b-4 border-zinc-300 
      flex justify-center items-center text-center "
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