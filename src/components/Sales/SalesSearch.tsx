interface SalesSearchProps {
  search: string;
  onSearchChange: (value: string) => void;
}

export const SalesSearch = ({ search, onSearchChange }: SalesSearchProps) => {
  return (
    <div className="mb-6">
      <div className="relative">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value.trimStart())}
          className="border px-3 py-2 rounded-lg w-96 dark:bg-slate-900 dark:border-slate-700 dark:text-white pl-10"
        />
        <svg
          className="absolute left-3 top-3 h-4 w-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
        🔍 Search across customer names, invoice numbers, and product names
      </p>
    </div>
  );
};
