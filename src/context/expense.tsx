import { createContext, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

type Category = 'Food' | 'Furniture' | 'Accessory';

export interface Expense {
  itemName: string;
  category: Category;
  amount: number;
}

export interface ExpenseContext {
  expenseList: Expense[];
  addExpense: (expense: Expense) => void;
  deleteExpense: (expense: Expense[]) => void;
}

interface ExpenseContextProviderProps {
  children: React.ReactNode;
}

const defaultValue: Expense[] = [
  {
    itemName: 'Whiskers Cat Food',
    category: 'Food',
    amount: 10,
  },
  {
    itemName: 'Self Cleaning Cat Litter Box',
    category: 'Furniture',
    amount: 500,
  },
  {
    itemName: 'Diamond Cat Collar',
    category: 'Accessory',
    amount: 1000,
  },
];
const ExpenseContext = createContext<ExpenseContext | undefined>(undefined);

export const ExpenseContextProvider = ({
  children,
}: ExpenseContextProviderProps) => {
  const [expenseList, setExpenseList] = useLocalStorage<Expense[]>(
    'expense',
    defaultValue
  );

  const addExpense = (expense: Expense) => {
    setExpenseList(currentList => [...currentList, expense]);
  };

  const deleteExpense = (deleteList: Expense[]) => {
    setExpenseList(expenseList =>
      expenseList.filter(item => !deleteList.includes(item))
    );
  };

  return (
    <ExpenseContext.Provider value={{ expenseList, addExpense, deleteExpense }}>
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenseContext = (): ExpenseContext => {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error('context is undefined');
  }
  return context;
};
