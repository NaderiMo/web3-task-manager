import { Search } from "lucide-react";
import React, { useEffect, useState } from "react";

interface SearchAndFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const SearchTask: React.FC<SearchAndFilterProps> = ({
  searchQuery,
  onSearchChange,
}) => {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(localSearchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [localSearchQuery]);

  useEffect(() => {
    onSearchChange(debouncedSearchQuery);
  }, [debouncedSearchQuery, onSearchChange]);

  return (
    <div className="p-4 space-y-3 bg-gray-50 border-b">
      <div className="flex gap-3 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 w-4 h-4 text-gray-400 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tasks by title or description..."
            value={localSearchQuery}
            onChange={(e) => setLocalSearchQuery(e.target.value)}
            className="py-2 pr-4 pl-10 w-full rounded-lg border border-gray-300 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80"
          />
        </div>
      </div>
    </div>
  );
};

export default SearchTask;
