import { PZGallery, deleteFolder, hasPZAccess, updatePzAndKdb, useDatabase } from '@/data/Database';
import { Carousel } from '@mantine/carousel';
import { Button, Card, Container, Group, Image, Skeleton, Stack, Text, Title } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import colors from 'open-color';
import { useState } from 'react';
import AddGallery from './AddGallery';
import GalleryPicker from './GalleryPicker/GalleryPicker';
import classes from './Pz.module.css';

function Pz() {
    const data = useDatabase();
    const [openAddGalleryModal, setOpenAddGalleryModal] = useState(false);

    const galleries = [...data.pz.map.values()].filter((e) => e.classroom == data.currentClassroom);
    const [currentGallery, setCurrentGallery] = useState(galleries[0]);
    const child = <Skeleton height={140} radius="md" animate={false} />;

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
            <Stack justify="center" align="center" mb={20}>
                <Group>
                    <GalleryPicker
                        currentGallery={currentGallery}
                        setCurrentGallery={setCurrentGallery}
                        galleries={galleries}
                    />
                    {hasPZAccess() ? (
                        <Button
                            color={'green'}
                            onClick={() => {
                                setOpenAddGalleryModal(true);
                            }}
                        >
                            <IconPlus />
                        </Button>
                    ) : (
                        ''
                    )}
                </Group>

                <PzCard data={data} gallery={currentGallery} />
            </Stack>

            <AddGallery
                opened={openAddGalleryModal}
                setOpened={setOpenAddGalleryModal}
            ></AddGallery>
            <AddGallery opened={openAddGalleryModal} setOpened={setOpenAddGalleryModal} />
        </div>
    );
}

function PzCard({ gallery, data }: { gallery: PZGallery; data: ReturnType<typeof useDatabase> }) {
    const [askForConfirm, setAskForConfirm] = useState(false);
    const slides = gallery
        ? gallery.images.map((image) => (
              <Carousel.Slide key={gallery.name + '-' + image} h={'80vh'}>
                  <Image src={image} height={'100%'} />
              </Carousel.Slide>
          ))
        : '';

    return gallery ? (
        <Container>
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
                        {gallery.name}
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
                                    deleteFolder(
                                        `classrooms/${data.currentClassroom}/pz/${gallery.name}`
                                    )
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
        </Container>
    ) : (
        ''
    );
}

export default Pz;
