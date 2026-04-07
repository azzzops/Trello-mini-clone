import { Plus, Layout, Trash2 } from "lucide-react"
import TrelloNavBar from "./navbar"
import { useState, useContext } from "react"
import { GlobalProvider } from "../GlobalContext"
import { v7 as uuidV7 } from "uuid"

export default function Boards() {
  const { useTrelloBoard, TrelloBoard, openBoard } = useContext(GlobalProvider)

  const [creating, setCreating] = useState(false);
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  function ValidateInput(value){
    let error = "";

    if(value == ""){
      error += "This field is required";
      return error;
    } else{
      error = "";
    }

    return error;
  }

  function handleBlur(e){
    const {value} = e.target;
    const validate = ValidateInput(value.trim());
    setError(validate)
  }


  function handleChange(e) {
    setValue(e.target.value.trimStart())   
      const validate = ValidateInput(e.target.value);
      setError(validate)
  }

  function saveBoard() {
    if (value.trim() === "") return
    useTrelloBoard((boards) => [
      ...boards,
      {
        id: uuidV7(),
        title: value,
        date: Date.now(),
        list: [
          { id: uuidV7(), name: "To-do", cards: [] },
          { id: uuidV7(), name: "In Progress", cards: [] },
          { id: uuidV7(), name: "Done", cards: [] },
        ],
      },
    ])
    setValue("")
    setCreating(false)
  }

  function deleteBoard(id) {
    useTrelloBoard((boards) => boards.filter((b) => b.id !== id))
  }

  const hasBoards = TrelloBoard.length > 0

  return (
    <main>
      <TrelloNavBar />

      <div className="flex font-fontBoard text-letters max-w-7xl mx-auto mt-10 px-4 sm:px-6 lg:px-8 justify-between items-center">
        <div className="flex flex-col gap-0.5">
          <h1 className="font-semibold text-[17px] m-0">Your Boards</h1>
          <span className="text-xs text-gray-500">
            {TrelloBoard.length} board{TrelloBoard.length !== 1 ? "s" : ""}
          </span>
        </div>

        <button
          onClick={() => setCreating((v) => !v)}
          disabled={creating}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold
                     bg-letters text-primary cursor-pointer
                     hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed
                     transition-opacity duration-150"
        >
          <Plus size={16} strokeWidth={2.5} />
          New Board
        </button>
      </div>

 
 
      {creating && (
        <div className="px-4 sm:px-6 lg:px-8 mx-auto font-Poppins flex flex-col gap-2 max-w-7xl">
          <div className="font-Poppins flex gap-3 items-center mt-4">
              <input
                autoFocus
                type="text"
                placeholder="Board name..."
                value={value}
                onChange={handleChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveBoard()
                  if (e.key === "Escape") { setCreating(false); setValue("") }
                }}
                onBlur={(e) => {handleBlur(e)}}
                className={`flex-1 px-3 py-2 text-sm rounded-xl
                           bg-white dark:bg-white/5
                           border 
                           text-gray-900 dark:text-gray-100
                           placeholder:text-gray-400 dark:placeholder:text-gray-600
                           focus:outline-none focus:ring-2 ${error.trim() !== "" ? "focus:ring-text-danger border-text-danger dark:border-text-danger" : "focus:ring-blue-500/40 dark:border-white/10 border-gray-200"}
                           transition-colors invalid:ring-text-danger
                           `}
              />
          
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => { setCreating(false); setValue(""); setError("") }}
                className="px-3 py-2 text-sm font-medium rounded-xl
                           text-gray-500 dark:text-gray-400
                           hover:bg-gray-100 dark:hover:bg-white/10
                           transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={saveBoard}
                className="px-3 py-2 text-sm font-semibold rounded-xl
                           bg-letters text-primary cursor-pointer
                           hover:opacity-90 transition-opacity"
              >
                Save
              </button>
            </div>
          </div>
          <span className={`${error.trim() !== "" ? "text-text-danger inline" : "hidden"}`}>{error}</span>
        </div>
      )}


      {hasBoards ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5
                        gap-3 px-4 sm:px-6 lg:px-8 mt-8 max-w-7xl mx-auto">
          {TrelloBoard.map((board) => (
            <BoardView
              key={board.id}
              title={board.title}
              listLength={board.list.length}
              openBoard={() => openBoard(board.id)}
              deleteBoard={() => deleteBoard(board.id)}
              cardLength={board.list.reduce((a, b) => a + b.cards.length, 0)}
            />
          ))}
        </div>
      ) : (
        <div className="font-fontBoard flex flex-col items-center justify-center gap-4 mt-32 px-5">
          <div className="border border-dashed border-gray-300 dark:border-white/10 text-gray-400 dark:text-gray-600 p-4 rounded-2xl">
            <Layout size={28} />
          </div>
          <div className="text-center space-y-1">
            <p className="text-[16px] font-medium text-letters m-0">No boards yet</p>
            <p className="text-sm text-gray-500 dark:text-gray-600 m-0">
              Tap <span className="font-medium">New Board</span> to create your first one
            </p>
          </div>
        </div>
      )}
    </main>
  )
}

const BoardView = ({ title, cardLength, listLength, openBoard, deleteBoard }) => {
  return (
    <div
      onClick={openBoard}
      className="group flex items-center justify-between gap-3 px-3.5 py-3
                 bg-gray-50 dark:bg-white/5
                 border border-gray-200 dark:border-white/10
                 rounded-xl cursor-pointer font-fontBoard
                 hover:bg-gray-100 dark:hover:bg-white/10
                 transition-colors duration-150"
    >
      <div className="flex flex-col gap-0.5 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate m-0">
          {title}
        </p>
        <p className="text-xs text-gray-500 m-0">
          {cardLength} card{cardLength !== 1 ? "s" : ""} &nbsp;·&nbsp;{" "}
          {listLength} list{listLength !== 1 ? "s" : ""}
        </p>
      </div>

      <button
        onClick={(e) => { e.stopPropagation(); deleteBoard() }}
        className="flex items-center justify-center shrink-0 w-7 h-7 cursor-pointer rounded-lg
                   text-gray-300 dark:text-gray-600
                   hover:text-red-500 hover:bg-red-50
                   dark:hover:text-red-400 dark:hover:bg-red-500/10
                   transition-all duration-150 lg:opacity-0 group-hover:opacity-100 sm:opacity-100 group-focus-within:opacity-100"
      >
        <Trash2 size={14} />
      </button>
    </div>
  )
}