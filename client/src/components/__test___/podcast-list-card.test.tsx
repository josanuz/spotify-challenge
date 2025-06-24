import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { LibraryItem } from '../../types/spotify-api';
import { PodcastListCard } from '../podcast-list-card';

const mockItem: LibraryItem = {
    library_name: 'default',
    podcast_id: '1',
    user_id: 1,
    podcast_info: {
        name: 'Test Podcast',
        publisher: 'Test Publisher',
        images: [{ url: 'http://test.com/image.jpg' }],
    },
};

const mockItemWithoutInfo: LibraryItem = {
    library_name: 'default',
    podcast_id: '2',
    user_id: 1,
};

describe('PodcastListCard', () => {
    it('renders podcast name, publisher, and image', () => {
        render(<PodcastListCard item={mockItem} onDelete={vi.fn()} />);
        expect(screen.getByText('Test Podcast')).toBeInTheDocument();
        expect(screen.getByText('Test Publisher')).toBeInTheDocument();
        const img = screen.getByRole('img');
        expect(img).toHaveAttribute('src', 'http://test.com/image.jpg');
        expect(img).toHaveAttribute('alt', 'Test Podcast');
    });

    it('calls onDelete when trash button is clicked', () => {
        const onDelete = vi.fn();
        render(<PodcastListCard item={mockItem} onDelete={onDelete} />);
        const button = screen.getByRole('button');
        fireEvent.click(button);
        expect(onDelete).toHaveBeenCalledWith(mockItem);
    });

    it('renders the trash icon', () => {
        render(<PodcastListCard item={mockItem} onDelete={vi.fn()} />);
        expect(screen.getByLabelText('remove 1')).toBeInTheDocument();
    });

    it('handles missing podcast_info gracefully', () => {
        render(<PodcastListCard item={mockItemWithoutInfo} onDelete={vi.fn()} />);
        expect(screen.getByText('No Item Information')).toBeInTheDocument();
    });
});
