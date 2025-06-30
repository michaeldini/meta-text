import { createSourceDocument, createMetaText } from 'services';
import { FormSubmissionService } from '../types';

export class CreateFormService implements FormSubmissionService {
    async submitUpload(title: string, file: File): Promise<void> {
        await createSourceDocument(title, file);
    }

    async submitMetaText(sourceDocId: number, title: string): Promise<void> {
        await createMetaText(sourceDocId, title);
    }
}

// Default service instance
export const createFormService = new CreateFormService();
