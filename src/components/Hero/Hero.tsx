import { Text, Title } from '@mantine/core';
import colors from 'open-color';
import classes from './Hero.module.css';
export function Hero() {
    return (
        <>
            <Title className={classes.title} ta="center">
                Bienvenue en{' '}
                <Text
                    inherit
                    variant="gradient"
                    component="span"
                    gradient={{ from: colors.green[2], to: 'green', deg: 45 }}
                >
                    HX3
                </Text>
            </Title>
            <Text c="dimmed" ta="center" size="lg" maw={580} mx="auto" mt="xl">
                La classe bien meilleure que la HX4
            </Text>
        </>
    );
}

export default Hero;
