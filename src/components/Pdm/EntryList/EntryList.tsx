import { Student, useDatabase } from '@/data/Database';
import {
    Avatar,
    Center,
    Group,
    Image,
    Modal,
    Text,
    UnstyledButton,
    rem,
    useMantineColorScheme,
    useMantineTheme,
} from '@mantine/core';
import { upperFirst } from '@mantine/hooks';
import { IconChevronRight, IconFileDescription, IconMathFunction } from '@tabler/icons-react';
import { useState } from 'react';
import classes from './EntryList.module.css';
import EntryModal from './EntryModal';

function EntryList({ student }: { student: Student }) {
    const scheme = useMantineColorScheme();
    const theme = useMantineTheme();

    const [opened, setOpened] = useState(false);
    const data = useDatabase();
    const entries = [...data.entries.map.values()].filter((entry) =>
        entry.concerned.includes(student.id)
    );

    const [active, setActive] = useState(0);

    return (
        <>
            <UnstyledButton
                key={student.id}
                bg={scheme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0]}
                className={classes.user}
                onClick={() => setOpened(true)}
            >
                <Group>
                    <Avatar src={student.img} radius="xl" />

                    <div style={{ flex: 1 }}>
                        <Text size="sm" fw={500}>
                            {student.name}
                        </Text>

                        <Text c="dimmed" size="xs">
                            {student.functions.map((v) => upperFirst(v.toLowerCase())).join(', ')}
                        </Text>
                    </div>

                    <IconChevronRight style={{ width: rem(14), height: rem(14) }} stroke={1.5} />
                </Group>
            </UnstyledButton>
            <Modal
                size="xl"
                title={'HX3 ' + student.classroom}
                opened={opened}
                onClose={() => setOpened(false)}
            >
                <GetProfile student={student} />
                {entries.length != 0 ? (
                    <EntryModal
                        active={active}
                        setActive={setActive}
                        entries={entries}
                        closeModal={() => setOpened(false)}
                    />
                ) : (
                    <NothingHere />
                )}
            </Modal>
        </>
    );
}

function NothingHere() {
    return (
        <div className={classes.nothing}>
            <Center>
                <Text my={10} fz="lg" c="dimmed">
                    Aucune entrée pour le moment
                </Text>
            </Center>

            <Image src="wumpus.svg"></Image>
        </div>
    );
}

function GetProfile({ student }: { student: Student }) {
    return (
        <div>
            <Group wrap="nowrap">
                <Avatar src={student.img} size={94} radius="md" />
                <div>
                    <Text fz="lg" fw={500} className={classes.name}>
                        {student.name}
                    </Text>

                    <Group wrap="nowrap" gap={10} mt={5}>
                        <IconMathFunction stroke={1.5} size="1.35rem" className={classes.icon} />

                        <Text fz="xs" c="dimmed">
                            {student.functions.length != 0
                                ? student.functions.join(', ')
                                : 'Aucune'}
                        </Text>
                    </Group>
                    <Group wrap="nowrap" gap={10} mt={5}>
                        <IconFileDescription stroke={1.5} size="2rem" className={classes.icon} />
                        <Text fz="xs" c="dimmed">
                            {student.description}
                        </Text>
                    </Group>
                </div>
            </Group>
        </div>
    );
}

export default EntryList;
