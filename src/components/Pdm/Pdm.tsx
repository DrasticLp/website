import { FaidherbeFunction, useDatabase } from '@/data/Database';
import {
    Button,
    Center,
    Container,
    Select,
    SimpleGrid,
    Stack,
    Text,
    TextInput,
    Title,
} from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import colors from 'open-color';
import { useState } from 'react';
import AddEntry from './AddEntry';
import Counters from './Counters/Counters';
import EntryList from './EntryList/EntryList';
import PdmNews from './PdmNews/PdmNews';

function Pdm() {
    const data = useDatabase();
    const [ffunction, setFFunction] = useState<string | null>(null);
    const [search, setSearch] = useState<string>('');

    const [addEntryOpened, setAddEntryOpened] = useState(false);

    let students = new Map(
        [...data.students.map.entries()]
            .filter((s) => {
                const student = s[1];
                return (
                    student.classroom == data.currentClassroom &&
                    (!ffunction || student.functions.includes(ffunction)) &&
                    student.name.toLowerCase().includes(search.toLowerCase())
                );
            })
            .sort((a, b) => {
                if (a[1].name < b[1].name) {
                    return -1;
                }
                if (a[1].name > b[1].name) {
                    return 1;
                }
                return 0;
            })
    );

    return (
        <div id="pdmsection" key="pdmsection">
            <Title my="xl" className={'a'} ta="center">
                Section{' '}
                <Text
                    inherit
                    variant="gradient"
                    component="span"
                    gradient={{ from: colors.green[2], to: 'green', deg: 45 }}
                >
                    PDM
                </Text>
            </Title>
            <PdmNews />
            <Center mb={10}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Counters />

                    <Title size="25px" my="sm" className={'a'} ta="center">
                        <Text
                            inherit
                            variant="gradient"
                            component="span"
                            gradient={{ from: colors.green[2], to: 'green', deg: 45 }}
                        >
                            Entrées
                        </Text>
                    </Title>

                    <SimpleGrid
                        mx={10}
                        cols={{ base: 1, sm: 2, lg: 5 }}
                        spacing={{ base: 10, sm: 'xl' }}
                        verticalSpacing={{ base: 'md', sm: 'xl' }}
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <div>
                            <Select
                                label="Fonction"
                                placeholder={'Choisissez'}
                                data={FaidherbeFunction}
                                onChange={(v) => {
                                    if (v == FaidherbeFunction[0]) setFFunction(null);
                                    else setFFunction(v);
                                }}
                            />
                        </div>
                        <div>
                            <TextInput
                                label="Nom"
                                placeholder="Antoine Lesuceur"
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <div>
                            <Button
                                mt={24}
                                color={'green'}
                                onClick={() => {
                                    setAddEntryOpened(true);
                                }}
                            >
                                <IconPlus />
                            </Button>
                        </div>

                        <AddEntry
                            classroom={data.currentClassroom || ''}
                            opened={addEntryOpened}
                            setOpened={setAddEntryOpened}
                        ></AddEntry>
                    </SimpleGrid>
                </div>
            </Center>

            <Container my="md">
                <SimpleGrid key="students" cols={{ base: 1, xs: 4 }}>
                    <Stack>
                        {[...students.values()].map((v, i) => {
                            if (i % 4 == 0) return <EntryList key={v.id} student={v} />;
                            else return null;
                        })}
                    </Stack>
                    <Stack my={20}>
                        {[...students.values()].map((v, i) => {
                            if (i % 4 == 1) return <EntryList key={v.id} student={v} />;
                            else return null;
                        })}
                    </Stack>
                    <Stack>
                        {[...students.values()].map((v, i) => {
                            if (i % 4 == 2) return <EntryList key={v.id} student={v} />;
                            else return null;
                        })}
                    </Stack>
                    <Stack my={15}>
                        {[...students.values()].map((v, i) => {
                            if (i % 4 == 3) return <EntryList key={v.id} student={v} />;
                            else return null;
                        })}
                    </Stack>
                </SimpleGrid>
            </Container>
        </div>
    );
}

export default Pdm;
