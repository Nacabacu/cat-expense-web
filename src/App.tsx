import { ExpenseContextProvider } from './context/expense';
import Main from './pages/Main';

function App() {
  return (
    <div className="h-screen flex justify-center bg-primary text-secondary">
      <ExpenseContextProvider>
        <Main />
      </ExpenseContextProvider>
    </div>
  );
}

export default App;
