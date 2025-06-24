import { cleanup } from '@testing-library/react';
import { afterAll } from 'vitest';

afterAll(() => {
    cleanup();
});
