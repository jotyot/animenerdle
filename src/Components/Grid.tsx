import { DndContext, DragEndEvent } from "@dnd-kit/core";
import Tile from "./Tile";
import TileHolder from "./TileHolder";
import { useState } from "react";
import { Flipped, Flipper } from "react-flip-toolkit";
import { snapCenterToCursor } from "@dnd-kit/modifiers";
interface Props {}

function Grid({}: Props) {
  const defaultTiles = Array(16)
    .fill("Box")
    .map((v, i) => (
      <Flipped key={`drag ${i}`} flipId={`drag ${i}`}>
        {(flippedProps) => (
          <Tile
            text={`${v} ${i}`}
            id={`drag ${i}`}
            flippedProps={flippedProps}
          />
        )}
      </Flipped>
    ));
  const [tiles, setTiles] = useState(defaultTiles);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    const drag = tiles.findIndex((tile) => tile.key == active.id);
    const drop = over ? parseInt(over.id.toString().split(" ")[1]) : drag;

    const swap = tiles.slice();
    [swap[drop], swap[drag]] = [swap[drag], swap[drop]];
    setTiles(swap);
  }

  return (
    <div className=" w-full flex justify-center mt-44 ">
      <Flipper flipKey={tiles}>
        <div className=" grid grid-rows-4 grid-cols-4 gap-3 ">
          <DndContext
            onDragEnd={handleDragEnd}
            modifiers={[snapCenterToCursor]}
          >
            {Array(16)
              .fill(0)
              .map((_v, i) => (
                <TileHolder id={`drag ${i}`} key={`drag ${i}`}>
                  {tiles[i]}
                </TileHolder>
              ))}
          </DndContext>
        </div>
      </Flipper>
    </div>
  );
}

export default Grid;
