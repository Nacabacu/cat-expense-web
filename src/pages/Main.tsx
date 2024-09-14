import { MouseEvent, useState } from 'react';
import Button from '../components/Button';
import { Expense, useExpenseContext } from '../context/expense';
import Table, { Column, ColumnType } from '../components/Table';

const columns: Column<Expense>[] = [
  {
    type: ColumnType.Checkbox,
    label: 'Select',
  },
  {
    key: 'itemName',
    type: ColumnType.Value,
    label: 'Item',
  },
  {
    key: 'category',
    type: ColumnType.Value,
    label: 'Category',
  },
  {
    key: 'amount',
    type: ColumnType.Value,
    label: 'Amount',
    formatter: value => {
      return `${value}$`;
    },
  },
];

function Main() {
  const [i, setI] = useState(0);
  const { expenseList, addExpense, deleteExpense } = useExpenseContext();
  const [selectedExpenseList, setSelectedExpenseList] = useState<Expense[]>([]);

  const onAddExpense = (event: MouseEvent) => {
    setI(i => (i += 1));
    addExpense({
      itemName: i.toString(),
      category: 'Accessory',
      amount: 123,
    });
  };

  const onDeleteExpense = () => {
    deleteExpense(selectedExpenseList);
    setSelectedExpenseList([]);
  };

  return (
    <div className="h-full flex flex-col min-w-[450px] w-1/2 gap-8 pt-28 items-center">
      <h1 className="text-6xl text-accent">Cat Expense 😺💸</h1>
      <div className="flex gap-2 justify-start self-start">
        <Button label="Add Expense" onClick={onAddExpense}></Button>
        <Button label="Delete Expense" onClick={onDeleteExpense}></Button>
      </div>
      <Table
        data={expenseList}
        columns={columns}
        highlightKey="amount"
        onSelectionChange={selectedItem => {
          setSelectedExpenseList(selectedItem);
        }}
      />
    </div>
  );
}

export default Main;
