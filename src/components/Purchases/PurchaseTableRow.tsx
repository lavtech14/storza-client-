// components/PurchaseForm/PurchaseTableRow.tsx
import { type Purchase } from "../../types/purchasetype";

interface PurchaseTableRowProps {
  purchase: Purchase;
  search: string;
  onEdit: (purchase: Purchase) => void;
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

export const PurchaseTableRow = ({
  purchase,
  search,
  onEdit,
  onDelete,
}: PurchaseTableRowProps) => {
  const invoiceNumber =
    purchase.invoiceNumber || `PO-${purchase._id.slice(-6)}`;

  return (
    <tr className="border-t dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50">
      <td className="p-3 font-mono text-sm">
        {search ? highlightText(invoiceNumber, search) : invoiceNumber}
      </td>
      <td className="p-3 font-medium">
        {search
          ? highlightText(purchase.supplierName, search)
          : purchase.supplierName}
      </td>
      <td className="p-3">
        <div className="space-y-1">
          {purchase.items?.map((item, idx) => (
            <div key={item._id} className="text-sm">
              <span className="font-medium">
                {search && item.productId
                  ? highlightText(item.productId.name, search)
                  : item.productId?.name || "Unknown Product"}
              </span>
              <span className="text-gray-500 dark:text-gray-400">
                {" "}
                × {item.quantity} (₹{item.buyPrice})
              </span>
              {idx < purchase.items.length - 1 && <br />}
            </div>
          ))}
        </div>
      </td>
      <td className="p-3 capitalize">{purchase.paymentMethod}</td>
      <td className="p-3">₹{purchase.subtotal.toFixed(2)}</td>
      <td className="p-3">₹{purchase.gstAmount.toFixed(2)}</td>
      <td className="p-3 font-medium">₹{purchase.totalAmount.toFixed(2)}</td>
      <td className="p-3">
        {new Date(purchase.createdAt).toLocaleDateString()}
      </td>
      <td className="p-3 flex gap-3">
        <button
          onClick={() => onEdit(purchase)}
          className="text-blue-600 hover:underline"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(purchase._id)}
          className="text-red-600 hover:underline"
        >
          Delete
        </button>
      </td>
    </tr>
  );
};
