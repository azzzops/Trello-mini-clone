import { useContext, createContext, useState } from "react";
import { jsx } from "react/jsx-runtime";
import { useEffect } from "react";

export const GlobalProvider = createContext();

export default function MyProvider({ children }) {
  const [TrelloBoard, useTrelloBoard] = useState(() => {
    const kanban = localStorage.getItem("KanbanBoard");
    if (kanban) {
      return JSON.parse(kanban);
    } else {
      return [];
    }
  });

  const [selectedBoardId, setSelectedBoardId] = useState(null);
  const [editOpenedCard, setEditedOpenedCardState] = useState(false);
  function openBoard(id) {
    setSelectedBoardId(id);
  }

  function onRename() {
    setEditedOpenedCardState(true);
  }
  function closeRename() {
    setEditedOpenedCardState(false);
  }

  useEffect(() => {
    localStorage.setItem("KanbanBoard", JSON.stringify(TrelloBoard));
  }, [TrelloBoard]);

  const [editData, setEditData] = useState({
    id: "",
    title: "",
    description: "",
    tags: [],
  });
  const [editIds, setBoardId] = useState({
    boardId: null,
    listId: null,
    cardId: null,
  });

  function handleEdit(CardId, BoardId, listId) {
    setBoardId({ boardId: BoardId, listId: listId, cardId: CardId });
    const card = TrelloBoard.find((b) => b.id == BoardId)
      .list.find((l) => l.id == listId)
      .cards.find((c) => c.id == CardId);
    setEditData({
      id: card.id,
      date: card.date,
      title: card.title,
      description: card.description,
      tags: card.tags,
    });
    onRename();
  }

  function deleteCard(CardId, BoardId, listId) {
    useTrelloBoard((boards) => {
      return boards.map((board) => {
        if (board.id === BoardId) {
          return {
            ...board,
            list: [
              ...board.list.map((l) => {
                if (l.id == listId) {
                  return {
                    ...l,
                    cards: [...l.cards.filter((c) => c.id !== CardId)],
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
  function handleSaveForCard() {
    if(editData.title.trim() === "") return;
    useTrelloBoard((boards) => {
      return boards.map((board) => {
        if (board.id === editIds.boardId) {
          return {
            ...board,
            list: [
              ...board.list.map((l) => {
                if (l.id == editIds.listId) {
                  return {
                    ...l,
                    cards: [
                      ...l.cards.map((c) => {
                        if (c.id == editIds.cardId) {
                          return editData;
                        } else {
                          return c;
                        }
                      }),
                    ],
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

    closeRename();
    setBoardId({
      boardId: null,
      listId: null,
      cardId: null,
    });
  }

  return (
    <>
      <GlobalProvider.Provider
        value={{
          useTrelloBoard,
          TrelloBoard,
          openBoard,
          selectedBoardId,
          setSelectedBoardId,
          handleSaveForCard,
          setEditedOpenedCardState,
          onRename,
          closeRename,
          editOpenedCard,
          editData,
          setEditData,
          setBoardId,
          handleEdit,
          deleteCard,
        }}
      >
        {children}
      </GlobalProvider.Provider>
    </>
  );
}
