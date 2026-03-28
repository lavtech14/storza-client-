// components/SaleForm/CustomerDetails.tsx

interface CustomerDetailsProps {
  customerName: string;
  paymentMethod: string;
  onCustomerNameChange: (value: string) => void;
  onPaymentMethodChange: (value: string) => void;
}

export const CustomerDetails = ({
  customerName,
  paymentMethod,
  onCustomerNameChange,
  onPaymentMethodChange,
}: CustomerDetailsProps) => {
  const paymentOptions = [
    { value: "cash", label: "Cash", icon: "💰" },
    { value: "upi", label: "UPI", icon: "📱" },
    { value: "card", label: "Card", icon: "💳" },
    { value: "credit", label: "Credit", icon: "🏦" },
  ];

  return (
    <div className="grid md:grid-cols-2 gap-5 mb-6">
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
          Customer Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="Enter customer name"
          className="w-full border dark:border-slate-700 rounded-lg px-3 py-2 dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          value={customerName}
          onChange={(e) => onCustomerNameChange(e.target.value)}
        />
        {!customerName.trim() && (
          <p className="text-xs text-red-500 mt-1">Customer name is required</p>
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
