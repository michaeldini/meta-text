import { FormEvent } from 'react';

interface HandleFormSubmitParams {
    e: FormEvent<HTMLFormElement>;
    resetStatus: () => void;
    setLoading: (b: boolean) => void;
    setError: (msg: string) => void;
    setSuccess: (msg: string) => void;
    action: () => Promise<void>;
    validate: () => string | null;
    onSuccess?: () => void;
    resetFields?: () => void;
    successMsg?: string;
}

export async function handleFormSubmit({
    e,
    resetStatus,
    setLoading,
    setError,
    setSuccess,
    action,
    validate,
    onSuccess,
    resetFields,
    successMsg = 'Success!',
}: HandleFormSubmitParams) {
    e.preventDefault();
    resetStatus();
    setLoading(true);
    try {
        const validationError = validate();
        if (validationError) {
            setError(validationError);
            setLoading(false);
            return;
        }
        await action();
        setSuccess(successMsg);
        if (resetFields) resetFields();
        if (onSuccess) onSuccess();
    } catch (err: any) {
        setError(err?.message || 'An error occurred');
    } finally {
        setLoading(false);
    }
}
