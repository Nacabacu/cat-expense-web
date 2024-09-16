import { createContext, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { generateId } from '../util/id';

export enum Category {
  Food = 'Food',
  Furniture = 'Furniture',
  Accessory = 'Accessory',
}

export interface Expense {
  id: string;
  itemName: string;
  category: Category;
  amount: number;
}

export interface ExpenseContext {
  expenseList: Expense[];
  addExpense: (expense: Expense) => void;
  deleteExpenseByIds: (ids: string[]) => void;
}

interface ExpenseContextProviderProps {
  children: React.ReactNode;
}

export const categories = Object.values(Category) as string[];

const ExpenseContext = createContext<ExpenseContext | undefined>(undefined);

const getDefaultValue = () => {
  return [
    {
      id: generateId(),
      itemName: 'Whiskers Cat Food',
      category: Category.Food,
      amount: 10,
    },
    {
      id: generateId(),
      itemName: 'Self Cleaning Cat Litter Box',
      category: Category.Furniture,
      amount: 500,
    },
    {
      id: generateId(),
      itemName: 'Diamond Cat Collar',
      category: Category.Accessory,
      amount: 1000,
    },
  ] as Expense[];
};

export const ExpenseContextProvider = ({
  children,
}: ExpenseContextProviderProps) => {
  const [expenseList, setExpenseList] = useLocalStorage<Expense[]>(
    'expense',
    getDefaultValue()
  );

  const addExpense = (expense: Expense) => {
    setExpenseList(currentList => [...currentList, expense]);
  };

  const deleteExpenseByIds = (ids: string[]) => {
    setExpenseList(expenseList =>
      expenseList.filter(item => !ids.includes(item.id))
    );
  };

  return (
    <ExpenseContext.Provider
      value={{ expenseList, addExpense, deleteExpenseByIds }}
    >
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
