import { addNewEntry, namesToIds, useDatabase } from '@/data/Database';
import { Button, Modal, MultiSelect, Switch, Textarea } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useState } from 'react';

function AddEntry({
    opened,
    setOpened,
    classroom,
}: {
    opened: boolean;
    setOpened: (opened: boolean) => void;
    classroom: string;
}) {
    const data = useDatabase();
    const [concerned, setConcerned] = useState([] as string[]);
    const [isPrivate, setPrivate] = useState(false);
    const [content, setContent] = useState('');

    return (
        <Modal title="Ajouter une entrée" opened={opened} onClose={() => setOpened(false)}>
            <MultiSelect
                label="Concernés"
                placeholder="Fab"
                data={[...data.students.map.values()]
                    .filter((s) => s.classroom == classroom)
                    .map((s) => s.name)}
                onChange={(v) => setConcerned(namesToIds(data, v))}
            />

            <Textarea label="Contenu" my={10} onChange={(e) => setContent(e.target.value)} />
            <Switch
                defaultChecked={isPrivate}
                label="Privé"
                color="green"
                onChange={(e) => setPrivate(e.target.checked)}
            />
            <Button
                mt={24}
                color={'green'}
                onClick={() => {
                    try {
                        const id = addNewEntry(data, concerned, content, isPrivate);

                        notifications.show({
                            title: 'Entrée ajoutée',
                            message: `L'entrée ${id} a été rajoutée !`,
                            color: 'green',
                        });

                        setOpened(false);
                    } catch {
                        notifications.show({
                            title: 'Erreur',
                            message: `Une erreur s'est produite veuillez réessayer plus tard...`,
                            color: 'red',
                        });
                        setOpened(false);
                    }
                }}
            >
                Ajouter
            </Button>
        </Modal>
    );
}

export default AddEntry;
