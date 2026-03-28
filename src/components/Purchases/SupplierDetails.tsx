// components/PurchaseForm/SupplierDetails.tsx

interface SupplierDetailsProps {
  supplierName: string;
  paymentMethod: string;
  onSupplierNameChange: (value: string) => void;
  onPaymentMethodChange: (value: string) => void;
}

export const SupplierDetails = ({
  supplierName,
  paymentMethod,
  onSupplierNameChange,
  onPaymentMethodChange,
}: SupplierDetailsProps) => {
  const paymentOptions = [
    { value: "cash", label: "Cash", icon: "💰" },
    { value: "upi", label: "UPI", icon: "📱" },
    { value: "bank", label: "Bank Transfer", icon: "🏦" },
    { value: "credit", label: "Credit", icon: "💳" },
  ];

  return (
    <div className="grid md:grid-cols-2 gap-5 mb-6">
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
          Supplier Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="Enter supplier name"
          className="w-full border dark:border-slate-700 rounded-lg px-3 py-2 dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          value={supplierName}
          onChange={(e) => onSupplierNameChange(e.target.value)}
        />
        {!supplierName.trim() && (
          <p className="text-xs text-red-500 mt-1">Supplier name is required</p>
        )}
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
          Payment Method
        </label>
        <select
          className="w-full border dark:border-slate-700 rounded-lg px-3 py-2 dark:bg-slate-900 dark:text-white capitalize focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          value={paymentMethod}
          onChange={(e) => onPaymentMethodChange(e.target.value)}
        >
          {paymentOptions.map((option) => (
            <option
              key={option.value}
              value={option.value}
              className="capitalize"
            >
              {option.icon} {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
