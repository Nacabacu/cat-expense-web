import clsx from 'clsx';
import { TableHTMLAttributes, useEffect, useMemo, useState } from 'react';

export enum ColumnType {
  Value = 'value',
  Checkbox = 'checkbox',
}

export type Column<T> = CheckboxColumn | ValueColumn<T>;

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

interface DataType extends Record<string, any> {
  id: string;
}
interface TableProps<T extends DataType>
  extends TableHTMLAttributes<HTMLTableElement> {
  data: T[];
  columns: Column<T>[];
  highlightKey: keyof T;
  onSelectionChange: (selectedItems: T[]) => void;
}

const tableCellClassName = 'whitespace-nowrap px-4 py-2';

const Table = <T extends DataType>({
  data,
  columns,
  highlightKey,
  onSelectionChange,
}: TableProps<T>) => {
  const [selectedItems, setSelectedItems] = useState<T[]>([]);

  useEffect(() => {
    onSelectionChange(selectedItems);
  }, [selectedItems, onSelectionChange]);

  const maxValue = useMemo(() => {
    return Math.max(
      ...data.map(item => {
        return item[highlightKey];
      })
    );
  }, [data, highlightKey]);

  const handleCheckboxChange = (item: T, isChecked: boolean) => {
    if (isChecked) {
      setSelectedItems(prev => [...prev, item]);
    } else {
      setSelectedItems(prev => prev.filter(i => i !== item));
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
      case ColumnType.Value: {
        return column.formatter && column.key
          ? column.formatter(item[column.key])
          : column.key && item[column.key];
      }
    }
  };

  return (
    <div className="w-full overflow-x-auto rounded-md border border-secondary">
      <table className="min-w-full divide-y-2 divide-secondary text-sm">
        <thead className="bg-accent">
          <tr>
            {columns.map((column, i) => (
              <th key={column.label + i} className={tableCellClassName}>
                {column.label}
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
                  className={`${tableCellClassName} ${clsx({ 'bg-accentLight !text-primary': item[highlightKey] === maxValue, 'flex justify-center': column.type === ColumnType.Checkbox })}`}
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
