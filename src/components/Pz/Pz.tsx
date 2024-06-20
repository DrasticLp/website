import { deleteFolder, hasPZAccess, updatePzAndKdb, useDatabase } from '@/data/Database';
import { Carousel } from '@mantine/carousel';
import {
    Button,
    Card,
    Center,
    Container,
    Group,
    Image,
    SimpleGrid,
    Text,
    TextInput,
    Title,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import colors from 'open-color';
import { useState } from 'react';
import AddGallery from './AddGallery';
import classes from './Pz.module.css';

function Pz() {
    const data = useDatabase();
    const [openAddGalleryModal, setOpenAddGalleryModal] = useState(false);
    const [search, setSearch] = useState<string>('');

    return (
        <div id="pzsection" key="pzsection">
            <Title my="xl" className={'a'} ta="center">
                Section{' '}
                <Text
                    inherit
                    variant="gradient"
                    component="span"
                    gradient={{ from: colors.green[2], to: 'green', deg: 45 }}
                >
                    PZ
                </Text>
            </Title>
            <Center>
                <SimpleGrid
                    mx={10}
                    mb={15}
                    cols={{ base: 1, sm: 2, lg: 5 }}
                    spacing={{ base: 10, sm: 'xl' }}
                    verticalSpacing={{ base: 'md', sm: 'xl' }}
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <div>
                        <TextInput
                            label="Nom de l'évènement"
                            placeholder="RDK"
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    {hasPZAccess() ? (
                        <div>
                            <Button
                                mt={24}
                                color={'green'}
                                onClick={() => {
                                    setOpenAddGalleryModal(true);
                                }}
                            >
                                <IconPlus />
                            </Button>
                        </div>
                    ) : (
                        <></>
                    )}

                    <AddGallery
                        opened={openAddGalleryModal}
                        setOpened={setOpenAddGalleryModal}
                    ></AddGallery>
                </SimpleGrid>
            </Center>

            <Container>
                <SimpleGrid
                    mx={10}
                    cols={{ base: 1, sm: 2, lg: 2 }}
                    spacing={{ base: 10, sm: 'xl' }}
                >
                    {[...data.pz.map.values()]
                        .filter(
                            (m) =>
                                m.classroom == data.currentClassroom &&
                                m.name.toLowerCase().includes(search.toLowerCase())
                        )
                        .map((m) => {
                            return (
                                <PzCard
                                    key={m.classroom + '-' + m.name}
                                    name={m.name}
                                    images={m.images}
                                    data={data}
                                />
                            );
                        })}
                </SimpleGrid>
                <AddGallery opened={openAddGalleryModal} setOpened={setOpenAddGalleryModal} />
            </Container>
        </div>
    );
}

function PzCard({
    name,
    images,
    data,
}: {
    name: string;
    images: string[];
    data: ReturnType<typeof useDatabase>;
}) {
    const [askForConfirm, setAskForConfirm] = useState(false);
    const slides = images.map((image) => (
        <Carousel.Slide key={name + '-' + image}>
            <Image src={image} height={220} />
        </Carousel.Slide>
    ));

    return (
        <Card radius="md" withBorder padding="xl">
            <Card.Section>
                <Carousel
                    withIndicators
                    loop
                    classNames={{
                        root: classes.carousel,
                        controls: classes.carouselControls,
                        indicator: classes.carouselIndicator,
                    }}
                >
                    {slides}
                </Carousel>
            </Card.Section>

            <Group justify="space-between" mt="lg">
                <Text fw={500} fz="lg">
                    {name}
                </Text>
            </Group>
            {hasPZAccess() ? (
                <Group justify="end" mt="md">
                    {askForConfirm ? (
                        <Button onClick={() => setAskForConfirm(false)}>Annuler</Button>
                    ) : (
                        false
                    )}
                    <Button
                        color={askForConfirm ? 'red' : 'yellow'}
                        radius="md"
                        onClick={() => {
                            if (askForConfirm) {
                                deleteFolder(`classrooms/${data.currentClassroom}/pz/${name}`)
                                    .then(() => {
                                        notifications.show({
                                            title: 'Évènement supprimé',
                                            message: `:(`,
                                            color: 'blue',
                                        });

                                        setAskForConfirm(false);
                                        updatePzAndKdb(data);
                                    })
                                    .catch(() => {
                                        notifications.show({
                                            title: 'Impossible de supprimer',
                                            message: `Une erreur s'est produite veuillez réessayer plus tard...`,
                                            color: 'red',
                                        });
                                        setAskForConfirm(false);
                                    });
                            } else setAskForConfirm(true);
                        }}
                    >
                        {askForConfirm ? 'Confirmer' : <IconTrash />}
                    </Button>
                </Group>
            ) : (
                ''
            )}
        </Card>
    );
}

export default Pz;
