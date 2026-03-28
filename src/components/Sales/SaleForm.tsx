import { useReactToPrint } from "react-to-print";
import BillPrint from "../../components/BillPrint";
import { CustomerDetails } from "./CustomerDetails.js";
import { ProductsTable } from "./ProductsTable.js";

import { GSTBreakdown } from "./GSTBreakdown.js";
import type { BillData, SaleItem } from "../../types/saletypes";

interface SaleFormProps {
  editingId: string | null;
  customerName: string;
  paymentMethod: string;
  items: SaleItem[];
  subtotal: number;
  totalGST: number;
  total: number;
  cgst: number;
  sgst: number;
  billData: BillData | null;
  onCustomerNameChange: (value: string) => void;
  onPaymentMethodChange: (value: string) => void;
  onProductChange: (index: number, productId: string) => void;
  onItemChange: (
    index: number,
    field: keyof SaleItem,
    value: string | number,
  ) => void;
  onRemoveRow: (index: number) => void;
  onSubmit: () => void;
  printRef: React.RefObject<HTMLDivElement | null>;
}

export const SaleForm = ({
  editingId,
  customerName,
  paymentMethod,
  items,
  subtotal,
  totalGST,
  total,
  cgst,
  sgst,
  billData,
  onCustomerNameChange,
  onPaymentMethodChange,
  onProductChange,
  onItemChange,
  onRemoveRow,
  onSubmit,
  printRef,
}: SaleFormProps) => {
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
        {editingId ? "Edit Sale" : "Create Sale"}
      </h2>

      <CustomerDetails
        customerName={customerName}
        paymentMethod={paymentMethod}
        onCustomerNameChange={onCustomerNameChange}
        onPaymentMethodChange={onPaymentMethodChange}
      />

      <ProductsTable
        items={items}
        onProductChange={onProductChange}
        onItemChange={onItemChange}
        onRemoveRow={onRemoveRow}
      />

      <GSTBreakdown
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
          {editingId ? "Update Sale" : "Complete Sale"}
        </button>
      </div>

      {billData && (
        <div className="hidden">
          <BillPrint ref={printRef} {...billData} />
        </div>
      )}
    </div>
  );
};
