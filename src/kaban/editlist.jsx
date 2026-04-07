import {
  Dialog,
  DialogPanel,
  DialogTitle,
  DialogBackdrop,
  Description,
} from "@headlessui/react";
import { X, Tag, ChevronDown } from "lucide-react";
import { GlobalProvider } from "../GlobalContext";
import { useContext, useState } from "react";

const COLORS = [
  { name: "red", bg: "#ef4444" },
  { name: "orange", bg: "#f97316" },
  { name: "yellow", bg: "#eab308" },
  { name: "green", bg: "#22c55e" },
  { name: "blue", bg: "#3b82f6" },
  { name: "purple", bg: "#a855f7" },
  { name: "pink", bg: "#ec4899" },
];

export default function EditSection() {
  const { editOpenedCard, closeRename, editData, setEditData, handleSaveForCard } = useContext(GlobalProvider);

  const [tagName, setTagName] = useState("");
  const [tagColor, setTagColor] = useState("");

  function handleChange(e){
      const {name, value} = e.target;
      setEditData({...editData, [name]: value});
  }

  function handleTags(){
    if(tagName.trim() == "" || tagColor == "") return
    setEditData({...editData, tags: [...editData.tags, {name: tagName.trim(), bg: tagColor}]});
    setTagName("");
    setTagColor("")
    console.log(editData);
  }

  return (
    <>
      <Dialog open={editOpenedCard} onClose={closeRename}>
        <DialogBackdrop className="fixed inset-0 z-800 bg-black/40 dark:bg-black/70 backdrop-blur-[6px]" />

        <div className="fixed inset-0 w-screen z-1000 flex items-center justify-center">
          <DialogPanel
            transition
            className="max-w-md w-full ring-2 ring-surface-subtle/90 px-4 py-5 font-Poppins bg-surface-subtle dark:bg-surface/30 text-letters rounded-xl flex flex-col shrink-0 gap-2"
          >
            <div
              className="bg-surface-subtle self-end w-fit text-text-danger  hover:text-red-500 hover:bg-red-50
                   dark:hover:text-red-400 dark:hover:bg-red-500/10 cursor-pointer p-1 rounded-lg"
              onClick={closeRename}
            >
              <X size={18} strokeWidth={3} />
            </div>

            <DialogTitle className={"text-left font-Bricolage text-[20px]"}>
              Edit Card
            </DialogTitle>
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-1">
                <h1>Title</h1>
                <input
                  type="text"
                  onChange={handleChange}
                  value={editData.title}
                  placeholder="Card Title"
                  className="border-2 text-[14px] py-2 indent-2 focus:outline-none focus:ring-2 focus:ring-border-strong rounded-xl border-border-strong bg-input-bg placeholder-text-placeholder"
                  name="title"
                  id=""
                />
              </div>
              <div className="flex flex-col gap-1">
                <h1>Description</h1>
                <textarea
                  name="description"
                  placeholder="Card Description"
                  id=""
                  onChange={handleChange}
                  value={editData.description}
                  className="border-2 text-[14px] py-2 indent-2 focus:outline-none focus:ring-2 focus:ring-border-strong bg-input-bg placeholder-text-placeholder rounded-xl border-border-strong resize-none h-[4lh]"
                ></textarea>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
                  Due Date
                </label>
                <div className="relative w-full">
                    <input
                      type="date"
                      name="date"
                      onChange={handleChange}
                      value={editData.date}
                      min={new Date().toISOString().split("T")[0]}
                    className="border-2
                    [&::-webkit-calendar-picker-indicator]:opacity-0
                     [&::-webkit-calendar-picker-indicator]:cursor-pointer
                    w-full text-[14px] py-2 pr-2 indent-2 focus:outline-none focus:ring-2 focus:ring-border-strong bg-input-bg placeholder-text-placeholder rounded-xl border-border-strong"
                    />
                    <ChevronDown size={17} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <h1>Labels</h1>
                
                  <div className="flex gap-2 my-3 font-Poppins">
                    {
                      editData.tags.map(t => <div key={t.name} style={{backgroundColor: t.bg}} className="min-w-7 w-fit text-[11px] px-3 py-0.5 rounded-sm">{t.name}</div>)
                    }
                 
                </div>
                <div className="flex flex-col gap-2 items-center">
                  <input
                    type="text"
                    placeholder="Label Name"
                    className="border-2 w-full text-[14px] py-2 indent-2 focus:outline-none focus:ring-2 focus:ring-border-strong bg-input-bg placeholder-text-placeholder rounded-xl border-border-strong"
                    name=""
                    onChange={(e) => setTagName(e.target.value)}
                    value={tagName}
                    id=""
                  />
                  <div className="flex gap-3 self-end items-center">
                    <div className="flex gap-2">
                      {COLORS.map((c) => (
                        <div
                          key={c.name}
                          style={{ backgroundColor: c.bg }}
                          onClick={() => {setTagColor(c.bg)}}
                          className={`h-5 w-5 rounded-full ${tagColor == c.bg ? "ring-2 ring-letters" : ""} `}
                        ></div>
                      ))}
                    </div>
                    <button
                      onClick={handleTags}
                      className="flex items-center gap-1 px-3 py-2 rounded-xl text-[13px] font-medium text-14px cursor-pointer
                               bg-gray-100 dark:bg-white/10
                               text-gray-700 dark:text-gray-300
                               hover:bg-gray-200 dark:hover:bg-white/15
                               border border-gray-200 dark:border-white/10
                               transition-colors"
                    >
                      <Tag size={14} />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="gap-3 grid grid-cols-1 md:grid-cols-2">
                <button
                  onClick={closeRename}
                  className="px-4 py-2 text-sm font-medium rounded-xl cursor-pointer
                         text-gray-500 dark:text-gray-400
                         hover:bg-gray-100 dark:hover:bg-white/10
                         border border-gray-200 dark:border-white/10
                         transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveForCard}
                  className="px-4 py-2 text-sm font-semibold rounded-xl cursor-pointer
                         bg-gray-900 dark:bg-white
                         text-white dark:text-gray-900
                         hover:bg-gray-700 dark:hover:bg-gray-100
                         transition-colors"
                >
                  Save changes
                </button>
              </div>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}
