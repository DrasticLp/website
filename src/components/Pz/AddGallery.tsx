import { deleteFolder, storage, updatePzAndKdb, useDatabase } from '@/data/Database';
import {
    ActionIcon,
    Box,
    Button,
    Group,
    Modal,
    Paper,
    Progress,
    Text,
    TextInput,
    rem,
    useMantineTheme,
} from '@mantine/core';
import { Dropzone, FileWithPath, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconCloudUpload, IconDownload, IconTrash, IconX } from '@tabler/icons-react';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { useState } from 'react';
import classes from './AddGallery.module.css';

function AddGallery({
    opened,
    setOpened,
}: {
    opened: boolean;
    setOpened: (opened: boolean) => void;
}) {
    const theme = useMantineTheme();
    const [uploadTotal, setUploadTotal] = useState(0);
    const [uploaded, setUploaded] = useState(0);
    const data = useDatabase();
    const form = useForm({
        initialValues: {
            name: '',
            files: new Array<FileWithPath>(),
        },

        validate: {
            name: (value) => (value ? null : 'Nom est requis'),
            files: (value) => (value.length != 0 ? null : 'Aucun fichier sélectionné'),
        },
    });

    const handleSubmit = async (values: any) => {
        setUploaded(0);
        setUploadTotal(form.values.files.length);
        try {
            const urls = await uploadFiles(values.files);
            console.log('Uploaded file URLs:', urls);
            notifications.show({
                title: 'Évènement ajouté',
                message: `Évènement ${form.values.name} ajouté`,
                color: 'green',
            });
            form.reset();
            setUploaded(0);
            setUploadTotal(0);
            setOpened(false);
            await updatePzAndKdb(data);
        } catch {
            notifications.show({
                title: 'Erreur',
                message: `Une erreur s'est produite veuillez réessayer plus tard...`,
                color: 'red',
            });
            if (uploaded != 0) {
                await deleteFolder(`classrooms/${data.currentClassroom}/pz/${form.values.name}/`);
            }
            form.reset();
            setUploaded(0);
            setUploadTotal(0);
            setOpened(false);
        }
    };

    const uploadFiles = async (files: FileWithPath[]) => {
        const promises = files.map((file) => {
            const storageRef = ref(
                storage,
                `classrooms/${data.currentClassroom}/pz/${form.values.name}/${file.name}`
            );
            return new Promise<string>((resolve, reject) => {
                const uploadTask = uploadBytesResumable(storageRef, file);

                uploadTask.on(
                    'state_changed',
                    (snapshot) => {},
                    (error) => reject(error),
                    async () => {
                        getDownloadURL(uploadTask.snapshot.ref)
                            .then((downloadURL) => {
                                setUploaded((p) => p + 1);
                                resolve(downloadURL);
                            })
                            .catch((error) => {
                                reject(error);
                            });
                    }
                );
            });
        });
        return Promise.all(promises);
    };

    return (
        <Modal opened={opened} onClose={() => setOpened(false)} title="Ajouter un évèmenent">
            {uploadTotal != 0 && uploaded != uploadTotal ? (
                <Progress value={(uploaded / uploadTotal) * 100} size="sm" style={{ flex: 1 }} />
            ) : (
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <TextInput
                        label="Nom"
                        placeholder="Rdk"
                        {...form.getInputProps('name')}
                        required
                    />

                    <Dropzone
                        mb={-30}
                        mt={15}
                        onDrop={(files) => {
                            form.setFieldValue(
                                'files',
                                removeDups([...form.getValues().files, ...files])
                            );
                        }}
                        onReject={(files) => console.log('rejected files', files)}
                        accept={IMAGE_MIME_TYPE}
                        maxSize={30 * 1024 ** 2}
                        radius="md"
                        className={classes.dropzone}
                    >
                        <Paper
                            withBorder
                            mx={5}
                            radius="md"
                            p="xs"
                            style={{ pointerEvents: 'none' }}
                        >
                            <Group justify="center">
                                <Dropzone.Accept>
                                    <IconDownload
                                        style={{ width: rem(50), height: rem(50) }}
                                        color={theme.colors.blue[6]}
                                        stroke={1.5}
                                    />
                                </Dropzone.Accept>
                                <Dropzone.Reject>
                                    <IconX
                                        style={{ width: rem(50), height: rem(50) }}
                                        color={theme.colors.red[6]}
                                        stroke={1.5}
                                    />
                                </Dropzone.Reject>
                                <Dropzone.Idle>
                                    <IconCloudUpload
                                        style={{ width: rem(50), height: rem(50) }}
                                        stroke={1.5}
                                    />
                                </Dropzone.Idle>
                            </Group>

                            <Text ta="center" fw={700} fz="lg" mt="xl">
                                <Dropzone.Accept>Sélectionnez vos images</Dropzone.Accept>
                                <Dropzone.Reject>Que des images !!!</Dropzone.Reject>
                                <Dropzone.Idle>Sélectionnez vos images</Dropzone.Idle>
                            </Text>
                            <Text ta="center" fz="sm" mt="xs" c="dimmed">
                                Evoyez vos images (taille au plus 30 mo)
                            </Text>
                        </Paper>
                    </Dropzone>
                    <Box mt="md">
                        {form.values.files.map((file, index) => (
                            <Group key={index} justify="space-between" mt="xs">
                                <div>{file.name}</div>
                                <ActionIcon
                                    color="red"
                                    onClick={() => {
                                        const newFiles = form.values.files.filter(
                                            (_, i) => i !== index
                                        );
                                        form.setFieldValue('files', newFiles);
                                    }}
                                >
                                    <IconTrash size={16} />
                                </ActionIcon>
                            </Group>
                        ))}
                    </Box>

                    <Group justify="end" mt="md">
                        <Button color="green" type="submit">
                            Envoyer
                        </Button>
                    </Group>
                </form>
            )}
        </Modal>
    );
}

function removeDups(arr: FileWithPath[]) {
    const newarr: FileWithPath[] = [];

    for (let file of arr) {
        if (newarr.find((f) => f.path == file.path) == null) newarr.push(file);
    }

    return newarr;
}

export default AddGallery;
