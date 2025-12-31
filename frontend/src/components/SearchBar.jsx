import { FiSearch } from 'react-icons/fi';

const SearchBar = ({ value, onChange, placeholder = "Search articles..." }) => {
    return (
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="input pl-12 w-full"
            />
        </div>
    );
};

export default SearchBar;
