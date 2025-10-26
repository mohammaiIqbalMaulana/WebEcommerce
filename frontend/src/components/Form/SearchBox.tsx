import { ChangeEvent, useState, useEffect, useRef } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  searchQuery: string;
  handleSearchQueryChange: (e: ChangeEvent<HTMLInputElement>) => void;
  suggestions?: string[];
  onSuggestionClick?: (suggestion: string) => void;
};

export const SearchBox = (props: Props) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    // Mock suggestions - in real app, this would come from API
    const mockSuggestions = [
        "laptop", "phone", "headphones", "watch", "tablet",
        "camera", "speaker", "mouse", "keyboard", "monitor"
    ].filter(suggestion =>
        suggestion.toLowerCase().includes(props.searchQuery.toLowerCase()) &&
        props.searchQuery.length > 0
    );

    const filteredSuggestions = props.suggestions || mockSuggestions;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
                setIsFocused(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        props.handleSearchQueryChange(e);
        setShowSuggestions(true);
    };

    const handleSuggestionClick = (suggestion: string) => {
        if (props.onSuggestionClick) {
            props.onSuggestionClick(suggestion);
        } else {
            // Create a synthetic event for backward compatibility
            const syntheticEvent = {
                target: { value: suggestion }
            } as ChangeEvent<HTMLInputElement>;
            props.handleSearchQueryChange(syntheticEvent);
        }
        setShowSuggestions(false);
    };

    const clearSearch = () => {
        const syntheticEvent = {
            target: { value: '' }
        } as ChangeEvent<HTMLInputElement>;
        props.handleSearchQueryChange(syntheticEvent);
        setShowSuggestions(false);
    };

    return (
        <div ref={searchRef} className="relative mr-0 sm:mr-8 w-full sm:w-auto">
            <motion.div
                className="relative"
                animate={{
                    scale: isFocused ? 1.02 : 1,
                    boxShadow: isFocused ? "0 0 0 3px rgba(59, 130, 246, 0.1)" : "0 0 0 0px rgba(59, 130, 246, 0)"
                }}
                transition={{ duration: 0.2 }}
            >
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FiSearch className={`w-5 h-5 transition-colors ${isFocused ? 'text-blue-500' : 'text-gray-400'}`} />
                </div>
                <input
                    id="search"
                    type="text"
                    placeholder="Search for products..."
                    className="w-full md:w-64 xl:w-80 px-4 py-3 pl-10 pr-10 rounded-xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    value={props.searchQuery}
                    onChange={handleInputChange}
                    onFocus={() => {
                        setIsFocused(true);
                        if (props.searchQuery.length > 0) setShowSuggestions(true);
                    }}
                    onBlur={() => setIsFocused(false)}
                />
                <AnimatePresence>
                    {props.searchQuery && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="absolute inset-y-0 right-0 flex items-center pr-3"
                            onClick={clearSearch}
                        >
                            <FiX className="w-5 h-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors" />
                        </motion.button>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Search Suggestions */}
            <AnimatePresence>
                {showSuggestions && filteredSuggestions.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 max-h-64 overflow-y-auto"
                    >
                        {filteredSuggestions.map((suggestion, index) => (
                            <motion.button
                                key={suggestion}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors first:rounded-t-xl last:rounded-b-xl flex items-center"
                                onClick={() => handleSuggestionClick(suggestion)}
                            >
                                <FiSearch className="w-4 h-4 mr-3 text-gray-400" />
                                <span className="text-gray-900 dark:text-white">{suggestion}</span>
                            </motion.button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
