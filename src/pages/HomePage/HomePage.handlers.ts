import { DocType } from '../../types/docTypes';
import { ROUTES, MESSAGES } from 'constants';
import log from '../../utils/logger';
import { getErrorMessage } from '../../types/error';
import { NavigateFunction } from 'react-router-dom';

export function getDeleteActions(deleteSourceDoc: any, deleteMetaText: any) {
    return {
        [DocType.SourceDoc]: deleteSourceDoc,
        [DocType.MetaText]: deleteMetaText,
    };
}

export function getRouteMap() {
    return {
        [DocType.SourceDoc]: ROUTES.SOURCE_DOC,
        [DocType.MetaText]: ROUTES.META_TEXT,
    };
}

export function handleNavigationFactory(navigate: NavigateFunction, routeMap: any) {
    return (docType: DocType, id: number) => {
        log.info(`Navigating to ${docType} with id: ${id}`);
        navigate(`${routeMap[docType]}/${id}`);
    };
}

export function handleDeleteFactory(deleteActions: any, showSuccess: any, showError: any, navigate: NavigateFunction) {
    return async (docType: DocType, id: number, e: React.MouseEvent) => {
        if (e?.stopPropagation) e.stopPropagation();
        try {
            await deleteActions[docType](id);
            showSuccess(MESSAGES.DELETE_SUCCESS[docType as keyof typeof MESSAGES.DELETE_SUCCESS]);
        } catch (error: unknown) {
            log.error(`Delete ${docType} failed`, error);
            showError(getErrorMessage(error, MESSAGES.DELETE_ERROR[docType as keyof typeof MESSAGES.DELETE_ERROR]));
        }
    };
}

export function handleSourceDocClickFactory(handleNavigation: any) {
    return (id: number) => handleNavigation(DocType.SourceDoc, id);
}

export function handleMetaTextClickFactory(handleNavigation: any) {
    return (id: number) => handleNavigation(DocType.MetaText, id);
}

export function handleDeleteSourceDocFactory(handleDelete: any) {
    return (id: number, e: React.MouseEvent) => handleDelete(DocType.SourceDoc, id, e);
}

export function handleDeleteMetaTextFactory(handleDelete: any) {
    return (id: number, e: React.MouseEvent) => handleDelete(DocType.MetaText, id, e);
}
