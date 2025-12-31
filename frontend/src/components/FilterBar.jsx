const FilterBar = ({ filter, onFilterChange }) => {
    const filters = [
        { value: 'all', label: 'All Articles' },
        { value: 'original', label: 'Original Only' },
        { value: 'updated', label: 'Updated Only' }
    ];

    return (
        <div className="flex flex-wrap gap-3">
            {filters.map((f) => (
                <button
                    key={f.value}
                    onClick={() => onFilterChange(f.value)}
                    className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${filter === f.value
                            ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg scale-105'
                            : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
                        }`}
                >
                    {f.label}
                </button>
            ))}
        </div>
    );
};

export default FilterBar;
