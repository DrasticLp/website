import { PDMEntry, idsToNames, useDatabase } from '@/data/Database';
import { Carousel, CarouselSlide } from '@mantine/carousel';
import { Avatar, Container, Group, Paper, Text, Title, UnstyledButton, rem } from '@mantine/core';
import colors from 'open-color';

function PdmNews() {
    const database = useDatabase();

    const entries = [...database.entries.map.values()]
        .filter(
            (e) => database.students.map.get(e.concerned[0])?.classroom == database.currentClassroom
        )
        .sort((a, b) => b.date.toDate().getTime() - a.date.toDate().getTime())
        .slice(0, 5);

    return entries.length <= 0 ? (
        ''
    ) : (
        <Container>
            <Title size="lg" mb={8} className={'a'} variant="gradient" component="span">
                <Text
                    mb={10}
                    variant="gradient"
                    gradient={{ from: colors.green[2], to: 'green', deg: 45 }}
                    inherit
                >
                    À la une...
                </Text>
            </Title>
            <Carousel
                loop
                dragFree
                withControls={true}
                align={'center'}
                mt={-30}
                mb={15}
                slideSize={{ base: '100%', sm: '50%' }}
                slideGap={{ base: rem(2), sm: 'xl' }}
            >
                {entries.map((e) => (
                    <GetPaper key={e.id} entry={e} database={database}></GetPaper>
                ))}
            </Carousel>
        </Container>
    );
}

function GetPaper({
    entry,
    database,
}: {
    entry: PDMEntry;
    database: ReturnType<typeof useDatabase>;
}) {
    return (
        <CarouselSlide key={entry.id}>
            <UnstyledButton></UnstyledButton>
            <Paper withBorder mx={5} radius="md" p="xs">
                <UnstyledButton w={'100%'}>
                    <Group justify="space-between">
                        <Group>
                            {entry.concerned.map((c) => (
                                <Avatar
                                    key={c}
                                    src={database.students.map.get(c)?.img}
                                    radius="xl"
                                />
                            ))}
                            <Text size="sm" opacity={0.5}>
                                {idsToNames(database, entry.concerned)
                                    .map((n) => n.split(' ')[0])
                                    .join(', ')}
                            </Text>
                        </Group>
                        <Text size="sm" fw={500}>
                            {entry.date.toDate().toLocaleDateString()}
                        </Text>
                    </Group>
                    <Text mt={5} opacity={0.9}>
                        {entry.content.length >= 100
                            ? entry.content.slice(0, 100) + '...'
                            : entry.content}
                    </Text>
                </UnstyledButton>
            </Paper>
        </CarouselSlide>
    );
}

export default PdmNews;
