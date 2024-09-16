import { MouseEvent, useState } from 'react';
import Button from '../components/Button';
import { Expense, useExpenseContext } from '../context/expense';
import Table, { Column, ColumnType } from '../components/Table';
import AddDialog from '../components/AddDialog';

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

const Main = () => {
  const { expenseList, addExpense, deleteExpenseByIds } = useExpenseContext();
  const [selectedExpenseList, setSelectedExpenseList] = useState<Expense[]>([]);
  const [isDialogShown, setIsDialogShown] = useState(false);

  const showDialog = () => {
    setIsDialogShown(true);
  };

  const onDialogSubmit = (expense: Expense) => {
    addExpense(expense);
  };

  const onDialogClose = () => {
    setIsDialogShown(false);
  };

  const onAddExpense = (event: MouseEvent) => {
    showDialog();
  };

  const onDeleteExpense = () => {
    deleteExpenseByIds(selectedExpenseList.map(e => e.id));
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
      {isDialogShown && (
        <AddDialog
          onSubmitDialog={onDialogSubmit}
          onClose={onDialogClose}
        ></AddDialog>
      )}
    </div>
  );
};

export default Main;
