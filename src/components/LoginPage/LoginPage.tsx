import { auth, updateEntries, updateStudents, useDatabase } from '@/data/Database';
import { Button, Group, Modal, Paper, PasswordInput, Stack, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { signInWithEmailAndPassword } from 'firebase/auth';

function LoginPage({
    opened,
    setOpened,
}: {
    opened: boolean;
    setOpened: (opened: boolean) => void;
}) {
    let data = useDatabase();
    const form = useForm({
        initialValues: {
            name: '',
            password: '',
        },

        validate: {
            name: (val) => (val.includes(' ') ? "Nom d'utilisateur invalide" : null),
            password: (val) => null,
        },
    });

    return (
        <Modal
            opened={opened}
            centered
            onClose={() => {
                setOpened(false);
            }}
            title="Connexion"
        >
            <Paper radius="md" p="xl" withBorder>
                <form
                    onSubmit={form.onSubmit(() => {
                        let name =
                            form.values.name +
                            (form.values.name.toLowerCase() == 'tarikdu137'
                                ? '@gmail.com'
                                : '@hx3.org');

                        signInWithEmailAndPassword(auth, name, form.values.password)
                            .then(() => {
                                notifications.show({
                                    title: 'Connection réussie',
                                    message: `Bienvenue ${form.values.name}`,
                                    color: 'green',
                                });

                                data.setConnected(true);
                                updateEntries(data.entries);
                                updateStudents(data);
                                setOpened(false);
                            })
                            .catch(() => {
                                setOpened(false);
                                notifications.show({
                                    title: 'Erreur',
                                    message: `Impossible de se connecter, veuillez réessayer`,
                                    color: 'red',
                                });

                                data.setConnected(false);
                            });
                    })}
                >
                    <Stack>
                        <TextInput
                            required
                            label="Nom d'utilisateur"
                            placeholder="sousouf"
                            value={form.values.name}
                            onChange={(event) =>
                                form.setFieldValue('name', event.currentTarget.value)
                            }
                            error={form.errors.email && 'Invalid username'}
                            radius="md"
                        />

                        <PasswordInput
                            required
                            label="Mot de passe"
                            placeholder="couscous"
                            value={form.values.password}
                            onChange={(event) =>
                                form.setFieldValue('password', event.currentTarget.value)
                            }
                            error={
                                form.errors.password &&
                                'Password should include at least 6 characters'
                            }
                            radius="md"
                        />
                    </Stack>

                    <Group justify="space-between" mt="xl">
                        <Button type="submit" radius="xl" color="green">
                            Connexion
                        </Button>
                    </Group>
                </form>
            </Paper>
        </Modal>
    );
}

export default LoginPage;
