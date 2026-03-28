// components/PurchaseForm/PurchaseForm.tsx
import { useReactToPrint } from "react-to-print";
import { SupplierDetails } from "./SupplierDetails.js";
import { PurchaseProductsTable } from "./PurchaseProductsTable.js";
import { PurchaseGSTBreakdown } from "./PurchaseGSTBreakdown.js";
import type {
  PurchaseBillData,
  PurchaseItem,
} from "../../types/purchasetype.js";
import PurchaseBillPrint from "./PurchaseBillPrint.js";

interface PurchaseFormProps {
  editingId: string | null;
  supplierName: string;
  paymentMethod: string;
  items: PurchaseItem[];
  subtotal: number;
  totalGST: number;
  total: number;
  cgst: number;
  sgst: number;
  billData: PurchaseBillData | null;
  onSupplierNameChange: (value: string) => void;
  onPaymentMethodChange: (value: string) => void;
  onProductChange: (index: number, productId: string) => void;
  onItemChange: (
    index: number,
    field: keyof PurchaseItem,
    value: string | number,
  ) => void;
  onRemoveRow: (index: number) => void;
  onSubmit: () => void;
  printRef: React.RefObject<HTMLDivElement | null>;
}

export const PurchaseForm = ({
  editingId,
  supplierName,
  paymentMethod,
  items,
  subtotal,
  totalGST,
  total,
  cgst,
  sgst,
  billData,
  onSupplierNameChange,
  onPaymentMethodChange,
  onProductChange,
  onItemChange,
  onRemoveRow,
  onSubmit,
  printRef,
}: PurchaseFormProps) => {
  const handlePrint = useReactToPrint({
    contentRef: printRef,
  });

  const handleSubmit = () => {
    onSubmit();
    setTimeout(() => handlePrint?.(), 300);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border dark:border-slate-700 rounded-xl p-8 mb-8">
      <h2 className="text-xl font-semibold mb-6">
        {editingId ? "Edit Purchase" : "Create Purchase"}
      </h2>

      <SupplierDetails
        supplierName={supplierName}
        paymentMethod={paymentMethod}
        onSupplierNameChange={onSupplierNameChange}
        onPaymentMethodChange={onPaymentMethodChange}
      />

      <PurchaseProductsTable
        items={items}
        onProductChange={onProductChange}
        onItemChange={onItemChange}
        onRemoveRow={onRemoveRow}
      />

      <PurchaseGSTBreakdown
        subtotal={subtotal}
        totalGST={totalGST}
        total={total}
        cgst={cgst}
        sgst={sgst}
      />

      <div className="text-right">
        <button
          onClick={handleSubmit}
          className="px-6 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white"
        >
          {editingId ? "Update Purchase" : "Complete Purchase"}
        </button>
      </div>

      {billData && (
        <div className="hidden">
          <PurchaseBillPrint ref={printRef} {...billData} />
        </div>
      )}
    </div>
  );
};
