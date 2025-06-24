import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import PodcastDialog from '../detailed-view-dialog';

// Hoisted state for react-query
const queryState = vi.hoisted(() => ({ value: {} }));

vi.mock('@tanstack/react-query', () => ({
    useQuery: () => ({ ...queryState.value }),
}));

// Mock dependencies
vi.mock('@headlessui/react', () => ({
    Dialog: ({ className, children }: any) => (
        <div data-testid="Dialog" className={className} tabIndex={-1}>
            {children}
        </div>
    ),
    DialogBackdrop: ({ className }: any) => (
        <div data-testid="DialogBackdrop" className={className} />
    ),
    DialogPanel: ({ className, children }: any) => (
        <div data-testid="DialogPanel" className={className}>
            {children}
        </div>
    ),
}));

vi.mock('react-router', () => ({
    useNavigate: () => vi.fn(),
    useParams: () => ({ id: '123' }),
}));

vi.mock('../api/podcast', () => ({
    getPodcast: vi.fn(),
}));

const mockPodcast = { id: '123', name: 'Test Podcast' };

vi.mock('../../components/podcast-details', () => ({
    PodcastDetails: ({ podcast }: any) => <div data-testid="PodcastDetails">{podcast.name}</div>,
}));

describe('PodcastDialog', () => {
    beforeEach(() => {
        vi.resetModules();
        queryState.value = {};
    });

    it('shows loading spinner when loading', () => {
        queryState.value = { isLoading: true, isError: false, isSuccess: false };
        render(<PodcastDialog />);
        expect(screen.getByTestId('Dialog')).toBeInTheDocument();
        expect(screen.getByTestId('DialogBackdrop')).toBeInTheDocument();
        expect(screen.getByTestId('DialogPanel')).toBeInTheDocument();
        expect(screen.getByLabelText('loading indicator')).toBeInTheDocument();
    });

    it('shows error message on error', () => {
        queryState.value = { isLoading: false, isError: true, isSuccess: false };
        render(<PodcastDialog />);
        expect(screen.getByText(/Error loading podcast details/i)).toBeInTheDocument();
    });

    it('shows podcast details on success', () => {
        queryState.value = { isLoading: false, isError: false, isSuccess: true, data: mockPodcast };
        render(<PodcastDialog />);
        expect(screen.getByTestId('PodcastDetails')).toHaveTextContent('Test Podcast');
    });

    it('does not render PodcastDetails if no data', () => {
        queryState.value = { isLoading: false, isError: false, isSuccess: true, data: null };
        render(<PodcastDialog />);
        expect(screen.queryByTestId('PodcastDetails')).not.toBeInTheDocument();
    });
});
