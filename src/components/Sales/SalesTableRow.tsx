// components/SalesTable/SalesTableRow.tsx
import { type Sale } from "../../types/saletypes";

interface SalesTableRowProps {
  sale: Sale;
  search: string;
  onEdit: (sale: Sale) => void;
  onDelete: (id: string) => void;
}

const highlightText = (text: string, search: string) => {
  if (!search || !text) return text;

  const parts = text.split(new RegExp(`(${search})`, "gi"));
  return parts.map((part, i) =>
    part.toLowerCase() === search.toLowerCase() ? (
      <span key={i} className="bg-yellow-200 dark:bg-yellow-900 font-medium">
        {part}
      </span>
    ) : (
      part
    ),
  );
};

export const SalesTableRow = ({
  sale,
  search,
  onEdit,
  onDelete,
}: SalesTableRowProps) => {
  return (
    <tr className="border-t dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50">
      <td className="p-3 font-mono text-sm">
        {search
          ? highlightText(sale.invoiceNumber, search)
          : sale.invoiceNumber}
      </td>
      <td className="p-3 font-medium">
        {search ? highlightText(sale.customerName, search) : sale.customerName}
      </td>
      <td className="p-3">
        <div className="space-y-1">
          {sale.items?.map((item, idx) => (
            <div key={item._id} className="text-sm">
              <span className="font-medium">
                {search
                  ? highlightText(item.productId.name, search)
                  : item.productId.name}
              </span>
              <span className="text-gray-500 dark:text-gray-400">
                {" "}
                × {item.quantity} (₹{item.price})
              </span>
              {idx < sale.items.length - 1 && <br />}
            </div>
          ))}
        </div>
      </td>
      <td className="p-3 capitalize">{sale.paymentMethod}</td>
      <td className="p-3">₹{sale.subtotal}</td>
      <td className="p-3">₹{sale.gstAmount}</td>
      <td className="p-3 font-medium">₹{sale.totalAmount}</td>
      <td className="p-3">{new Date(sale.createdAt).toLocaleDateString()}</td>
      <td className="p-3 flex gap-3">
        <button
          onClick={() => onEdit(sale)}
          className="text-blue-600 hover:underline"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(sale._id)}
          className="text-red-600 hover:underline"
        >
          Delete
        </button>
      </td>
    </tr>
  );
};
