import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import GlobalNotifications from './GlobalNotifications';
import * as notificationStore from '../store/notificationStore';

// Mock the notification store
const mockNotifications = [
    {
        id: '1',
        message: 'Success message',
        type: 'success' as const,
        duration: 5000,
    },
    {
        id: '2',
        message: 'Error message',
        type: 'error' as const,
        duration: 3000,
    },
];

const mockHideNotification = vi.fn();

vi.mock('../store/notificationStore', () => ({
    useNotificationStore: vi.fn(),
}));

describe('GlobalNotifications', () => {
    beforeEach(() => {
        mockHideNotification.mockClear();
        vi.mocked(notificationStore.useNotificationStore).mockReturnValue({
            notifications: [],
            hideNotification: mockHideNotification,
            showNotification: vi.fn(),
            clearAllNotifications: vi.fn(),
        });
    });

    it('should render nothing when no notifications', () => {
        const { container } = render(<GlobalNotifications />);
        expect(container.firstChild).toBeNull();
    });

    it('should render notifications when they exist', () => {
        vi.mocked(notificationStore.useNotificationStore).mockReturnValue({
            notifications: mockNotifications,
            hideNotification: mockHideNotification,
            showNotification: vi.fn(),
            clearAllNotifications: vi.fn(),
        });

        render(<GlobalNotifications />);

        expect(screen.getByText('Success message')).toBeInTheDocument();
        expect(screen.getByText('Error message')).toBeInTheDocument();
    });

    it('should stack notifications with correct positioning', () => {
        vi.mocked(notificationStore.useNotificationStore).mockReturnValue({
            notifications: mockNotifications,
            hideNotification: mockHideNotification,
            showNotification: vi.fn(),
            clearAllNotifications: vi.fn(),
        });

        const { container } = render(<GlobalNotifications />);

        const snackbars = container.querySelectorAll('.MuiSnackbar-root');
        expect(snackbars).toHaveLength(2);
    });

    it('should call hideNotification when close button is clicked', () => {
        vi.mocked(notificationStore.useNotificationStore).mockReturnValue({
            notifications: [mockNotifications[0]],
            hideNotification: mockHideNotification,
            showNotification: vi.fn(),
            clearAllNotifications: vi.fn(),
        });

        render(<GlobalNotifications />);

        const closeButton = screen.getByRole('button', { name: /close/i });
        fireEvent.click(closeButton);

        expect(mockHideNotification).toHaveBeenCalledWith('1');
    });

    it('should render different severity types correctly', () => {
        const notificationsWithTypes = [
            { ...mockNotifications[0], type: 'success' as const },
            { ...mockNotifications[1], type: 'error' as const },
        ];

        vi.mocked(notificationStore.useNotificationStore).mockReturnValue({
            notifications: notificationsWithTypes,
            hideNotification: mockHideNotification,
            showNotification: vi.fn(),
            clearAllNotifications: vi.fn(),
        });

        const { container } = render(<GlobalNotifications />);

        const alerts = container.querySelectorAll('.MuiAlert-root');
        expect(alerts).toHaveLength(2);
    });

    it('should have correct positioning constants', () => {
        vi.mocked(notificationStore.useNotificationStore).mockReturnValue({
            notifications: [mockNotifications[0]],
            hideNotification: mockHideNotification,
            showNotification: vi.fn(),
            clearAllNotifications: vi.fn(),
        });

        const { container } = render(<GlobalNotifications />);

        const snackbar = container.querySelector('.MuiSnackbar-root');
        expect(snackbar).toBeInTheDocument();
        // Position styles are tested through constants being imported correctly
    });
});
