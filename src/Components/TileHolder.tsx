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
    <div className="aspect-square sm:w-24 xs:w-20" ref={setNodeRef}>
      {children}
    </div>
  );
}

export default TileHolder;
