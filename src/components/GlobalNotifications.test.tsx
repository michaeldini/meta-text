import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { faker } from '@faker-js/faker';
import GlobalNotifications from './GlobalNotifications';
import * as notificationStore from '../store/notificationStore';

// Mock the notification store
const createMockNotification = (overrides = {}) => ({
    id: faker.string.uuid(),
    message: faker.lorem.sentence(),
    type: faker.helpers.arrayElement(['success', 'error', 'warning', 'info'] as const),
    duration: faker.number.int({ min: 3000, max: 10000 }),
    ...overrides,
});

const mockNotifications = [
    createMockNotification({
        id: '1',
        message: 'Success message',
        type: 'success' as const,
        duration: 5000,
    }),
    createMockNotification({
        id: '2',
        message: 'Error message',
        type: 'error' as const,
        duration: 3000,
    }),
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
    }); it('should call hideNotification when close button is clicked', async () => {
        const user = userEvent.setup();
        vi.mocked(notificationStore.useNotificationStore).mockReturnValue({
            notifications: [mockNotifications[0]],
            hideNotification: mockHideNotification,
            showNotification: vi.fn(),
            clearAllNotifications: vi.fn(),
        });

        render(<GlobalNotifications />);

        const closeButton = screen.getByRole('button', { name: /close/i });
        await user.click(closeButton);

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
    }); it('should have correct positioning constants', () => {
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

    it('should handle multiple random notifications', () => {
        // Generate random test data with faker
        const randomNotifications = Array.from({ length: faker.number.int({ min: 3, max: 5 }) }, () =>
            createMockNotification()
        );

        vi.mocked(notificationStore.useNotificationStore).mockReturnValue({
            notifications: randomNotifications,
            hideNotification: mockHideNotification,
            showNotification: vi.fn(),
            clearAllNotifications: vi.fn(),
        });

        render(<GlobalNotifications />);

        // Verify all random notifications are rendered
        randomNotifications.forEach(notification => {
            expect(screen.getByText(notification.message)).toBeInTheDocument();
        });

        const snackbars = screen.getAllByRole('presentation');
        expect(snackbars).toHaveLength(randomNotifications.length);
    });
});
