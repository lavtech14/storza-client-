// components/PurchaseForm/PurchaseProductRow.tsx
import { useProducts } from "../../context/useProducts";
import type { PurchaseItem } from "../../types/purchasetype.js";
import type { Product } from "../../context/ProductsContext";

interface PurchaseProductRowProps {
  item: PurchaseItem;
  index: number;
  onProductChange: (index: number, productId: string) => void;
  onItemChange: (
    index: number,
    field: keyof PurchaseItem,
    value: string | number,
  ) => void;
  onRemoveRow: (index: number) => void;
  isLast: boolean;
}

export const PurchaseProductRow = ({
  item,
  index,
  onProductChange,
  onItemChange,
  onRemoveRow,
  isLast,
}: PurchaseProductRowProps) => {
  const { products } = useProducts();

  const quantity = typeof item.quantity === "number" ? item.quantity : 0;
  const buyPrice = typeof item.buyPrice === "number" ? item.buyPrice : 0;
  const gst = typeof item.gst === "number" ? item.gst : 0;

  const subtotal = quantity * buyPrice;
  const gstAmount = (quantity * buyPrice * gst) / 100;
  const total = subtotal + gstAmount;

  // Helper function to get display price with proper typing
  const getDisplayPrice = (product: Product): string => {
    if (product.buyingPrice) {
      return `Buy: ₹${product.buyingPrice}`;
    }
    if (product.sellingPrice) {
      return `Sell: ₹${product.sellingPrice}`;
    }
    return "Price: N/A";
  };

  // Helper function to get product ID safely
  const getProductId = (): string => {
    if (typeof item.productId === "string") {
      return item.productId;
    }
    return item.productId?._id || "";
  };

  return (
    <tr className="border-t dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50">
      <td className="p-3">
        <select
          value={getProductId()}
          onChange={(e) => onProductChange(index, e.target.value)}
          className="w-full border dark:border-slate-700 rounded-lg px-3 py-2 dark:bg-slate-900 dark:text-white"
        >
          <option value="">Select Product</option>
          {products.map((product: Product) => (
            <option key={product._id} value={product._id}>
              {product.name} ({getDisplayPrice(product)})
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
      <td className="p-3">
        <input
          type="number"
          min="0"
          step="0.01"
          value={item.buyPrice}
          onChange={(e) =>
            onItemChange(index, "buyPrice", Number(e.target.value))
          }
          className="w-24 border dark:border-slate-700 rounded-lg px-3 py-2 dark:bg-slate-900 dark:text-white"
        />
      </td>
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
