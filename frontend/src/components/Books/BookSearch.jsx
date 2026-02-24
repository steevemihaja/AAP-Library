import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import Select from 'react-select';

const genres = [
    'Fiction', 'Non-Fiction', 'Science Fiction', 'Fantasy', 
    'Mystery', 'Thriller', 'Romance', 'Biography', 'History',
    'Self-Help', 'Poetry', 'Drama', 'Horror', 'Adventure',
    'Children', 'Young Adult', 'Classic'
];

const BookSearch = ({ onSearch }) => {
    const [filters, setFilters] = useState({
        search: '',
        genre: '',
        author: '',
        language: '',
        minRating: '',
        maxRating: '',
        status: ''
    });
    
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            onSearch(filters);
        }, 500);

        return () => clearTimeout(timer);
    }, [filters, onSearch]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (selected, name) => {
        setFilters(prev => ({ ...prev, [name]: selected?.value || '' }));
    };

    const clearFilters = () => {
        setFilters({
            search: '',
            genre: '',
            author: '',
            language: '',
            minRating: '',
            maxRating: '',
            status: ''
        });
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center space-x-4">
                <div className="flex-1 relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        name="search"
                        value={filters.search}
                        onChange={handleChange}
                        placeholder="Search by title, author, or ISBN..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center"
                >
                    <FunnelIcon className="h-5 w-5 mr-2" />
                    Filters
                </button>
            </div>

            {showFilters && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Select
                        placeholder="Genre"
                        options={genres.map(g => ({ value: g, label: g }))}
                        isClearable
                        onChange={(selected) => handleSelectChange(selected, 'genre')}
                        className="react-select-container"
                        classNamePrefix="react-select"
                    />
                    
                    <input
                        type="text"
                        name="author"
                        value={filters.author}
                        onChange={handleChange}
                        placeholder="Author"
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    
                    <input
                        type="text"
                        name="language"
                        value={filters.language}
                        onChange={handleChange}
                        placeholder="Language"
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    
                    <div className="flex space-x-2">
                        <input
                            type="number"
                            name="minRating"
                            value={filters.minRating}
                            onChange={handleChange}
                            placeholder="Min Rating"
                            min="0"
                            max="5"
                            step="0.5"
                            className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="number"
                            name="maxRating"
                            value={filters.maxRating}
                            onChange={handleChange}
                            placeholder="Max Rating"
                            min="0"
                            max="5"
                            step="0.5"
                            className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    
                    <select
                        name="status"
                        value={filters.status}
                        onChange={handleChange}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All Status</option>
                        <option value="available">Available</option>
                        <option value="limited">Limited</option>
                        <option value="unavailable">Unavailable</option>
                    </select>
                    
                    <button
                        onClick={clearFilters}
                        className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                        Clear Filters
                    </button>
                </div>
            )}
        </div>
    );
};

export default BookSearch;