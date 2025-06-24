import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { PodcastListFolder } from '../podcast-list-folder';

// Mock Disclosure components from @headlessui/react
vi.mock('@headlessui/react', () => ({
    Disclosure: ({ children, ...props }: any) => (
        <div data-testid="Disclosure" {...props}>
            {children}
        </div>
    ),
    DisclosureButton: ({ children, ...props }: any) => (
        <button data-testid="DisclosureButton" {...props}>
            {children}
        </button>
    ),
    DisclosurePanel: ({ children, ...props }: any) => (
        <div data-testid="DisclosurePanel" {...props}>
            {children}
        </div>
    ),
}));

// Mock ChevronDownIcon
vi.mock('lucide-react', () => ({
    ChevronDownIcon: (props: any) => <svg data-testid="ChevronDownIcon" {...props} />,
}));

// Mock PodcastListCard
vi.mock('../podcast-list-card', () => ({
    PodcastListCard: ({ item, onDelete }: any) => (
        <div data-testid="PodcastListCard">
            {item.podcast_id} - {item.library_name}
            <button onClick={() => onDelete(item)} data-testid="delete-btn">
                Delete
            </button>
        </div>
    ),
}));

const mockItems = [
    {
        podcast_id: '1',
        library_name: 'Favorites',
        user_id: 1,
        podcast_info: { name: 'Podcast One' },
    },
    {
        podcast_id: '2',
        library_name: 'Favorites',
        user_id: 1,
        podcast_info: { name: 'Podcast Two' },
    },
    {
        podcast_id: '3',
        library_name: 'To Listen',
        user_id: 1,
        podcast_info: { name: 'Podcast Three' },
    },
];

describe('PodcastListFolder', () => {
    it('renders loading state', () => {
        render(<PodcastListFolder items={[]} isLoading={true} onItemDelete={vi.fn()} />);
        expect(screen.getByText('Loading Library')).toBeInTheDocument();
    });

    it('renders grouped library folders', () => {
        render(
            <PodcastListFolder items={mockItems as any} isLoading={false} onItemDelete={vi.fn()} />,
        );
        expect(screen.getAllByTestId('Disclosure').length).toBe(2);
        expect(screen.getByText('FAVORITES')).toBeInTheDocument();
        expect(screen.getByText('TO LISTEN')).toBeInTheDocument();
    });

    it('renders PodcastListCard for each item', () => {
        render(
            <PodcastListFolder items={mockItems as any} isLoading={false} onItemDelete={vi.fn()} />,
        );
        expect(screen.getAllByTestId('PodcastListCard').length).toBe(3);
        expect(screen.getByText('1 - Favorites')).toBeInTheDocument();
        expect(screen.getByText('2 - Favorites')).toBeInTheDocument();
        expect(screen.getByText('3 - To Listen')).toBeInTheDocument();
    });

    it('calls onItemDelete when delete button is clicked', () => {
        const onDelete = vi.fn();
        render(
            <PodcastListFolder
                items={mockItems as any}
                isLoading={false}
                onItemDelete={onDelete}
            />,
        );
        const deleteButtons = screen.getAllByTestId('delete-btn');
        fireEvent.click(deleteButtons[0]);
        expect(onDelete).toHaveBeenCalledWith(mockItems[0]);
    });

    it('renders ChevronDownIcon in each DisclosureButton', () => {
        render(
            <PodcastListFolder items={mockItems as any} isLoading={false} onItemDelete={vi.fn()} />,
        );
        expect(screen.getAllByTestId('ChevronDownIcon').length).toBe(2);
    });
});
