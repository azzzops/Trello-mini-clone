import Boards from "./kaban/kabanboard";
import SelectedBoardView from "./kaban/kabanboardsview";
import { GlobalProvider } from "./GlobalContext";
import { useContext } from "react";
export default function Index(){

    const {selectedBoardId} = useContext(GlobalProvider)

    return(
        <>
            <div className="min-h-screen bg-background">
                {selectedBoardId ? <SelectedBoardView /> : <Boards />}
                
                
            </div>
        </>
    )
}