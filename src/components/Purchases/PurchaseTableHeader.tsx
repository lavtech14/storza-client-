// components/PurchaseForm/PurchaseTableHeader.tsx

export const PurchaseTableHeader = () => {
  return (
    <thead className="bg-slate-100 dark:bg-slate-800">
      <tr>
        <th className="p-3 text-left">Invoice #</th>
        <th className="p-3 text-left">Supplier</th>
        <th className="p-3 text-left">Products</th>
        <th className="p-3 text-left">Payment</th>
        <th className="p-3 text-left">Subtotal</th>
        <th className="p-3 text-left">GST</th>
        <th className="p-3 text-left">Total</th>
        <th className="p-3 text-left">Date</th>
        <th className="p-3 text-left">Actions</th>
      </tr>
    </thead>
  );
};
