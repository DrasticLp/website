import { useDatabase } from '@/data/Database';
import { Center, Grid, Group, Paper, RingProgress, Text } from '@mantine/core';
import { IconConfetti, IconMoodSad, IconMoodWink2, IconRubberStamp } from '@tabler/icons-react';

function Counters() {
    const data = useDatabase();

    const counter: any =
        data.currentClassroom && data.counter[data.currentClassroom]
            ? data.counter[data.currentClassroom]
            : { tan: 0, arctan: 0, cotan: 0, tanpon: 0 };

    const stats = [
        {
            label: 'Tan(PDM)',
            stats: counter.tan,
            color: 'green',
            progress: 100,
            icon: () => <IconConfetti />,
        },
        {
            label: 'ArcTan(PDM)',
            stats: counter.arctan,
            color: 'blue',
            progress: 100,
            icon: () => <IconMoodWink2 stroke={2} />,
        },
        {
            label: 'CoTan(PDM)',
            stats: counter.cotan,
            color: 'red',
            progress: 100,
            icon: () => <IconMoodSad stroke={2} />,
        },
        {
            label: 'Tan(Pon)',
            stats: counter.tanpon,
            color: 'pink',
            progress: 100,
            icon: () => <IconRubberStamp stroke={2} />,
        },
    ];
    return (
        <Center>
            <Paper my={10} mx={1} withBorder radius="md" p="xs">
                <Grid mx={15}>
                    {stats.map((s) => (
                        <Group key={s.label}>
                            <RingProgress
                                size={80}
                                roundCaps
                                thickness={8}
                                sections={[{ value: s.progress, color: s.color }]}
                                label={<Center>{<s.icon />}</Center>}
                            />

                            <div>
                                <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
                                    {s.label}
                                </Text>
                                <Text fw={700} size="xl">
                                    {s.stats}
                                </Text>
                            </div>
                        </Group>
                    ))}
                </Grid>
            </Paper>
        </Center>
    );
}

export default Counters;
