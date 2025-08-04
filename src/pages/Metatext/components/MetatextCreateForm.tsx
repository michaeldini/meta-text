/** 
 * Presentational component for creating a new Metatext.
 * - Uses useMetatextCreate hook for form state and submission logic
 */


import React from 'react';
import { Box } from '@chakra-ui/react/box';
import { Text, Heading, createListCollection } from '@chakra-ui/react';
import { Select } from '@chakra-ui/react/select';
import { Portal } from '@chakra-ui/react/portal';
import { Button } from '@chakra-ui/react/button';
import { Input } from '@chakra-ui/react/input';
import { Fieldset } from '@chakra-ui/react/fieldset';
import { HiOutlineSparkles } from 'react-icons/hi2';
import { useMetatextCreate } from '../hooks/useMetatextCreate';
import { SourceDocumentSummary } from '@mtypes/documents';

/**
 * Props for the MetatextCreateForm component
 */
export interface MetatextCreateFormProps {
    /** List of available source documents */
    sourceDocs: SourceDocumentSummary[];
    /** Loading state for source documents */
    sourceDocsLoading: boolean;

}

function MetatextCreateForm(props: MetatextCreateFormProps): React.ReactElement {
    const { sourceDocs } = props;
    /**
     * Create form state and handlers from custom hook
     */
    const {
        title,
        loading,
        isSubmitDisabled,
        handleTitleChange,
        handleSourceDocChange,
        handleSubmit
    } = useMetatextCreate();


    const sourceDocOptions = createListCollection({
        items: sourceDocs.map(doc => ({
            value: doc.id,
            label: `${doc.title} ${doc.author ? `by ${doc.author}` : ''}`,
        }))
    })



    return (
        <Box
            width={{ base: '100%', lg: '400px' }}
            maxWidth="100%"
            minWidth={0}>
            {/* Form Header */}
            <Box >
                <Heading size="sub" mb={4}>
                    New
                </Heading>
            </Box>
            {/* Create Form */}
            <form onSubmit={handleSubmit}>
                <Fieldset.Root>

                    {/* Source Document Selection */}
                    <Select.Root collection={sourceDocOptions}
                        onValueChange={(e) => handleSourceDocChange(e.value[0])}>
                        <Select.HiddenSelect /> {/* Dont't select an option initially */}
                        <Select.Control  >
                            <Select.Trigger>
                                <Select.ValueText
                                    placeholder="Select a source document"
                                    color="fg.muted"
                                />
                            </Select.Trigger>
                            <Select.IndicatorGroup>
                                <Select.Indicator />
                            </Select.IndicatorGroup>
                        </Select.Control>
                        <Portal>
                            <Select.Positioner>
                                <Select.Content>
                                    {sourceDocOptions.items.map((framework) => (
                                        <Select.Item item={framework} key={framework.value}>
                                            {framework.label}
                                            <Select.ItemIndicator />
                                        </Select.Item>
                                    ))}
                                </Select.Content>
                            </Select.Positioner>
                        </Portal>
                    </Select.Root>

                    {/* Title Input */}
                    {/* <Field
                        label="Choose a Title"
                        required
                        disabled={loading}
                        data-testid="title-input"
                    /> */}
                    <Input
                        placeholder="Title"
                        value={title}
                        onChange={handleTitleChange}
                        data-testid="title-input"
                        required
                    />

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        disabled={isSubmitDisabled}
                        data-testid="submit-button"
                        color="primary"
                    >
                        <HiOutlineSparkles />
                        {loading ? 'Creating...' : 'Create Metatext'}
                    </Button>
                </Fieldset.Root>

            </form>
        </Box>
    );
}

MetatextCreateForm.displayName = 'MetatextCreateForm';

export default MetatextCreateForm;
