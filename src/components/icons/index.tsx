import { ThemedIcon, ThemedIconProps } from './ThemedIcon';
import { ArrowLeftIcon as ArrowLeftSvg } from '@heroicons/react/24/solid';
import { Bars3Icon as Bars3Svg } from '@heroicons/react/24/solid';
import { MagnifyingGlassIcon as MagnifyingGlassSvg } from '@heroicons/react/24/solid';
import { XMarkIcon as XMarkSvg } from '@heroicons/react/24/solid';
import { TrashIcon as TrashSvg } from '@heroicons/react/24/solid';
import { ArrowUpTrayIcon as ArrowUpTraySvg } from '@heroicons/react/24/solid';
import { ArrowUturnLeftIcon as ArrowUturnLeftSvg } from '@heroicons/react/24/solid';
import { ArrowsRightLeftIcon as ArrowsRightLeftSvg } from '@heroicons/react/24/solid';
import { AdjustmentsHorizontalIcon as AdjustmentsHorizontalSvg } from '@heroicons/react/24/solid';
import { DocumentTextIcon as DocumentTextSvg } from '@heroicons/react/24/solid';
import { ScissorsIcon as ScissorsSvg } from '@heroicons/react/24/solid';
import { QuestionMarkCircleIcon as QuestionMarkCircleSvg } from '@heroicons/react/24/solid';
import { DocumentDuplicateIcon as DocumentDuplicateSvg } from '@heroicons/react/24/solid';
import { ChevronDownIcon as ChevronDownSvg } from '@heroicons/react/24/solid';
import { ChevronUpIcon as ChevronUpSvg } from '@heroicons/react/24/solid';
import { SparklesIcon as StarsSvg } from '@heroicons/react/24/solid';
import { AcademicCapIcon as AcademicCapSvg } from '@heroicons/react/24/solid';
import { PhotoIcon as PhotoSvg } from '@heroicons/react/24/solid';
import { SVGProps } from 'react';

// All icons are typed to accept all ThemedIconProps except 'as'
type IconProps = Omit<ThemedIconProps, 'as'>;

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
export const StarsIcon: React.FC<IconProps> = (props) => <ThemedIcon as={StarsSvg} {...props} />;
export const AcademicCapIcon: React.FC<IconProps> = (props) => <ThemedIcon as={AcademicCapSvg} {...props} />;
export const PhotoIcon: React.FC<IconProps> = (props) => <ThemedIcon as={PhotoSvg} {...props} />;


// unused icons but may be needed later
export const ExpandLessIcon: React.FC<IconProps> = (props) => <ThemedIcon as={ChevronUpSvg} {...props} />;
export const PhotoFilterIcon: React.FC<IconProps> = (props) => <ThemedIcon as={AdjustmentsHorizontalSvg} {...props} />;

