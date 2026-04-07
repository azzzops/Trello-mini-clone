import { ArrowLeft } from "lucide-react";
import ToggleButton from "../component/toggle";
import List from "./list";
import { v7 as uuidV7 } from "uuid";
import { GlobalProvider } from "../GlobalContext";
import { useContext, useState } from "react";
import Item from "./card";
import { X, Check, Plus } from "lucide-react";
import EditSection from "./editlist";
import { CardOverlay } from "./overlays";
import { ListOverlay } from "./listcontainer";
import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  KeyboardSensor,
  TouchSensor,
  MouseSensor,
  closestCorners,
  rectIntersection,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { closestCenter } from "@dnd-kit/core";
export default function SelectedBoardView() {
  const [isCreatingCard, setIsCreatingCard] = useState(false);
  const [newCardTitle, setTitle] = useState("");
  const { selectedBoardId, setSelectedBoardId, useTrelloBoard, TrelloBoard } =
    useContext(GlobalProvider);
  const [isActiveDetails, setIsActive] = useState(null);
  const [activeList, setActiveList] = useState(null);
  const Board = TrelloBoard.find((board) => board.id == selectedBoardId);
  
  const sensors = useSensors(
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

if (!Board) return;


  return (
    <>
      <div className="flex flex-col min-h-screen">
        <nav className="md:px-20 px-5 sticky z-10 top-0 py-3 backdrop-blur-xl font-fontNavbar bg-toggle/30 backdrop-saturate-100 mask-linear-to-background border-b border-b-gray-700/30 flex shrink-0 items-center justify-between">
          <div className="flex items-center  text-black/90 dark:text-letters  border-gray-800/20 rounded-xl space-x-3">
            <button
              onClick={() => setSelectedBoardId(null)}
              className="dark:bg-[#1A1C20] cursor-pointer block transition-colors ease-in duration-150 hover:bg-gray-500/40 active:bg-gray-500/40 dark:hover:bg-[#22252a] bg-gray-500/20 p-2 rounded-xl"
            >
              <ArrowLeft height={18} width={18} strokeWidth={2.5} />
            </button>
            <h1 className="text-[16px] font-semibold max-w-40 md:max-w-xs  line-clamp-1 truncate">
              {Board.title}
            </h1>
          </div>
          <div>
            <ToggleButton />
          </div>
        </nav>

        <div className="md:px-20 px-5 flex overflow-x-auto overflow-y-hidden items-start scrollbar flex-1 min-h-0 gap-18 py-2 mt-5">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragCancel={() => {
              setIsActive(null);
              setActiveList(null);
            }}
            onDragOver={handleDragOver}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              strategy={horizontalListSortingStrategy}
              items={Board?.list}
            >
              {Board.list.map((b) => (
                <List
                  key={b.id}
                  title={b?.name}
                  cardLength={b?.cards.length}
                  listId={b.id}
                  boardId={Board.id}
                >
                  <SortableContext
                    strategy={verticalListSortingStrategy}
                    items={b?.cards}
                  >
                    <div className="flex flex-col gap-3 shrink-0">
                      {b?.cards.map((c) => (
                        <Item
                          key={c.id}
                          BoardId={Board.id}
                          listId={b.id}
                          CardId={c.id}
                          description={c?.description}
                          tags={c?.tags}
                          date={c?.date}
                          title={c?.title}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </List>
              ))}
            </SortableContext>

            <DragOverlay
              dropAnimation={{
                duration: 200,
                easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
              }}
            >
              {isActiveDetails ? (
                <CardOverlay
                  title={isActiveDetails.title}
                  description={isActiveDetails.description}
                  tags={isActiveDetails.tags}
                  date={isActiveDetails.date}
                />
              ) : activeList ? (
                <ListOverlay
                  title={activeList.name}
                  cardLength={activeList.cards.length}
                >
                  {activeList.cards.slice(0, 3).map((c) => (
                    <CardOverlay
                      key={c.id}
                      title={c.title}
                      description={c.description}
                      tags={c.tags}
                      date={c.date}
                    />
                  ))}
                </ListOverlay>
              ) : null}
            </DragOverlay>
          </DndContext>

          <div className="font-fontNavbar shrink-0 w-60">
            {isCreatingCard ? (
              <div className="flex flex-col gap-2">
                <input
                  autoFocus
                  type="text"
                  placeholder="List title..."
                  value={newCardTitle}
                  onChange={(e) => setTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleNewCard(Board.id);
                    if (e.key === "Escape") setIsCreatingCard(false);
                  }}
                  className="w-full px-3 py-2 text-sm rounded-xl
                   bg-white dark:bg-white/5
                   border border-gray-200 dark:border-white/10
                   text-gray-900 dark:text-gray-100
                   placeholder:text-gray-400 dark:placeholder:text-gray-600
                   focus:outline-none focus:ring-2 focus:ring-blue-500/40
                   transition-colors"
                />
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsCreatingCard(false)}
                    className="flex items-center justify-center w-7 h-7 rounded-lg
                     text-gray-400 hover:text-gray-700 dark:hover:text-gray-200
                     hover:bg-gray-100 dark:hover:bg-white/10
                     transition-colors"
                  >
                    <X size={14} strokeWidth={2.5} />
                  </button>
                  <button
                    onClick={() => handleNewCard(Board.id)}
                    className="flex items-center justify-center w-7 h-7 rounded-lg
                     bg-blue-500 hover:bg-blue-600
                     text-white transition-colors"
                  >
                    <Check size={14} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsCreatingCard(true)}
                className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl
                 text-sm text-gray-400 dark:text-gray-600
                 border border-dashed border-gray-300 dark:border-white/10
                 
                 transition-colors duration-150"
              >
                <Plus size={15} strokeWidth={2.5} />
                New List
              </button>
            )}
          </div>
        </div>
      </div>
      <EditSection />
    </>
  );

  function handleDragOver(event){
    const {active, over} = event;

    if(!over) return
    if(active.id == over.id) return;

    const sourceBoard = active.data.current.BoardId;
    const destinationBoard = over.data.current.BoardId;

      const sourceListId = active.data.current.ListId;
      const destListId = over.data.current.Type === "list" ? over.id : over.data.current.ListId;

      if(sourceListId == destListId) return;
    
    const sourceItem = TrelloBoard.find(board => board.id == sourceBoard)?.list.find(l => l.id == active.data.current.ListId)?.cards.find(c => c.id == active.id);
      if (!sourceItem) return;

    const cardHoveredOnDestination = TrelloBoard.find(board => board.id == destinationBoard)?.list.find(l => l.id == over.data.current.ListId);

    const destListContainer = TrelloBoard.find(board => board.id == destinationBoard)?.list.find(l => l.id == over.id);

    const sliceIndex = over.data.current.Type == "list" ? destListContainer.cards.length : cardHoveredOnDestination?.cards.findIndex(c => c.id == over.id) == -1 ? cardHoveredOnDestination.cards.length : cardHoveredOnDestination?.cards.findIndex(c => c.id == over.id);

    if(sourceBoard == destinationBoard){
      useTrelloBoard((boards) => {

        return boards.map(board => {

          if(board.id == sourceBoard){
            return {
              ...board, 
              list: [
                  ...board.list.map(l => {
                    if(l.id == active.data.current.ListId){   
               
                        return {
                          ...l,
                          cards: [
                            ...l.cards.filter(c => c.id !== sourceItem.id)
                          ]
                        }
                    }
                    
                    if(over.data.current.Type == "list"){
                      if(l.id === over.id){
                          return {
                            ...l, 
                            cards: [
                              ...l.cards.slice(0, sliceIndex),
                              sourceItem,
                              ...l.cards.slice(sliceIndex)
                            ]
                          }
                      }

                    }

                    if(over.data.current.Type == "card"){
                      if(l.id === over.data.current.ListId){
                          return {
                            ...l, 
                            cards: [
                              ...l.cards.slice(0, sliceIndex),
                              sourceItem,
                              ...l.cards.slice(sliceIndex)
                            ]
                          }
                      }
                    }

                    return l;
                  })
              ]
            }
          } else{
            return board
          }

        })


      })
    }
   

  }
  
  function handleDragEnd(event) {
    setIsActive(null);
    setActiveList(null);

    const { active, over } = event;

    if (!active || !over) return;

    if (active.data.current.Type !== over.data.current.Type) return;

    if (
      active.data.current.Type == "card" &&
      over.data.current.Type == "card"
    ) {
      const currentList = TrelloBoard
      .find(board => board.id == active.data.current.BoardId)
      ?.list.find(l => l.cards.some(c => c.id == active.id));

    if (!currentList) return;

    const oldIndex = currentList.cards.findIndex(c => c.id == active.id);
    const newIndex = currentList.cards.findIndex(c => c.id == over.id);
      useTrelloBoard((boards) => {
        return boards.map((board) => {
          if (board.id === active?.data.current.BoardId) {
            return {
              ...board,
              list: [
                ...board.list.map((l) => {
                  if (l.id == over?.data.current.ListId) {
                    return {
                      ...l,
                      cards: arrayMove(l.cards, oldIndex, newIndex),
                    };
                  } else {
                    return l;
                  }
                }),
              ],
            };
          } else {
            return board;
          }
        });
      });
    }

    if (
      active.data.current.Type == "list" ||
      over.data.current.Type == "list"
    ) {
      const oldIndex = TrelloBoard.find(
        (board) => board.id == active?.data.current.BoardId,
      )?.list.findIndex((l) => l.id == active?.id);
      const newIndex = TrelloBoard.find(
        (board) => board.id == over?.data.current.BoardId,
      )?.list.findIndex((l) => l.id == over?.id);

      useTrelloBoard((boards) => {
        return boards.map((board) => {
          if (board.id === active?.data.current.BoardId) {
            return {
              ...board,
              list: arrayMove(board.list, oldIndex, newIndex),
            };
          } else {
            return board;
          }
        });
      });
    }
  }

    function handleNewCard(id) {
    if (newCardTitle.trim() == "") return;
    useTrelloBoard((boards) => {
      return boards.map((board) => {
        if (board.id == id) {
          return {
            ...board,
            list: [
              ...board.list,
              { id: uuidV7(), name: newCardTitle, cards: [] },
            ],
          };
        } else {
          return board;
        }
      });
    });
    setIsCreatingCard(false);
    setTitle("");
  }
  

  function handleDragStart(event) {
    const { active, over } = event;

    if (active.data.current.Type === "card") {
      const details = TrelloBoard.find(
        (b) => b.id == active.data.current.BoardId,
      )
        ?.list.find((l) => l.id == active.data.current.ListId)
        ?.cards.find((c) => c.id == active.id);
      setIsActive(details);
      setActiveList(null);
    }

    if (active.data.current.Type === "list") {
      const list = TrelloBoard.find(
        (b) => b.id == active.data.current.BoardId,
      )?.list.find((l) => l.id == active.id);
      setActiveList(list);
      setIsActive(null);
    }
  }


}
