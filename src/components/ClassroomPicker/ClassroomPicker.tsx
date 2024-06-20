import { useDatabase } from '@/data/Database';
import { SegmentedControl, Stack, Text } from '@mantine/core';
import classes from './ClassroomPicker.module.css';

function ClassroomPicker() {
    const data = useDatabase();
    return (
        <Stack mt={15} align="center">
            <div>
                <Text size="sm" fw={500} mb={3} ml={2}>
                    Classe
                </Text>
                <SegmentedControl
                    size="md"
                    data={data.classrooms}
                    classNames={classes}
                    defaultValue={data.currentClassroom || '230'}
                    onChange={(v) => {
                        data.setCurrentClassroom(v);
                    }}
                />
            </div>
        </Stack>
    );
}

export default ClassroomPicker;
