import { useDroppable } from "@dnd-kit/core";
import { ReactNode } from "react";

interface Props {
  id: string;
  children?: ReactNode;
}

function TileHolder({ id, children }: Props) {
  const { setNodeRef } = useDroppable({
    id: id,
  });
  return (
    <div
      className="aspect-square w-24 
      flex justify-center items-center"
      ref={setNodeRef}
    >
      {children}
    </div>
  );
}

export default TileHolder;
