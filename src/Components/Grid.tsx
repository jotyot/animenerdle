import { DndContext, DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import Tile from "./Tile";
import TileHolder from "./TileHolder";
import { useState } from "react";
import { Flipped, Flipper } from "react-flip-toolkit";
import Draggable from "./Draggable";
import DraggingTile from "./DraggingTile";
interface Props {}

function Grid({}: Props) {
  const [animeOrder, setAnimeOrder] = useState([
    "Noragami",
    "My Hero Academia Season 3",
    "Fullmetal Alchemist",
    "Mob Psycho 100 II",
    "Charlotte",
    "Love, Chunibyo & Other Delusions!: Heart Throb",
    "High School DxD New",
    "Haikyu!! 2nd Season",
    "Kuroko's Basketball 3",
    "Dr. Stone",
    "Fairy Tail",
    "Great Teacher Onizuka",
    "Soul Eater",
    "Clannad: After Story",
    "Code Geass: Lelouch of the Rebellion R2",
    "Attack on Titan Season 3 Part 2",
  ]);
  const [activeId, setActiveId] = useState<undefined | string>(undefined);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    const drag = tiles.findIndex((tile) => tile.key === active.id);
    const drop = over ? parseInt(over.id.toString().split(" ")[1]) : drag;

    const swap = animeOrder.slice();
    [swap[drop], swap[drag]] = [swap[drag], swap[drop]];
    setActiveId(undefined);
    setAnimeOrder(swap);
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id.toString());
    setAnimeOrder(animeOrder.slice());
  }

  const tiles = animeOrder.map((anime) => (
    <Flipped key={anime} flipId={anime}>
      {(flippedProps) => (
        <Draggable id={anime}>
          <Tile text={anime} flippedProps={flippedProps} />
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
