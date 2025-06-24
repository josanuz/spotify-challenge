import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { SpotifyPodcast } from '../../types/spotify-api';
import { PodcastDetails } from '../podcast-details';

const mockPodcast = {
    id: 'abc123',
    name: 'Test Podcast',
    publisher: 'Test Publisher',
    images: [{ url: 'http://test.com/image.jpg' }],
    description: 'A test podcast description.',
    html_description: '<b>HTML Description</b>',
    languages: ['en', 'es'],
    total_episodes: 42,
    explicit: true,
} as SpotifyPodcast;

const contentMatcher = (text: string) => (content: string, node: Element | null) =>
    node?.textContent == text;

describe('PodcastDetails', () => {
    it('renders podcast image, name, publisher, and description', () => {
        render(<PodcastDetails podcast={mockPodcast} />);
        expect(screen.getByRole('img')).toHaveAttribute('src', 'http://test.com/image.jpg');
        expect(screen.getByRole('img')).toHaveAttribute('alt', 'Test Podcast');
        expect(screen.getByText('Test Podcast')).toBeInTheDocument();
        expect(screen.getByText('Test Publisher')).toBeInTheDocument();
        expect(screen.getByText('HTML Description', { selector: 'b' })).toBeInTheDocument();
    });

    it('renders languages, episodes, and explicit status', () => {
        render(<PodcastDetails podcast={mockPodcast} />);
        expect(screen.getByText(contentMatcher('Languages: en, es'))).toBeInTheDocument();
        expect(screen.getByText(contentMatcher('Episodes: 42'))).toBeInTheDocument();
        expect(screen.getByText(contentMatcher('Explicit: Yes'))).toBeInTheDocument();
    });

    it('falls back to plain description if html_description is missing', () => {
        const podcast = { ...mockPodcast, html_description: undefined };
        render(<PodcastDetails podcast={podcast} />);
        expect(screen.getByText('A test podcast description.')).toBeInTheDocument();
    });

    it('shows "Explicit: No" if explicit is false', () => {
        const podcast = { ...mockPodcast, explicit: false };
        render(<PodcastDetails podcast={podcast} />);
        expect(screen.getByText(contentMatcher('Explicit: No'))).toBeInTheDocument();
    });

    it('handles missing images gracefully', () => {
        const podcast = { ...mockPodcast, images: [] };
        render(<PodcastDetails podcast={podcast} />);
        expect(screen.getByRole('img')).not.toHaveAttribute('src');
    });
});
