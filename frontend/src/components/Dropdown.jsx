import { useEffect, useRef, useState } from "react";

const Dropdown = ({ label, options, selected, onSelect, disabled }) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const inputRef = useRef(null);

  const handleClick = (value) => {
    onSelect(value);
    setOpen(false);
    setSearchTerm("");
  };

  const toggleDropdown = () => {
    if (!disabled) {
      setOpen((prev) => !prev);
    }
  };

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const filteredOptions = options.filter((item) =>
    item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative w-64">
      <button
        onClick={toggleDropdown}
        className={`w-full p-2 text-left border rounded-md ${
          disabled ? "bg-gray-700 cursor-not-allowed" : "bg-gray-900"
        }`}
        disabled={disabled}
      >
        {selected || label}
      </button>

      {open && (
        <div className="absolute top-full mt-1 max-h-60 overflow-y-auto bg-gray-800 border border-gray-600 rounded-md shadow-lg z-50 w-full">
          {/* Search Input */}
          <div className="p-2 sticky top-0 bg-gray-800 z-10">
            <input
              type="text"
              ref={inputRef}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-2 py-1 rounded-md bg-gray-900 text-white border border-gray-700 focus:outline-none"
              placeholder="Search..."
            />
          </div>

          {/* Filtered Options */}
          {filteredOptions.length > 0 ? (
            filteredOptions.map((item, index) => (
              <div
                key={index}
                onClick={() => handleClick(item)}
                className="p-2 hover:bg-gray-700 cursor-pointer"
              >
                {item}
              </div>
            ))
          ) : (
            <div className="p-2 text-gray-400">No results found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
