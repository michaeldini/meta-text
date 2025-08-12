import { Icon } from '@components/icons/Icon';
import React from 'react';
import { Box } from '@chakra-ui/react/box';
import { Text, Heading, createListCollection } from '@chakra-ui/react';
import { Select } from '@chakra-ui/react/select';
import { Portal } from '@chakra-ui/react/portal';
import { Button } from '@chakra-ui/react/button';
import { Input } from '@chakra-ui/react/input';
import { Fieldset } from '@chakra-ui/react/fieldset';
import { useMetatextCreate } from './useMetatextCreate';
import { SourceDocumentSummary } from '@mtypes/documents';

export interface MetatextCreateFormProps {
    sourceDocs: SourceDocumentSummary[];
    sourceDocsLoading: boolean;
}

function MetatextCreateForm({ sourceDocs }: MetatextCreateFormProps): React.ReactElement {
    const { title, loading, isSubmitDisabled, handleTitleChange, handleSourceDocChange, handleSubmit } = useMetatextCreate();

    const sourceDocOptions = createListCollection({
        items: sourceDocs.map(doc => ({
            value: doc.id,
            label: `${doc.title} ${doc.author ? `by ${doc.author}` : ''}`,
        }))
    });

    return (
        <Box width={{ base: '100%', lg: '400px' }} maxWidth="100%" minWidth={0}>
            <Box>
                <Heading size="sub" mb={4}>New</Heading>
            </Box>
            <form onSubmit={handleSubmit}>
                <Fieldset.Root>
                    <Select.Root collection={sourceDocOptions} onValueChange={(e) => handleSourceDocChange(e.value[0])}>
                        <Select.HiddenSelect />
                        <Select.Control>
                            <Select.Trigger>
                                <Select.ValueText placeholder="Select a source document" color="fg.muted" />
                            </Select.Trigger>
                            <Select.IndicatorGroup>
                                <Select.Indicator />
                            </Select.IndicatorGroup>
                        </Select.Control>
                        <Portal>
                            <Select.Positioner>
                                <Select.Content>
                                    {sourceDocOptions.items.map(item => (
                                        <Select.Item item={item} key={item.value}>
                                            {item.label}
                                            <Select.ItemIndicator />
                                        </Select.Item>
                                    ))}
                                </Select.Content>
                            </Select.Positioner>
                        </Portal>
                    </Select.Root>
                    <Input
                        placeholder="Title"
                        value={title}
                        onChange={handleTitleChange}
                        data-testid="title-input"
                        required
                    />
                    <Button type="submit" disabled={isSubmitDisabled} data-testid="submit-button" color="primary">
                        <Icon name='AISparkle' />
                        {loading ? 'Creating...' : 'Create Metatext'}
                    </Button>
                </Fieldset.Root>
            </form>
        </Box>
    );
}

MetatextCreateForm.displayName = 'MetatextCreateForm';
export default MetatextCreateForm;
