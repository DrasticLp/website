import { PZGallery } from '@/data/Database';
import { Box, Button, Drawer, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconListSearch } from '@tabler/icons-react';
import cx from 'clsx';
import { useState } from 'react';
import classes from './GalleryPicker.module.css';

function GalleryPicker({
    galleries,
    currentGallery,
    setCurrentGallery,
}: {
    galleries: PZGallery[];
    currentGallery: PZGallery;
    setCurrentGallery: (gallery: PZGallery) => void;
}) {
    const [active, setActive] = useState(0);
    const [opened, { open, close }] = useDisclosure(false);

    const items = galleries.map((item, index) => (
        <Box<'a'>
            component="a"
            onClick={() => {
                setActive(index);
                for (let g of galleries)
                    if (g.name === item.name) {
                        setCurrentGallery(g);
                        break;
                    }
            }}
            key={item.name}
            className={cx(classes.link, { [classes.linkActive]: active === index })}
            style={{ paddingLeft: `var(--mantine-spacing-md)` }}
        >
            {item.name}
        </Box>
    ));

    return (
        <div>
            <Button onClick={open}>
                <IconListSearch />
                <Text mt={2} ml={5}>
                    Liste
                </Text>
            </Button>
            <Drawer opened={opened} onClose={close} title="Évènements">
                {items}
            </Drawer>
        </div>
    );
}

export default GalleryPicker;
