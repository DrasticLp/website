import { storageBaseUrl } from '@/data/Database';
import {
    ActionIcon,
    Anchor,
    Avatar,
    Container,
    Group,
    Image,
    Text,
    rem,
    useMantineColorScheme,
} from '@mantine/core';
import {
    IconAt,
    IconBrandDiscord,
    IconBrandInstagram,
    IconBrandTwitter,
    IconPhoneCall,
} from '@tabler/icons-react';
import colors from 'open-color';
import classes from './Footer.module.css';

const data = [
    {
        title: 'À Propos',
        links: [
            { label: 'Comment ça marche ?', link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
            { label: 'Partenaire', link: 'https://instagram.com/bstn_rnrd' },
            { label: 'Business', link: 'https://twitter.com/enaifousben' },
        ],
    },
];

function Footer() {
    const theme = useMantineColorScheme();

    const groups = data.map((group) => {
        const links = group.links.map((link, index) => (
            <Anchor key={index} className={classes.link} target="_blank" href={link.link}>
                {link.label}
            </Anchor>
        ));

        return (
            <div className={classes.wrapper} key={group.title}>
                <Text className={classes.title}>{group.title}</Text>
                {links}
            </div>
        );
    });

    return (
        <footer className={classes.footer}>
            <Container className={classes.inner}>
                <div className={classes.logo}>
                    <Image h={45} src={`logo-${theme.colorScheme}.png`} />
                    <Text
                        style={{ fontWeight: 'bold' }}
                        size="xs"
                        c="dimmed"
                        className={classes.description}
                    >
                        Road to
                        <Anchor
                            inherit
                            variant="gradient"
                            component="span"
                            style={{ fontWeight: 'bold' }}
                            gradient={{ from: colors.green[2], to: 'green', deg: 45 }}
                            onClick={() => window.open('https://cesarbaggio.fr/WP/', 'blank')}
                        >
                            {' Baggio'}
                        </Anchor>
                    </Text>
                </div>
                <div className={classes.groups}>{groups}</div>
            </Container>
            <Container className={classes.afterFooter}>
                <UserInfoIcons />
                <Group gap={0} className={classes.social} justify="flex-end" wrap="nowrap">
                    <ActionIcon size="lg" color="gray" variant="subtle">
                        <IconBrandTwitter
                            style={{ width: rem(18), height: rem(18) }}
                            stroke={1.5}
                            onClick={() => {
                                window.open('https://twitter.com/zlotys_50', 'blank');
                            }}
                        />
                    </ActionIcon>
                    <ActionIcon size="lg" color="gray" variant="subtle">
                        <IconBrandDiscord
                            style={{ width: rem(18), height: rem(18) }}
                            stroke={1.5}
                            onClick={() => {
                                window.open('https://discord.gg/q3tNuKwMnv', 'blank');
                            }}
                        />
                    </ActionIcon>
                    <ActionIcon size="lg" color="gray" variant="subtle">
                        <IconBrandInstagram
                            style={{ width: rem(18), height: rem(18) }}
                            stroke={1.5}
                            onClick={() => {
                                window.open('https://instagram.com/hx3.pv', 'blank');
                            }}
                        />
                    </ActionIcon>
                </Group>
            </Container>
            <Container>
                <Text fz="xs" c="dimmed">
                    Le contenu de ce site est uniquement à des fins historiques et peut contenir des
                    éléments sensibles ou inappropriés. Ces éléments ne reflètent pas nécessairement
                    les opinions actuelles des individus ou de l'établissement.
                </Text>
            </Container>
        </footer>
    );
}

function UserInfoIcons() {
    return (
        <div>
            <Group wrap="nowrap">
                <Avatar
                    src={
                        storageBaseUrl + '/classrooms%2F230%2Fprofiles%2Ftarikmesbahi.png?alt=media'
                    }
                    size={94}
                    radius="md"
                />
                <div>
                    <Text fz="xs" tt="uppercase" fw={700} c="dimmed">
                        Le roi
                    </Text>

                    <Text fz="lg" fw={500} className={classes.name}>
                        Tarik Mesbahi
                    </Text>

                    <Group wrap="nowrap" gap={10} mt={3}>
                        <IconAt stroke={1.5} size="1rem" className={classes.icon} />
                        <Text fz="xs" c="dimmed">
                            mesbahi.tarik62@gmail.com
                        </Text>
                    </Group>

                    <Group wrap="nowrap" gap={10} mt={5}>
                        <IconPhoneCall stroke={1.5} size="1rem" className={classes.icon} />
                        <Text fz="xs" c="dimmed">
                            +33 6 38 88 67 28
                        </Text>
                    </Group>
                </div>
            </Group>
        </div>
    );
}

export default Footer;
