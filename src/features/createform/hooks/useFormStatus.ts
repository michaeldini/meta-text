import { useState } from 'react';

export function useFormStatus(initialTitle = '') {
    const [title, setTitle] = useState(initialTitle);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const resetStatus = () => {
        setError('');
        setSuccess('');
    };

    return {
        title,
        setTitle,
        error,
        setError,
        success,
        setSuccess,
        loading,
        setLoading,
        resetStatus,
    };
}
