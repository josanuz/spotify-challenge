import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { LibraryItem, SpotifyPodcast } from '../../types/spotify-api';
import PodcastGrid from '../podcast-grid';

const mockPodcasts = [
    {
        id: '1',
        name: 'Podcast One',
        publisher: 'Publisher A',
        description: 'Description for podcast one.',
        images: [{ url: 'http://image1.jpg' }],
    },
    {
        id: '2',
        name: 'Podcast Two',
        publisher: 'Publisher B',
        description: 'Description for podcast two.',
        images: [{ url: 'http://image2.jpg' }],
    },
] as SpotifyPodcast[];

const mockLibrary = [{ podcast_id: '1' }] as LibraryItem[];

describe('PodcastGrid', () => {
    it('renders all podcasts', () => {
        render(<PodcastGrid podcasts={mockPodcasts} library={[]} />);
        expect(screen.getByText('Podcast One')).toBeInTheDocument();
        expect(screen.getByText('Podcast Two')).toBeInTheDocument();
    });

    it('shows checkmark for podcasts in library', () => {
        render(<PodcastGrid podcasts={mockPodcasts} library={mockLibrary} />);
        // Podcast One should have a checkmark, Podcast Two should have an add button
        expect(screen.getByLabelText('Podcast One is on library')).toBeInTheDocument();
        expect(screen.getByLabelText('Add Podcast Two')).toBeInTheDocument();
    });

    it('calls onAdd when add button is clicked', () => {
        const onAdd = vi.fn();
        render(<PodcastGrid podcasts={mockPodcasts} library={mockLibrary} onAdd={onAdd} />);
        const addButton = screen.getByLabelText('Add Podcast Two');
        fireEvent.click(addButton);
        expect(onAdd).toHaveBeenCalledWith(mockPodcasts[1]);
    });

    it('calls onView when view button is clicked', () => {
        const onView = vi.fn();
        render(<PodcastGrid podcasts={mockPodcasts} library={[]} onView={onView} />);
        const viewButtons = screen.getAllByLabelText(/View/);
        fireEvent.click(viewButtons[0]);
        expect(onView).toHaveBeenCalledWith(mockPodcasts[0]);
    });

    it('renders podcast images with correct src and alt', () => {
        render(<PodcastGrid podcasts={mockPodcasts} library={[]} />);
        const images = screen.getAllByRole('img');
        expect(images[0]).toHaveAttribute('src', 'http://image1.jpg');
        expect(images[0]).toHaveAttribute('alt', 'Podcast One');
        expect(images[1]).toHaveAttribute('src', 'http://image2.jpg');
        expect(images[1]).toHaveAttribute('alt', 'Podcast Two');
    });

    it('renders publisher and description', () => {
        render(<PodcastGrid podcasts={mockPodcasts} library={[]} />);
        expect(screen.getByText('Publisher A')).toBeInTheDocument();
        expect(screen.getByText('Publisher B')).toBeInTheDocument();
        expect(screen.getByText('Description for podcast one.')).toBeInTheDocument();
        expect(screen.getByText('Description for podcast two.')).toBeInTheDocument();
    });
});
