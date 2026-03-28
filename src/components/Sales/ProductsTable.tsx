import { ProductRow } from "./ProductRow.js";
import type { SaleItem } from "../../types/saletypes.js";

interface ProductsTableProps {
  items: SaleItem[];
  onProductChange: (index: number, productId: string) => void;
  onItemChange: (
    index: number,
    field: keyof SaleItem,
    value: string | number,
  ) => void;
  onRemoveRow: (index: number) => void;
}

export const ProductsTable = ({
  items,
  onProductChange,
  onItemChange,
  onRemoveRow,
}: ProductsTableProps) => {
  const getItemSubtotal = (item: SaleItem) => item.quantity * item.price;
  const getItemGST = (item: SaleItem) =>
    (item.quantity * item.price * item.gst) / 100;

  const subtotal = items.reduce((sum, i) => sum + getItemSubtotal(i), 0);
  const totalGST = items.reduce((sum, i) => sum + getItemGST(i), 0);
  const total = subtotal + totalGST;

  return (
    <div className="mb-6">
      <label className="block mb-2 text-sm font-medium">Products</label>
      <div className="border dark:border-slate-700 rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 dark:bg-slate-800">
            <tr>
              <th className="p-3 text-left">Product</th>
              <th className="p-3 text-left">Quantity</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-left">GST%</th>
              <th className="p-3 text-left">Subtotal</th>
              <th className="p-3 text-left">GST Amt</th>
              <th className="p-3 text-left">Total</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <ProductRow
                key={index}
                item={item}
                index={index}
                onProductChange={onProductChange}
                onItemChange={onItemChange}
                onRemoveRow={onRemoveRow}
                isLast={items.length === 1}
              />
            ))}
          </tbody>
          <tfoot className="bg-slate-50 dark:bg-slate-800 font-semibold">
            <tr>
              <td colSpan={4} className="p-3 text-right">
                Totals:
              </td>
              <td className="p-3">₹{subtotal.toFixed(2)}</td>
              <td className="p-3">₹{totalGST.toFixed(2)}</td>
              <td className="p-3">₹{total.toFixed(2)}</td>
              <td className="p-3"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
