import { DragOverlay } from "@dnd-kit/core";
import { Flipped } from "react-flip-toolkit";
import Tile from "./Tile";

interface Props {
  id: string;
}

/**
 * A \<Flipped> \<DragOverlay> of a Tile
 * @param id flipId and the tile's text
 */
function DraggingTile({ id }: Props) {
  return (
    <Flipped flipId={id}>
      {(flippedProps) => (
        <DragOverlay wrapperElement="button">
          <Tile text={id} isDragging flippedProps={flippedProps} />
        </DragOverlay>
      )}
    </Flipped>
  );
}

export default DraggingTile;
