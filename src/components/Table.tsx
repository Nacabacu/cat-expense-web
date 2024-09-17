import clsx from 'clsx';
import { TableHTMLAttributes, useEffect, useState } from 'react';
import Button from './Button';

export enum ColumnType {
  Value = 'value',
  Checkbox = 'checkbox',
  Button = 'button',
}

export type Column<T> = CheckboxColumn | ValueColumn<T> | ButtonColumn<T>;

interface ColumnBase {
  label: string;
  formatter?: (value: any) => string;
}

interface ValueColumn<T> extends ColumnBase {
  key: keyof T;
  type: ColumnType.Value;
}

interface CheckboxColumn extends ColumnBase {
  type: ColumnType.Checkbox;
}

interface ButtonColumn<T> extends ColumnBase {
  type: ColumnType.Button;
  buttonLabel: string;
  onButtonClick: (item: T) => void;
}

interface DataType extends Record<string, any> {
  id: string;
}
interface TableProps<T extends DataType>
  extends TableHTMLAttributes<HTMLTableElement> {
  data: T[];
  columns: Column<T>[];
  getIsHighlight: (item: T) => boolean;
  onSelectionChange: (selectedItems: T[]) => void;
}

const tableCellClassName = 'whitespace-nowrap px-4 py-2';

const Table = <T extends DataType>({
  data,
  columns,
  getIsHighlight,
  onSelectionChange,
}: TableProps<T>) => {
  const [selectedItems, setSelectedItems] = useState<T[]>([]);
  const [isCheckedAll, setIsCheckedAll] = useState(false);

  useEffect(() => {
    onSelectionChange(selectedItems);
  }, [selectedItems, onSelectionChange]);

  useEffect(() => {
    if (data.length === 0) {
      setIsCheckedAll(false);
    }
    setSelectedItems(prev => {
      return prev.filter(i => data.includes(i));
    });
  }, [data]);

  const handleCheckboxChange = (item: T, isChecked: boolean) => {
    setSelectedItems(prev => {
      const updatedItems = isChecked
        ? [...prev, item]
        : prev.filter(i => i !== item);
      setIsCheckedAll(updatedItems.length === data.length);
      return updatedItems;
    });
  };

  const handleAllCheckboxChange = (isChecked: boolean) => {
    setSelectedItems(() => {
      setIsCheckedAll(isChecked);
      return isChecked ? [...data] : [];
    });
  };

  const renderHeaderValue = (column: Column<T>) => {
    switch (column.type) {
      case ColumnType.Checkbox:
        return (
          <input
            type="checkbox"
            className="size-5 rounded border-gray-300"
            checked={isCheckedAll}
            onChange={e => handleAllCheckboxChange(e.target.checked)}
          />
        );
      case ColumnType.Value: {
        return column.label;
      }
    }
  };

  const renderCellValue = (item: T, column: Column<T>) => {
    switch (column.type) {
      case ColumnType.Checkbox:
        return (
          <input
            type="checkbox"
            className="size-5 rounded border-gray-300"
            checked={selectedItems.includes(item)}
            onChange={e => handleCheckboxChange(item, e.target.checked)}
          />
        );
      case ColumnType.Value:
        return column.formatter && column.key
          ? column.formatter(item[column.key])
          : column.key && item[column.key];
      case ColumnType.Button:
        return (
          <Button
            label={column.buttonLabel}
            onClick={() => {
              column.onButtonClick(item);
            }}
          ></Button>
        );
    }
  };

  return (
    <div className="w-full overflow-x-auto rounded-md border border-secondary">
      <table className="min-w-full divide-y-2 divide-secondary text-sm">
        <thead className="bg-accent">
          <tr>
            {columns.map((column, i) => (
              <th
                key={column.label + i}
                className={`${tableCellClassName} ${clsx({ 'text-left': column.type !== ColumnType.Checkbox })}`}
              >
                {renderHeaderValue(column)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map(item => (
            <tr key={item.id}>
              {columns.map((column, i) => (
                <td
                  key={i}
                  className={`${tableCellClassName} ${clsx({ ' bg-accentLight !text-primary': getIsHighlight(item), 'text-center': column.type === ColumnType.Checkbox })}`}
                >
                  {renderCellValue(item, column)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
