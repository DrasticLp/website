import { auth, hasMathAccess, isConnected, refreshDatabase, useDatabase } from '@/data/Database';
import {
    Anchor,
    Box,
    Burger,
    Button,
    Divider,
    Drawer,
    Group,
    Image,
    ScrollArea,
    UnstyledButton,
    rem,
    useMantineColorScheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { signOut } from 'firebase/auth';
import { useState } from 'react';
import { Fragment } from 'react/jsx-runtime';
import { ColorSchemeToggle } from '../ColorSchemeToggle/ColorSchemeToggle';
import LoginPage from '../LoginPage/LoginPage';
import classes from './Header.module.css';

const handleScroll = (id: string) => {
    window.scrollTo({
        top: (document.getElementById(id)?.offsetTop || 60) - 60,
        behavior: 'smooth',
    });
};

export function Header() {
    const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
    let theme = useMantineColorScheme();
    let data = useDatabase();

    const [loginPageOpened, setLoginPageOpened] = useState(false);

    const items = (
        <Fragment>
            <Anchor href="#">
                <Image visibleFrom="sm" h={30} src={`logo-${theme.colorScheme}.png`} />
            </Anchor>
            {hasMathAccess(data) ? (
                <Anchor
                    href="https://www.faidherbe.org/~pcsimath/pcsi1/HX3/HX3.html"
                    className={classes.link}
                    target="_blank"
                >
                    Maths
                </Anchor>
            ) : (
                ''
            )}
            <Anchor href="https://benlhajlahsen.fr" className={classes.link} target="_blank">
                Physique
            </Anchor>
            <Divider orientation="vertical" />
            <UnstyledButton
                className={classes.link}
                onClick={() => {
                    closeDrawer();
                    handleScroll('pdmsection');
                }}
            >
                PDM
            </UnstyledButton>
            <UnstyledButton
                className={classes.link}
                onClick={() => {
                    closeDrawer();
                    handleScroll('pzsection');
                }}
            >
                PZ
            </UnstyledButton>
            {isConnected() ? (
                <UnstyledButton
                    className={classes.link}
                    onClick={() => {
                        closeDrawer();
                        handleScroll('kdbsection');
                    }}
                >
                    KDB
                </UnstyledButton>
            ) : (
                ''
            )}
        </Fragment>
    );

    let buttons = (
        <>
            <Button
                variant="default"
                color={'green'}
                onClick={() => {
                    if (!data.connected) {
                        setLoginPageOpened(true);
                        closeDrawer();
                    } else {
                        signOut(auth);
                        refreshDatabase(data);
                    }
                }}
            >
                {data.connected ? 'Déconnexion' : 'Connexion'}
            </Button>
            <Divider orientation="vertical" />
            <ColorSchemeToggle />
        </>
    );

    return (
        <>
            <Box pb={120}>
                <header className={classes.header}>
                    <Group justify="space-between" h="100%">
                        <Group h="100%" gap={0} visibleFrom="sm">
                            {items}
                        </Group>

                        <Group visibleFrom="sm">{buttons}</Group>
                        <Burger opened={drawerOpened} onClick={toggleDrawer} hiddenFrom="sm" />

                        <Image hiddenFrom="sm" h={30} src={`logo-${theme.colorScheme}.png`} />
                    </Group>
                </header>

                <Drawer
                    opened={drawerOpened}
                    onClose={closeDrawer}
                    size="100%"
                    padding="md"
                    title="Navigation"
                    hiddenFrom="sm"
                    zIndex={1000000}
                >
                    <ScrollArea h={`calc(100vh - ${rem(80)})`} mx="-md">
                        <Divider my="sm" />
                        {items}
                        <Divider my="sm" />

                        <Group justify="center" grow pb="xl" px="md">
                            {buttons}
                        </Group>
                    </ScrollArea>
                </Drawer>
            </Box>
            <LoginPage opened={loginPageOpened} setOpened={setLoginPageOpened}></LoginPage>
        </>
    );
}

export default Header;
