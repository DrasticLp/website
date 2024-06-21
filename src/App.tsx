import '@mantine/carousel/styles.css';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { Notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';

import { Router } from './Router';
import { DatabaseContextProvider } from './data/Database';
import { theme } from './theme';

export default function App() {
    return (
        <DatabaseContextProvider>
            <MantineProvider defaultColorScheme="dark" theme={theme}>
                <Notifications />

                <Router />
            </MantineProvider>
        </DatabaseContextProvider>
    );
}
