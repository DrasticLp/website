import { Button, useMantineColorScheme } from '@mantine/core';
import { IconMoon, IconSun } from '@tabler/icons-react';

export function ColorSchemeToggle() {
    const { colorScheme, setColorScheme } = useMantineColorScheme();
    return (
        <Button
            color={'green'}
            onClick={() => {
                setColorScheme(colorScheme == 'light' ? 'dark' : 'light');
            }}
        >
            {colorScheme == 'dark' ? <IconSun /> : <IconMoon />}
        </Button>
    );
}
