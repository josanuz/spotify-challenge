import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom';
import { render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import { act } from 'react';
import { MemoryRouter } from 'react-router';
import { afterEach, describe, expect, it, vi } from 'vitest';
import * as podcastApi from '../../api/podcast';
import * as searchApi from '../../api/search';
import type { SpotifyPodcast } from '../../types/spotify-api';
import { Home } from '../home';

const params = vi.hoisted(() => new URLSearchParams());

// Mock PodcastGrid component
vi.mock('../../components/podcast-grid', () => ({
    __esModule: true,
    default: ({ podcasts, onAdd, onView }: any) => (
        <div data-testid="PodcastGrid">
            {podcasts.map((podcast: any) => (
                <div key={podcast.id}>
                    <span>{podcast.name}</span>
                    <button onClick={() => onAdd(podcast)}>Add</button>
                    <button onClick={() => onView(podcast)}>View</button>
                </div>
            ))}
        </div>
    ),
}));

const exampleSpotifyPodcast = {
    id: 'Test_1',
    name: 'Test Podcast',
    description: 'A sample podcast for testing.',
    publisher: 'Sample Publisher',
    images: [
        {
            url: 'https://example.com/image.jpg',
            height: 640,
            width: 640,
        },
    ],
    total_episodes: 42,
    available_markets: [],
    explicit: false,
} as unknown as SpotifyPodcast;

const mockedPodcastApi = vi.mocked(podcastApi);
const mockedSearchApi = vi.mocked(searchApi);
const querClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
});

// Mock the API modules
vi.mock(import('../../api/podcast'), async () => {
    return {
        getPodcast: vi.fn(),
        addToLibrary: vi.fn(() => Promise.resolve({ success: true })),
        getLibrary: vi.fn(() => Promise.resolve([])),
        removeFromLibrary: vi.fn(() => Promise.resolve({ success: true })),
    };
});

vi.mock(import('../../api/search'), () => ({
    searchPodcasts: vi.fn(),
    searchAudioBooks: vi.fn().mockResolvedValue({ items: [] }),
}));

vi.mock('@zedux/react', async () => {
    const actual = await vi.importActual<typeof import('@zedux/react')>('@zedux/react');
    return {
        ...actual,
        useAtomValue: vi.fn(() => true),
    };
});

vi.mock(import('react-router'), async act => {
    const actual = await act();
    return {
        ...actual,
        useSearchParams: () => [params, vi.fn()],
    };
});

describe('Home', () => {
    afterEach(() => {
        vi.resetAllMocks();
        params.delete('query');
    });

    it('renders loading spinner when queries are loading', async () => {
        mockedPodcastApi.getLibrary.mockImplementationOnce(() => {
            return new Promise(resolve => setTimeout(() => resolve([]), 2000));
        });
        act(() => {
            render(
                <QueryClientProvider client={querClient}>
                    <MemoryRouter>
                        <Home />
                    </MemoryRouter>
                </QueryClientProvider>,
            );
        });

        expect(screen.getByLabelText('spinner')).toBeInTheDocument();
    });

    it('renders error message if any query errors', async () => {
        mockedPodcastApi.getLibrary.mockRejectedValueOnce(new Error('fail'));
        act(() => {
            render(
                <QueryClientProvider client={querClient}>
                    <MemoryRouter>
                        <Home />
                    </MemoryRouter>
                </QueryClientProvider>,
            );
        });
        await waitForElementToBeRemoved(() => screen.getByLabelText('spinner'), { timeout: 10000 });
    });

    it('renders "No Results found" if no data', async () => {
        params.set('query', 'text');
        mockedPodcastApi.getLibrary.mockResolvedValueOnce([]);
        mockedSearchApi.searchPodcasts.mockResolvedValueOnce({
            href: '',
            items: [],
            limit: 0,
            next: '',
            offset: 0,
            total: 0,
        });
        act(() => {
            render(
                <QueryClientProvider client={querClient}>
                    <MemoryRouter>
                        <Home />
                    </MemoryRouter>
                </QueryClientProvider>,
            );
        });
        await waitFor(() => expect(screen.getByText('No Results Found')).toBeInTheDocument(), {
            timeout: 3000,
        });
    });

    it('renders PodcastGrid if data is present', async () => {
        params.set('query', 'text');

        mockedPodcastApi.getLibrary.mockResolvedValue([
            { library_name: 'default', podcast_id: 'podcast_1', user_id: 1 },
        ]);
        mockedSearchApi.searchPodcasts.mockResolvedValue({
            items: [exampleSpotifyPodcast],
            total: 1,
            href: '',
            limit: 1,
            next: 'false',
            offset: 0,
        });
        act(() => {
            render(
                <QueryClientProvider client={querClient}>
                    <MemoryRouter>
                        <Home />
                    </MemoryRouter>
                </QueryClientProvider>,
            );
        });

        await waitFor(() => expect(screen.getByTestId('PodcastGrid')).toBeInTheDocument());
        expect(screen.getByText('Test Podcast')).toBeInTheDocument();
    });
});
