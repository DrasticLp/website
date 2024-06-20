import ClassroomPicker from '@/components/ClassroomPicker/ClassroomPicker';
import Footer from '@/components/Footer/Footer';
import Header from '@/components/Header/Header';
import Kdb from '@/components/Kdb/Kdb';
import Pdm from '@/components/Pdm/Pdm';
import Pz from '@/components/Pz/Pz';
import { auth, useDatabase } from '@/data/Database';
import { Fragment } from 'react/jsx-runtime';
import { Hero } from '../components/Hero/Hero';

export function HomePage() {
    const data = useDatabase();
    auth.onAuthStateChanged((user) => {
        if (user) {
            if (!data.connected) data.setConnected(true);
        } else if (data.connected) {
            data.setConnected(false);
        }
    });

    return (
        <Fragment>
            <Header />
            <Hero />
            <ClassroomPicker />
            <Pdm />
            <Pz />
            <Kdb />
            <Footer />
        </Fragment>
    );
}
