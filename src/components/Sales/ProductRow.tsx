import { useProducts } from "../../context/useProducts";
import type { SaleItem } from "../../types/saletypes.js";

interface ProductRowProps {
  item: SaleItem;
  index: number;
  onProductChange: (index: number, productId: string) => void;
  onItemChange: (
    index: number,
    field: keyof SaleItem,
    value: string | number,
  ) => void;
  onRemoveRow: (index: number) => void;
  isLast: boolean;
}

export const ProductRow = ({
  item,
  index,
  onProductChange,
  onItemChange,
  onRemoveRow,
  isLast,
}: ProductRowProps) => {
  const { products } = useProducts();
  const subtotal = item.quantity * item.price;
  const gstAmount = (item.quantity * item.price * item.gst) / 100;
  const total = subtotal + gstAmount;

  return (
    <tr className="border-t dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50">
      <td className="p-3">
        <select
          value={item.productId}
          onChange={(e) => onProductChange(index, e.target.value)}
          className="w-full border dark:border-slate-700 rounded-lg px-3 py-2 dark:bg-slate-900 dark:text-white"
        >
          <option value="">Select Product</option>
          {products.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name} (₹{p.sellingPrice})
            </option>
          ))}
        </select>
      </td>
      <td className="p-3">
        <input
          type="number"
          min="1"
          value={item.quantity}
          onChange={(e) =>
            onItemChange(index, "quantity", Number(e.target.value))
          }
          className="w-20 border dark:border-slate-700 rounded-lg px-3 py-2 dark:bg-slate-900 dark:text-white"
        />
      </td>
      <td className="p-3 font-medium">₹{item.price}</td>
      <td className="p-3">{item.gst}%</td>
      <td className="p-3 font-medium">₹{subtotal.toFixed(2)}</td>
      <td className="p-3 font-medium">₹{gstAmount.toFixed(2)}</td>
      <td className="p-3 font-medium">₹{total.toFixed(2)}</td>
      <td className="p-3">
        {!isLast && (
          <button
            onClick={() => onRemoveRow(index)}
            className="text-red-600 hover:underline"
          >
            Remove
          </button>
        )}
      </td>
    </tr>
  );
};
