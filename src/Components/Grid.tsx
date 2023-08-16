import { DndContext, DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import Tile from "./Tile";
import TileHolder from "./TileHolder";
import { useRef, useState } from "react";
import { Flipped, Flipper } from "react-flip-toolkit";
import Draggable from "./Draggable";
import DraggingTile from "./DraggingTile";
import { Puzzle, PuzzleTemplate } from "../Classes/Puzzle";

interface Props {
  puzzleTemplate: PuzzleTemplate;
}

function Grid({ puzzleTemplate }: Props) {
  const puzzle = useRef(new Puzzle(puzzleTemplate));

  const [tileData, setTilleData] = useState(puzzle.current.getTileData());
  const [activeId, setActiveId] = useState<undefined | string>(undefined);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    const drag = tiles.findIndex((tile) => tile.key === active.id);
    const drop = over ? parseInt(over.id.toString().split(" ")[1]) : drag;

    puzzle.current.SwapEntries(drag, drop);
    setActiveId(undefined);
    setTilleData(puzzle.current.getTileData());
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id.toString());
  }

  const tiles = tileData.map((tile) => (
    <Flipped key={tile.name} flipId={tile.name}>
      {(flippedProps) => (
        <Draggable id={tile.name}>
          <Tile
            text={tile.name}
            flippedProps={flippedProps}
            colorID={tile.colorID}
          />
        </Draggable>
      )}
    </Flipped>
  ));

  return (
    <div className="w-full flex justify-center mt-44">
      <Flipper flipKey={tiles}>
        <div className="grid grid-rows-4 grid-cols-4 gap-3 bg-stone-200 p-6 rounded-lg">
          <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            {[...Array(16)].map((_v, i) => (
              <TileHolder id={`drop ${i}`} key={`drop ${i}`}>
                {tiles[i]}
              </TileHolder>
            ))}
            {activeId && <DraggingTile id={activeId} />}
          </DndContext>
        </div>
      </Flipper>
    </div>
  );
}

export default Grid;
