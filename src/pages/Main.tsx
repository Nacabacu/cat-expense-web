import { useMemo, useState } from 'react';
import Button from '../components/Button';
import { Expense, useExpenseContext } from '../context/expense';
import Table, { Column, ColumnType } from '../components/Table';
import Dialog from '../components/Dialog';

const Main = () => {
  const { expenseList, addExpense, deleteExpenseByIds, updateExpenseById } =
    useExpenseContext();
  const [selectedExpenseList, setSelectedExpenseList] = useState<Expense[]>([]);
  const [isDialogShown, setIsDialogShown] = useState(false);
  const [initialDialogData, setInitialDialogData] = useState<
    undefined | Expense
  >(undefined);

  const maxCategories = useMemo(() => {
    const categorySumMapping: { [key: string]: number } = {};

    for (const expense of expenseList) {
      if (categorySumMapping[expense.category]) {
        categorySumMapping[expense.category] += expense.amount;
      } else {
        categorySumMapping[expense.category] = expense.amount;
      }
    }

    const maxSum = Math.max(...Object.values(categorySumMapping));
    const maxCategories = Object.keys(categorySumMapping).filter(
      category => categorySumMapping[category] === maxSum
    );

    return maxCategories;
  }, [expenseList]);

  const showDialog = () => {
    setIsDialogShown(true);
  };

  const onDialogClose = () => {
    setIsDialogShown(false);
    setInitialDialogData(undefined);
  };

  const onAddExpenseButtonClick = () => {
    showDialog();
  };

  const onDeleteExpenseButtonClick = () => {
    if (selectedExpenseList.length === 0) {
      alert('Please select at least one expense to delete.');
      return;
    }

    deleteExpenseByIds(selectedExpenseList.map(e => e.id));
    setSelectedExpenseList([]);
  };

  const onUpdateExpense = (item: Expense) => {
    setInitialDialogData(item);
    showDialog();
  };

  const onDialogAddItem = (expense: Expense) => {
    addExpense(expense);
  };

  const onDialogUpdateItem = (expense: Expense) => {
    updateExpenseById(expense.id, expense);
  };

  const getIsHighlight = (expense: Expense) => {
    return maxCategories.includes(expense.category);
  };

  const onTableSelectionChange = (selectedItem: Expense[]) => {
    setSelectedExpenseList(selectedItem);
  };

  const columns: Column<Expense>[] = [
    {
      type: ColumnType.Checkbox,
      label: '',
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
    {
      type: ColumnType.Button,
      label: '',
      buttonLabel: 'Update',
      onButtonClick: onUpdateExpense,
    },
  ];

  return (
    <div className="h-full flex flex-col w-5/6 lg:w-4/6 xl:w-3/6 gap-4 pt-28 items-center">
      <h1 className="text-6xl text-accent mb-12">Cat Expense 😺💸</h1>
      <div className="flex gap-4 justify-start self-start">
        <Button label="Add Expense" onClick={onAddExpenseButtonClick}></Button>
        <Button
          label="Delete Expense"
          onClick={onDeleteExpenseButtonClick}
        ></Button>
      </div>
      <Table
        data={expenseList}
        columns={columns}
        getIsHighlight={getIsHighlight}
        onSelectionChange={onTableSelectionChange}
      />
      {isDialogShown && (
        <Dialog
          onAddItem={onDialogAddItem}
          onUpdateItem={onDialogUpdateItem}
          onClose={onDialogClose}
          initialData={initialDialogData}
        ></Dialog>
      )}
    </div>
  );
};

export default Main;
