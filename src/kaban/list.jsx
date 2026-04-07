import { Plus, Ellipsis, Pencil, Trash2, X, Check } from "lucide-react"
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react"
import { useSortable } from "@dnd-kit/sortable"
import { useState, useContext } from "react"
import { GlobalProvider } from "../GlobalContext"
import { v7 as uuidV7 } from "uuid"
import { CSS } from "@dnd-kit/utilities"
export default function List({ title, children, cardLength, boardId, listId, onRename, onDelete }) {
  const { useTrelloBoard, TrelloBoard } = useContext(GlobalProvider)



  const [addCard, setAddCard] = useState(false)
  const [cardTitle, setCardTitle] = useState("")
  const {setNodeRef, transform, transition, listeners, attributes, isDragging, setActivatorNodeRef} = useSortable({
    id: listId,
    data: {
      Type: "list",
      BoardId: boardId
    }
  })
  function handleAddCard(boardId, listId) {
    if (cardTitle.trim() === "") return

    const board = TrelloBoard.find((b) => b.id === boardId)
    const list = board?.list.find((l) => l.id === listId)
    if (!board || !list) return

    useTrelloBoard((boards) =>
      boards.map((b) => {
        if (b.id !== board.id) return b
        return {
          ...b,
          list: b.list.map((l) => {
            if (l.id !== list.id) return l
            return {
              ...l,
              cards: [
                ...l.cards,
                { id: uuidV7(), date: null, description: "", title: cardTitle, tags: [] },
              ],
            }
          }),
        }
      })
    )

    setCardTitle("")
    setAddCard(false)
  }

  function handleKeyDown(e) {
    e.stopPropagation();
    if (e.key === "Enter") handleAddCard(boardId, listId)
    if (e.key === "Escape") setAddCard(false)
  }



   const styles = {
     transform: CSS.Transform.toString(transform),
     transition,
     opacity: isDragging ? 0.1 : 1
   }

  return (
    <div  style={styles} ref={setNodeRef} {...listeners} className="w-60 flex flex-col touch-none cursor-grab active:cursor-grabbing gap-4 font-Poppins shrink-0">

      {/* List header */}
      <div className="flex items-center justify-between text-letters">
        <div className="flex items-center gap-2 min-w-0">
          <h2 className="text-[15px] font-semibold truncate m-0">{title}</h2>
          <span className="text-[12px] text-gray-400 dark:text-gray-600 bg-gray-100 dark:bg-white/10 
                           px-1.5 py-0.5 rounded-md font-medium shrink-0">
            {cardLength}
          </span>
        </div>

        <Menu as="div" className="relative shrink-0">
          <MenuButton className="flex items-center justify-center w-7 h-7 rounded-lg
                                  text-gray-400 dark:text-gray-600
                                  hover:bg-black/5 dark:hover:bg-white/10
                                  hover:text-gray-700 dark:hover:text-gray-300
                                  transition-colors duration-150">
            <Ellipsis size={16} />
          </MenuButton>

          <MenuItems
            transition
            className="absolute right-0 z-50 mt-1 w-44 p-1
                       bg-white dark:bg-[#1e1e2e]
                       border border-gray-200 dark:border-white/10
                       rounded-xl shadow-lg outline-none
                       transition data-closed:scale-95 data-closed:opacity-0
                       data-enter:duration-100 data-enter:ease-out
                       data-leave:duration-75 data-leave:ease-in"
          >
            <MenuItem>
              <button
                onClick={onRename}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-lg
                           text-gray-700 dark:text-gray-300
                           data-focus:bg-gray-100 cursor-pointer  dark:data-focus:bg-white/10
                           data-focus:outline-hidden transition-colors"
              >
                <Pencil size={13} className="shrink-0 text-gray-400" />
                Rename
              </button>
            </MenuItem>

            <div className="my-1 border-t border-gray-100 dark:border-white/10" />

            <MenuItem>
              <button
                onClick={onDelete}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-lg
                           text-red-500 dark:text-red-400
                           data-focus:bg-red-50 dark:data-focus:bg-red-500/10
                           data-focus:outline-hidden  cursor-pointer transition-colors"
              >
                <Trash2 size={13} className="shrink-0" />
                Delete list
              </button>
            </MenuItem>
          </MenuItems>
        </Menu>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-2" >
        {cardLength == 0 && 
        <div {...attributes} ref={setActivatorNodeRef} className="flex items-center justify-center gap-1.5 w-full py-10 rounded-xl
                     text-sm text-gray-400 dark:text-gray-600
                     border border-dashed border-gray-300 dark:border-white/10
                     
                     transition-colors duration-150" >
          <h1>drop item here</h1> 
        </div>}
        {children}
        
        </div>

      {/* Add card */}
      {addCard ? (
        <div className="flex flex-col gap-2">
          <input
            autoFocus
            type="text"
            placeholder="Card title..."
            value={cardTitle}
            onChange={(e) => setCardTitle(e.target.value)}
            onKeyDown={handleKeyDown}
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
              onClick={() => setAddCard(false)}
              className="flex items-center justify-center w-7 h-7 rounded-lg
                         text-gray-400 hover:text-gray-700 dark:hover:text-gray-200
                         hover:bg-gray-100 dark:hover:bg-white/10
                         transition-colors"
            >
              <X size={14} strokeWidth={2.5} />
            </button>
            <button
              onClick={() => handleAddCard(boardId, listId)}
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
          onClick={() => setAddCard(true)}
          className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl
                     text-sm text-gray-400 dark:text-gray-600
                     border border-dashed border-gray-300 dark:border-white/10
                     hover:border-gray-400 dark:hover:border-white/20
                     hover:text-gray-600 dark:hover:text-gray-400
                     transition-colors duration-150"
        >
          <Plus size={15} strokeWidth={2.5} />
          Add card
        </button>
      )}
    </div>
  )
}