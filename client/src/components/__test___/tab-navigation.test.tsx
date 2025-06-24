import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import TabNavigation from '../tab-navigation';

// Mock Navigation Components
vi.mock('@headlessui/react', () => ({
    TabGroup: (props: any) => <div data-testid="TabGroup">{props.children}</div>,
    TabList: (props: any) => <div data-testid="TabList">{props.children}</div>,
    Tab: (props: any) => <div data-testid="Tab">{props.children}</div>,
}));

vi.mock('lucide-react', () => ({
    Home: (props: any) => <svg data-testid="icon-home" {...props} />,
    BookOpen: (props: any) => <svg data-testid="icon-bookopen" {...props} />,
}));

vi.mock('react-router', async importOriginal => {
    const actual = (await importOriginal()) as Record<string, unknown>;
    return {
        ...actual,
        Outlet: () => <div data-testid="Outlet" />,
        NavLink: ({ to, children, className }: any) => (
            <a
                href={to}
                className={
                    typeof className === 'function' ? className({ isActive: false }) : className
                }
            >
                {children}
            </a>
        ),
        useSearchParams: () => [new URLSearchParams(), vi.fn()],
    };
});

describe('TabNavigation', () => {
    it('renders navigation bar', () => {
        render(
            <MemoryRouter>
                <TabNavigation />
            </MemoryRouter>,
        );
        // Top nav (hidden on small screens)
        expect(screen.getAllByTestId('TabGroup').length).toBe(2);
        // Bottom nav (visible on small screens)
        expect(screen.getAllByTestId('TabList').length).toBe(2);
    });

    it('renders Home and Library tabs in both navigations', () => {
        render(
            <MemoryRouter>
                <TabNavigation />
            </MemoryRouter>,
        );
        expect(screen.getAllByText('Home').length).toBe(2);
        expect(screen.getAllByText('Library').length).toBe(2);
    });

    it('renders icons for Home and Library in bottom navigation', () => {
        render(
            <MemoryRouter>
                <TabNavigation />
            </MemoryRouter>,
        );
        expect(screen.getAllByTestId('icon-home').length).toBe(1);
        expect(screen.getAllByTestId('icon-bookopen').length).toBe(1);
    });

    it('renders Outlet for page content', () => {
        render(
            <MemoryRouter>
                <TabNavigation />
            </MemoryRouter>,
        );
        expect(screen.getByTestId('Outlet')).toBeInTheDocument();
    });

    it('navigation links have correct hrefs', () => {
        render(
            <MemoryRouter>
                <TabNavigation />
            </MemoryRouter>,
        );
        // There should be links for home and library
        const links = screen.getAllByRole('link');
        expect(links.some(link => link.getAttribute('href') === 'home')).toBeTruthy();
        expect(links.some(link => link.getAttribute('href') === 'library')).toBeTruthy();
    });
});
