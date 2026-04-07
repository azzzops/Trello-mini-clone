import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { EllipsisVertical, Pencil, Trash2, GripVertical } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GlobalProvider } from "../GlobalContext";
import { forwardRef, useContext } from "react";

export default function Item({
  title,
  description,
  tags,
  date,
  CardId,
  BoardId,
  listId,
}) {
  const { onRename, closeRename, handleEdit, deleteCard } =
    useContext(GlobalProvider);

  const {
    transform,
    transition,
    setActivatorNodeRef,
    setNodeRef,
    listeners,
    attributes,
    isDragging,
  } = useSortable({
    id: CardId,
    data: { ListId: listId, BoardId: BoardId, Type: "card" },
  });

  const styles = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? "0.2" : "1.0",
  };

  return (
    <div
      ref={setNodeRef}
      style={styles}
      {...attributes}
      {...listeners}
      className="w-60 text-letters cursor-grab active:cursor-grabbing bg-primary px-4 py-3 rounded-xl space-y-1.5"
    >
      <div className="flex items-center justify-between gap-2">
        <div
          className="cursor-grab active:cursor-grabbing touch-none text-gray-400 
                     dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 
                     shrink-0 -ml-1 transition-colors"
        >
          <GripVertical size={15} />
        </div>

        <h2 className="text-[15px] font-medium line-clamp-1 truncate flex-1 m-0">
          {title}
        </h2>

        <Menu as="div" className="relative shrink-0">
          <MenuButton
            className="flex items-center justify-center cursor-pointer w-6 h-6 rounded-md
                                  text-gray-400 dark:text-gray-600
                                  hover:bg-black/5 dark:hover:bg-white/10
                                  hover:text-gray-700 dark:hover:text-gray-300
                                  transition-colors duration-150"
          >
            <EllipsisVertical size={15} />
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
                onClick={() => handleEdit(CardId, BoardId, listId)}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-lg
                           text-gray-700 dark:text-gray-300
                           data-focus:bg-gray-100 cursor-pointer dark:data-focus:bg-white/10
                           data-focus:outline-hidden transition-colors"
              >
                <Pencil size={13} className="shrink-0 text-gray-400" />
                Rename
              </button>
            </MenuItem>

            <div className="my-1 border-t border-gray-100 dark:border-white/10" />

            <MenuItem>
              <button
                onClick={() => deleteCard(CardId, BoardId, listId)}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-lg
                           text-red-500 dark:text-red-400
                           data-focus:bg-red-50 cursor-pointer dark:data-focus:bg-red-500/10
                           data-focus:outline-hidden transition-colors"
              >
                <Trash2 size={13} className="shrink-0" />
                Delete
              </button>
            </MenuItem>
          </MenuItems>
        </Menu>
      </div>

      {description && (
        <p className="line-clamp-2 text-[12px] text-gray-500 dark:text-gray-400 m-0">
          {description}
        </p>
      )}

      {tags?.length > 0 && (
        <div className="flex my-2 flex-wrap gap-2">
          {tags.map((tag, i) => (
            <Tag key={i} name={tag.name} color={tag.bg} />
          ))}
        </div>
      )}

      {date && (
        <p className="text-[11px] text-gray-400 dark:text-gray-600 m-0">
          {date}
        </p>
      )}
    </div>
  );
}

export const Tag = ({ name, color }) => {
  return (
    <span
      style={{ backgroundColor: color }}
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium`}
    >
      {name}
    </span>
  );
};
