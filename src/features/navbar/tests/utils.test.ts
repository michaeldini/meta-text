/* eslint-disable */
import { describe, it, expect } from 'vitest';
import { filterNavItems } from '../utils';

// Minimal NavItem shape used by filterNavItems
const makeItem = (label: string, protectedFlag = false) => ({
    label,
    protected: protectedFlag,
    icon: undefined,
    action: () => { },
});

describe('filterNavItems', () => {
    it('shows Login and Register when unauthenticated and hides Logout', () => {
        const items = [makeItem('Home'), makeItem('Login'), makeItem('Register'), makeItem('Logout', true)];
        const filtered = filterNavItems(items as any, false);
        const labels = filtered.map(i => i.label);
        expect(labels).toContain('Login');
        expect(labels).toContain('Register');
        expect(labels).not.toContain('Logout');
    });

    it('shows Logout when authenticated and hides Login/Register', () => {
        const items = [makeItem('Home'), makeItem('Login'), makeItem('Register'), makeItem('Logout', true)];
        const filtered = filterNavItems(items as any, true);
        const labels = filtered.map(i => i.label);
        expect(labels).toContain('Logout');
        expect(labels).not.toContain('Login');
        expect(labels).not.toContain('Register');
    });

    it('respects protected flag for other items', () => {
        const items = [makeItem('Home', true), makeItem('About', false)];
        const filteredUnauth = filterNavItems(items as any, false).map(i => i.label);
        expect(filteredUnauth).not.toContain('Home');
        expect(filteredUnauth).toContain('About');

        const filteredAuth = filterNavItems(items as any, true).map(i => i.label);
        expect(filteredAuth).toContain('Home');
        expect(filteredAuth).toContain('About');
    });
});
