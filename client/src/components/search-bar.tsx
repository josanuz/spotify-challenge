export const SearchBar = ({ onsubmit }: { onsubmit: (query: string) => void }) => {
    return (
        <input
            id="search-bar"
            type="text"
            placeholder="Search..."
            className="w-full max-w-md p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            onKeyDown={e => {
                if (e.key === 'Enter') {
                    const query = (e.target as HTMLInputElement).value.trim();
                    if (query) {
                        onsubmit(query);
                    }
                }
            }}
        />
    );
};
