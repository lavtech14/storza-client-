// components/PurchaseForm/PurchaseHeader.tsx

interface PurchaseHeaderProps {
  showForm: boolean;
  onToggleForm: () => void;
}

export const PurchaseHeader = ({
  showForm,
  onToggleForm,
}: PurchaseHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <button
        onClick={onToggleForm}
        className="px-5 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white"
      >
        {showForm ? "Close Form" : "New Purchase"}
      </button>
    </div>
  );
};
