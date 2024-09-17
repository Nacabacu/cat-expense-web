import { DialogHTMLAttributes, useEffect, useRef, useState } from 'react';
import Input from './Input';
import Button from './Button';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { categories, Category, Expense } from '../context/expense';
import { generateId } from '../util/id';

const schema = z.object({
  itemName: z
    .string()
    .trim()
    .min(1, 'Item name is required')
    .max(30, 'Maximum 30 characters'),
  category: z.string().min(1, 'Please Select'),
  amount: z
    .number({ invalid_type_error: 'Amount is required' })
    .min(1, 'Amount need to be positive'),
});

type FormValues = z.infer<typeof schema>;

interface DialogProps extends DialogHTMLAttributes<HTMLDialogElement> {
  onAddItem: (expense: Expense) => void;
  onUpdateItem: (expense: Expense) => void;
  onClose: () => void;
  initialData?: Expense;
}

const Dialog = ({
  onAddItem,
  onUpdateItem,
  onClose,
  initialData,
}: DialogProps) => {
  const [catFact, setCatFact] = useState('loading...');
  const dialogRef = useRef<HTMLDialogElement>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'onChange',
  });

  useEffect(() => {
    const dialogElement = dialogRef.current;

    dialogElement?.addEventListener('close', onClose);

    return () => {
      dialogElement?.removeEventListener('close', onClose);
    };
  }, [onClose]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://catfact.ninja/fact');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const result = await response.json();
        setCatFact(result.fact);
      } catch (err) {
        setCatFact('Error while getting fact');
      }
    };

    dialogRef.current?.showModal();
    fetchData();
  }, []);

  const onSubmitHandler: SubmitHandler<FormValues> = data => {
    if (!isValid) return;

    if (initialData) {
      onUpdateItem({
        id: initialData.id,
        itemName: data.itemName,
        category: data.category as Category,
        amount: data.amount,
      });
    } else {
      onAddItem({
        id: generateId(),
        itemName: data.itemName,
        category: data.category as Category,
        amount: data.amount,
      });
    }

    dialogRef.current?.close();
  };

  return (
    <dialog
      ref={dialogRef}
      className="rounded-lg backdrop:bg-primary/40"
      onClick={e => {
        if (e.currentTarget === e.target) {
          dialogRef.current?.close();
        }
      }}
    >
      <div className="px-12 py-8 flex gap-12">
        <form onSubmit={handleSubmit(onSubmitHandler)}>
          <div className="flex flex-col gap-8 w-72">
            <div className="flex justify-between items-center">
              <label htmlFor="item">Item:</label>
              <Input
                id="item"
                type="text"
                placeholder="Item Name"
                error={errors.itemName}
                {...register('itemName')}
                className="w-48"
                defaultValue={initialData?.itemName}
              />
            </div>
            <div className="flex justify-between items-center">
              <label htmlFor="category">Category:</label>
              <div className="relative">
                <select
                  {...register('category')}
                  className="border-gray-300 h-10 border rounded-sm w-48"
                  defaultValue={initialData?.category}
                >
                  <option value="">Select category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-error absolute text-sm">
                    {errors.category.message}
                  </p>
                )}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <label htmlFor="amount">Amount:</label>
              <Input
                id="amount"
                type="number"
                placeholder="Item amount"
                error={errors.amount}
                {...register('amount', { valueAsNumber: true })}
                className="w-48 [&::-webkit-inner-spin-button]:appearance-none"
                defaultValue={initialData?.amount}
              />
            </div>
            <Button label="Submit" className="w-20 self-end" />
          </div>
        </form>
        <div className="w-80 text-accent">
          <p className="font-bold">Random cat facts:</p>
          <p>{catFact}</p>
        </div>
      </div>
    </dialog>
  );
};
export default Dialog;
