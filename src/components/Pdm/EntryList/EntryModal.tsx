import {
    PDMEntry,
    areEntriesSame,
    hasPDMAccess,
    idsToNames,
    namesToIds,
    setEntry,
    useDatabase,
} from '@/data/Database';
import {
    Box,
    Button,
    Grid,
    Group,
    MultiSelect,
    Paper,
    Switch,
    Text,
    Textarea,
    rem,
    useMantineColorScheme,
    useMantineTheme,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconArrowBackUp, IconListSearch } from '@tabler/icons-react';
import cx from 'clsx';
import { useEffect, useState } from 'react';
import classes from './EntryModal.module.css';

function EntryModal({
    entries,
    active,
    setActive,
    closeModal,
}: {
    entries: PDMEntry[];
    active: number;
    setActive: (active: number) => void;
    closeModal: () => void;
}) {
    const scheme = useMantineColorScheme();
    const theme = useMantineTheme();
    const data = useDatabase();

    const students = [...data.students.map.values()]
        .filter((s) => s.classroom == data.currentClassroom)
        .map((s) => s.name);

    const [entry, setCurrentEntry] = useState(structuredClone(entries[active]));

    useEffect(() => {
        setCurrentEntry(structuredClone(entries[active]));
    }, [active]);

    const items = entries.map((item, index) => (
        <Box<'a'>
            component="a"
            onClick={(event) => {
                event.preventDefault();
                setActive(index);
            }}
            key={item.id}
            className={cx(classes.link, { [classes.linkActive]: active === index })}
            style={{ paddingLeft: `var(--mantine-spacing-md)` }}
        >
            {item.date.toDate().toLocaleDateString()}
        </Box>
    ));

    return (
        <Paper
            my={25}
            bg={scheme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0]}
            shadow="xs"
            p="xl"
        >
            <Grid>
                <Grid.Col span={{ base: 12, xs: 4 }}>
                    <div className={classes.root}>
                        <Group mb="md" my={10}>
                            <IconListSearch
                                style={{ width: rem(18), height: rem(18) }}
                                stroke={1.5}
                            />
                            <Text>Entrées</Text>
                        </Group>
                        <div className={classes.links}>
                            <div
                                className={classes.indicator}
                                style={{
                                    transform: `translateY(calc(${active} * var(--link-height) + var(--indicator-offset)))`,
                                }}
                            />
                            {items}
                        </div>
                    </div>
                </Grid.Col>
                <Grid.Col span={{ base: 12, xs: 8 }}>
                    <MultiSelect
                        label="Concernés"
                        placeholder="Fab"
                        id={'select' + entry.id}
                        defaultValue={idsToNames(data, entry.concerned)}
                        data={students}
                        value={idsToNames(data, entry.concerned)}
                        onChange={(v) => {
                            setCurrentEntry({
                                ...entry,
                                concerned: namesToIds(data, v),
                            });
                        }}
                    />

                    <Textarea
                        color="white"
                        label="Contenu"
                        maxRows={15}
                        id={'text' + entry.id}
                        styles={{
                            input: {
                                opacity: 0.8,
                                color: '#fff',
                            },
                        }}
                        onChange={(e) =>
                            setCurrentEntry({
                                ...entry,
                                content: e.target.value,
                            })
                        }
                        autosize
                        mt={10}
                        disabled={!hasPDMAccess()}
                        value={entry.content}
                    />
                </Grid.Col>
            </Grid>
            <Group justify="space-between">
                <Switch
                    color="green"
                    mt={20}
                    id={'switch' + entry.id}
                    defaultChecked={entry.private}
                    checked={entry.private}
                    label="Privé"
                    disabled={!hasPDMAccess()}
                    onChange={(e) => setCurrentEntry({ ...entry, private: e.target.checked })}
                />
                <Group>
                    <Button
                        mt={20}
                        disabled
                        onClick={() => {
                            (document.getElementById('switch' + entry.id) as any).checked =
                                entries[active].private;
                            (document.getElementById('text' + entry.id) as any).value =
                                entries[active].content;
                            setCurrentEntry(structuredClone(entries[active]));
                        }}
                    >
                        <IconArrowBackUp size={20} />
                    </Button>
                    <Button
                        mt={20}
                        defaultChecked={entries[active].private}
                        disabled={!hasPDMAccess()}
                        color="green"
                        onClick={() => {
                            if (!areEntriesSame(entry, entries[active])) {
                                try {
                                    setEntry(data, entry).then(() => {
                                        closeModal();

                                        notifications.show({
                                            title: 'Entrée modifiée',
                                            message: `Entrée ${entry.id} modifiée`,
                                            color: 'green',
                                        });
                                    });
                                } catch (ex) {
                                    notifications.show({
                                        title: 'Erreur',
                                        message: `Impossible de mettre à jour l'entrée`,
                                        color: 'red',
                                    });
                                }
                            } else
                                notifications.show({
                                    title: 'Aucun changement détecté',
                                    message: `Veuillez changer le contenu avant de demander une modification sur la base de données`,
                                    color: 'orange',
                                });
                        }}
                    >
                        Mettre à jour
                    </Button>
                </Group>
            </Group>
        </Paper>
    );
}

export default EntryModal;
