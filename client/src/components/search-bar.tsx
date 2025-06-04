// This file contains the SearchBar component, which is used to search for podcasts or other items.

/**
 * SearchBar component props.
 * @property onsubmit - Function to call when the user submits a search query.
 * @property current - The current search query, if any.
 */
export interface SearcBarProps {
    onsubmit: (query: string) => void;
    current: string | null;
}

export const SearchBar = ({ onsubmit, current }: SearcBarProps) => {
    return (
        <input
            id="search-bar"
            type="text"
            defaultValue={current ?? ''}
            placeholder="Search..."
            className="w-full max-w-md p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            onBlur={e => {
                const query = e.target.value.trim();
                if (query) {
                    onsubmit(query);
                }
            }}
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
