import { ThemedIcon, ThemedIconProps } from './ThemedIcon';
import {
    ArrowLeftIcon as ArrowLeftSvg,
    Bars3Icon as Bars3Svg,
    MagnifyingGlassIcon as MagnifyingGlassSvg,
    XMarkIcon as XMarkSvg,
    TrashIcon as TrashSvg,
    ArrowUpTrayIcon as ArrowUpTraySvg,
    ArrowUturnLeftIcon as ArrowUturnLeftSvg,
    ArrowsRightLeftIcon as ArrowsRightLeftSvg,
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
    BeakerIcon as CompressionSvg,
    HomeIcon as HomeSvg,
    ArrowLeftEndOnRectangleIcon as LoginSvg,
    ArrowLeftStartOnRectangleIcon as LogoutSvg,
    PlusIcon as PlusSvg,
    TicketIcon as TicketSvg,
} from '@heroicons/react/24/solid';
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
export const CompareArrowsIcon: React.FC<IconProps> = (props) => <ThemedIcon as={ArrowsRightLeftSvg} {...props} />;
export const NotesIcon: React.FC<IconProps> = (props) => <ThemedIcon as={DocumentTextSvg} {...props} />;
export const ContentCutIcon: React.FC<IconProps> = (props) => <ThemedIcon as={ScissorsSvg} {...props} />;
export const QuestionMarkIcon: React.FC<IconProps> = (props) => <ThemedIcon as={QuestionMarkCircleSvg} {...props} />;
export const CopyIcon: React.FC<IconProps> = (props) => <ThemedIcon as={DocumentDuplicateSvg} {...props} />;
export const ExpandMoreIcon: React.FC<IconProps> = (props) => <ThemedIcon as={ChevronDownSvg} {...props} />;
export const ExpandLessIcon: React.FC<IconProps> = (props) => <ThemedIcon as={ChevronUpSvg} {...props} />;
export const StarsIcon: React.FC<IconProps> = (props) => <ThemedIcon as={StarsSvg} {...props} />;
export const AcademicCapIcon: React.FC<IconProps> = (props) => <ThemedIcon as={AcademicCapSvg} {...props} />;
export const PhotoIcon: React.FC<IconProps> = (props) => <ThemedIcon as={PhotoSvg} {...props} />;
export const CompressionIcon: React.FC<IconProps> = (props) => <ThemedIcon as={CompressionSvg} {...props} />;
export const HomeIcon: React.FC<IconProps> = (props) => <ThemedIcon as={HomeSvg} {...props} />;
export const LoginIcon: React.FC<IconProps> = (props) => <ThemedIcon as={LoginSvg} {...props} />;
export const LogoutIcon: React.FC<IconProps> = (props) => <ThemedIcon as={LogoutSvg} {...props} />;
export const PlusIcon: React.FC<IconProps> = (props) => <ThemedIcon as={PlusSvg} {...props} />;
export const TicketIcon: React.FC<IconProps> = (props) => <ThemedIcon as={TicketSvg} {...props} />;

// unused icons but may be needed later
export const PhotoFilterIcon: React.FC<IconProps> = (props) => <ThemedIcon as={AdjustmentsHorizontalSvg} {...props} />;

