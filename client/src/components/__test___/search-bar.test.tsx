import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SearchBar } from '../search-bar';

describe('SearchBar', () => {
    it('renders with placeholder and current value', () => {
        render(<SearchBar onsubmit={vi.fn()} current="hello" />);
        const input = screen.getByPlaceholderText('Search...');
        expect(input).toBeInTheDocument();
        expect(input).toHaveValue('hello');
    });

    it('calls onsubmit with trimmed value on blur', () => {
        const onsubmit = vi.fn();
        render(<SearchBar onsubmit={onsubmit} current={null} />);
        const input = screen.getByPlaceholderText('Search...');
        fireEvent.change(input, { target: { value: '  podcast  ' } });
        fireEvent.blur(input);
        expect(onsubmit).toHaveBeenCalledWith('podcast');
    });

    it('does not call onsubmit on blur if input is empty', () => {
        const onsubmit = vi.fn();
        render(<SearchBar onsubmit={onsubmit} current={null} />);
        const input = screen.getByPlaceholderText('Search...');
        fireEvent.change(input, { target: { value: '   ' } });
        fireEvent.blur(input);
        expect(onsubmit).not.toHaveBeenCalled();
    });

    it('calls onsubmit with trimmed value on Enter key', () => {
        const onsubmit = vi.fn();
        render(<SearchBar onsubmit={onsubmit} current={null} />);
        const input = screen.getByPlaceholderText('Search...');
        fireEvent.change(input, { target: { value: '  music  ' } });
        fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', charCode: 13 });
        expect(onsubmit).toHaveBeenCalledWith('music');
    });

    it('does not call onsubmit on Enter if input is empty', () => {
        const onsubmit = vi.fn();
        render(<SearchBar onsubmit={onsubmit} current={null} />);
        const input = screen.getByPlaceholderText('Search...');
        fireEvent.change(input, { target: { value: '   ' } });
        fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', charCode: 13 });
        expect(onsubmit).not.toHaveBeenCalled();
    });
});
