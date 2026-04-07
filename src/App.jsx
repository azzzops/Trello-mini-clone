import './App.css';
import TrelloNavBar from './kaban/navbar';
import ThemeProvider from './hooks/theme';
import Index from '.';
import MyProvider from './GlobalContext';
function App() {
    return(
      <>
      
        <ThemeProvider>
          <MyProvider>
                  <Index /> 
          </MyProvider>
        </ThemeProvider>
              
      </>
    )
}

export default App
