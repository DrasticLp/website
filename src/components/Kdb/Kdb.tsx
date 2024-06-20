import { isConnected, useDatabase } from '@/data/Database';
import { Container, SegmentedControl, Stack, Text, Title } from '@mantine/core';
import colors from 'open-color';
import { useState } from 'react';
import classes from './Kdb.module.css';

function Kdb() {
    const data = useDatabase();
    const [Kdb, setKdb] = useState<string>(data.kdbList[0] || '228');

    return isConnected() ? (
        <div key="kdbsection" id="kdbsection">
            <Title my="xl" className={'a'} ta="center">
                Section{' '}
                <Text
                    inherit
                    variant="gradient"
                    component="span"
                    gradient={{ from: colors.green[2], to: 'green', deg: 45 }}
                >
                    Kharnet de Khlasse
                </Text>
            </Title>
            <Stack mt={15} mb={20} align="center">
                <div>
                    <SegmentedControl
                        size="md"
                        data={data.kdbList}
                        classNames={classes}
                        defaultValue={data.kdbList[0] || '228'}
                        onChange={(v) => {
                            setKdb(v);
                        }}
                    />
                </div>
            </Stack>
            {data.kdbList.length > 0 ? (
                <Container>
                    <iframe
                        src={
                            'https://firebasestorage.googleapis.com/v0/b/hx3-faidherbe.appspot.com/o/kdb%2F' +
                            Kdb +
                            '.pdf?alt=media'
                        }
                        width="100%"
                        height="500px"
                    />
                </Container>
            ) : (
                ''
            )}
        </div>
    ) : (
        ''
    );
}

export default Kdb;
