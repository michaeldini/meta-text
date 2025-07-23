import { ThemedIcon, ThemedIconProps } from './ThemedIcon';
import {
    ArrowLeftIcon as ArrowLeftSvg,
    Bars3Icon as Bars3Svg,
    MagnifyingGlassIcon as MagnifyingGlassSvg,
    XMarkIcon as XMarkSvg,
    TrashIcon as TrashSvg,
    ArrowUpTrayIcon as ArrowUpTraySvg,
    ArrowUturnLeftIcon as ArrowUturnLeftSvg,
    AdjustmentsHorizontalIcon as AdjustmentsHorizontalSvg,
    DocumentTextIcon as DocumentTextSvg,
    ScissorsIcon as ScissorsSvg,
    QuestionMarkCircleIcon as QuestionMarkCircleSvg,
    DocumentDuplicateIcon as DocumentDuplicateSvg,
    ChevronDownIcon as ChevronDownSvg,
    ChevronUpIcon as ChevronUpSvg,
    SparklesIcon as StarsSvg,
    AcademicCapIcon as AcademicCapSvg,
    PhotoIcon as PhotoSvg,
    HomeIcon as HomeSvg,
    ArrowLeftEndOnRectangleIcon as LoginSvg,
    ArrowLeftStartOnRectangleIcon as LogoutSvg,
    PlusIcon as PlusSvg,
    TicketIcon as TicketSvg,
    ChatBubbleLeftIcon as ChatBubbleLeftSvg,
    DocumentArrowUpIcon as DocumentArrowUpSvg,
    DocumentArrowDownIcon as DocumentArrowDownSvg,
    PencilIcon as PencilSvg,
    CheckIcon as CheckSvg,
    BookmarkIcon as BookmarkSvg,
    ArrowDownTrayIcon as ArrowDownTraySvg,
    StarIcon as StarSvg,
    DocumentCheckIcon as DocumentCheckSvg,
    PencilSquareIcon as PencilSquareSvg,
} from '@heroicons/react/24/solid';

import {
    BookmarkIcon as BookmarkOutlineSvg,
    StarIcon as StarOutlineSvg
} from '@heroicons/react/24/outline';

import { SVGProps } from 'react';

// All icons are typed to accept all ThemedIconProps except 'as'
export type IconProps = Omit<ThemedIconProps, 'as'>;

export const ArrowBackIcon: React.FC<IconProps> = (props) => <ThemedIcon as={ArrowLeftSvg} {...props} />;
export const MenuIcon: React.FC<IconProps> = (props) => <ThemedIcon as={Bars3Svg} {...props} />;
export const SearchIcon: React.FC<IconProps> = (props) => <ThemedIcon as={MagnifyingGlassSvg} {...props} />;
export const ClearIcon: React.FC<IconProps> = (props) => <ThemedIcon as={XMarkSvg} {...props} />;
export const DeleteIcon: React.FC<IconProps> = (props) => <ThemedIcon as={TrashSvg} {...props} />;
export const FileUploadIcon: React.FC<IconProps> = (props) => <ThemedIcon as={ArrowUpTraySvg} {...props} />;
export const UndoArrowIcon: React.FC<IconProps> = (props) => <ThemedIcon as={ArrowUturnLeftSvg} {...props} />;

export const NotesIcon: React.FC<IconProps> = (props) => <ThemedIcon as={DocumentTextSvg} {...props} />;
export const ContentCutIcon: React.FC<IconProps> = (props) => <ThemedIcon as={ScissorsSvg} {...props} />;
export const QuestionMarkIcon: React.FC<IconProps> = (props) => <ThemedIcon as={QuestionMarkCircleSvg} {...props} />;
export const CopyIcon: React.FC<IconProps> = (props) => <ThemedIcon as={DocumentDuplicateSvg} {...props} />;
export const ExpandMoreIcon: React.FC<IconProps> = (props) => <ThemedIcon as={ChevronDownSvg} {...props} />;
export const ExpandLessIcon: React.FC<IconProps> = (props) => <ThemedIcon as={ChevronUpSvg} {...props} />;
export const StarsIcon: React.FC<IconProps> = (props) => <ThemedIcon as={StarsSvg} {...props} />;
export const AcademicCapIcon: React.FC<IconProps> = (props) => <ThemedIcon as={AcademicCapSvg} {...props} />;
export const PhotoIcon: React.FC<IconProps> = (props) => <ThemedIcon as={PhotoSvg} {...props} />;
export const HomeIcon: React.FC<IconProps> = (props) => <ThemedIcon as={HomeSvg} {...props} />;
export const LoginIcon: React.FC<IconProps> = (props) => <ThemedIcon as={LoginSvg} {...props} />;
export const LogoutIcon: React.FC<IconProps> = (props) => <ThemedIcon as={LogoutSvg} {...props} />;
export const PlusIcon: React.FC<IconProps> = (props) => <ThemedIcon as={PlusSvg} {...props} />;
export const TicketIcon: React.FC<IconProps> = (props) => <ThemedIcon as={TicketSvg} {...props} />;
export const ChatBubbleLeftIcon: React.FC<IconProps> = (props) => <ThemedIcon as={ChatBubbleLeftSvg} {...props} />;
export const PhotoFilterIcon: React.FC<IconProps> = (props) => <ThemedIcon as={AdjustmentsHorizontalSvg} {...props} />;
export const DocumentUploadIcon: React.FC<IconProps> = (props) => <ThemedIcon as={DocumentArrowUpSvg} {...props} />;
export const DocumentDownloadIcon: React.FC<IconProps> = (props) => <ThemedIcon as={DocumentArrowDownSvg} {...props} />;
export const PencilIcon: React.FC<IconProps> = (props) => <ThemedIcon as={PencilSvg} {...props} />;
export const CheckIcon: React.FC<IconProps> = (props) => <ThemedIcon as={CheckSvg} {...props} />;
export const BookmarkIcon: React.FC<IconProps> = (props) => <ThemedIcon as={BookmarkSvg} {...props} />;
export const BookmarkOutlineIcon: React.FC<IconProps> = (props) => <ThemedIcon as={BookmarkOutlineSvg} {...props} />;
export const DownloadIcon: React.FC<IconProps> = (props) => <ThemedIcon as={ArrowDownTraySvg} {...props} />;
export const StarIcon: React.FC<IconProps> = (props) => <ThemedIcon as={StarSvg} {...props} />;
export const StarOutlineIcon: React.FC<IconProps> = (props) => <ThemedIcon as={StarOutlineSvg} {...props} />;
export const DocumentCheckIcon: React.FC<IconProps> = (props) => <ThemedIcon as={DocumentCheckSvg} {...props} />;
export const PencilSquareIcon: React.FC<IconProps> = (props) => <ThemedIcon as={PencilSquareSvg} {...props} />;

// MetaTextLogoIcon.tsx
import React from 'react';

export const MetaTextLogoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg width="24" height="24" viewBox="0 0 64 64" fill="none" {...props}>
        <path d="M12 52 V 12 H 22 L 32 22 L 42 12 H 52 V 52 H 42 V 26 L 32 36 L 22 26 V 52 Z" fill="#ADD8E6" />
    </svg>
);
