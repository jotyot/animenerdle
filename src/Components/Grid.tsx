import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import Tile from "./Tile";
import TileHolder from "./TileHolder";
import { useState } from "react";
import { Flipped, Flipper } from "react-flip-toolkit";
import { snapCenterToCursor } from "@dnd-kit/modifiers";
import Draggable from "./Draggable";
interface Props {}

function Grid({}: Props) {
  const defaultTiles = Array(16)
    .fill("Box")
    .map((v, i) => (
      <Flipped key={`drag ${i}`} flipId={`drag ${i}`}>
        {(flippedProps) => (
          <Draggable id={`drag ${i}`}>
            <Tile text={`${v} ${i}`} flippedProps={flippedProps} />
          </Draggable>
        )}
      </Flipped>
    ));
  const [tiles, setTiles] = useState(defaultTiles);
  const [activeId, setActiveId] = useState<undefined | string>(undefined);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    const drag = tiles.findIndex((tile) => tile.key == active.id);
    const drop = over ? parseInt(over.id.toString().split(" ")[1]) : drag;

    const swap = tiles.slice();
    [swap[drop], swap[drag]] = [swap[drag], swap[drop]];
    setActiveId(undefined);
    setTiles(swap);
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id.toString());
    setTiles(tiles.slice());
  }

  return (
    <div className=" w-full flex justify-center mt-44 ">
      <Flipper flipKey={tiles}>
        <div className=" grid grid-rows-4 grid-cols-4 gap-3 ">
          <DndContext
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            modifiers={[snapCenterToCursor]}
          >
            {Array(16)
              .fill(0)
              .map((_v, i) => (
                <TileHolder id={`drop ${i}`} key={`drop ${i}`}>
                  {activeId !== tiles[i].key ? tiles[i] : undefined}
                </TileHolder>
              ))}
            <Flipped flipId={activeId}>
              {(flippedProps) =>
                activeId ? (
                  <DragOverlay wrapperElement="button">
                    <Tile
                      text={`Box ${activeId.split(" ")[1]}`}
                      isDragging
                      flippedProps={flippedProps}
                    ></Tile>
                  </DragOverlay>
                ) : undefined
              }
            </Flipped>
          </DndContext>
        </div>
      </Flipper>
    </div>
  );
}

export default Grid;
