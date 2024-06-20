import { randomId } from '@mantine/hooks';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { Auth, browserSessionPersistence, getAuth, setPersistence } from 'firebase/auth';
import {
    Firestore,
    Timestamp,
    collection,
    doc,
    getDocs,
    getFirestore,
    query,
    setDoc,
    where,
} from 'firebase/firestore';
import { deleteObject, getStorage, listAll, ref } from 'firebase/storage';
import { ReactNode, createContext, useContext, useState } from 'react';
import useReactMap from './ReactMap';
import firebaseConfig from './firebaseconfig';

export const firebase: FirebaseApp = initializeApp(firebaseConfig);
export const db: Firestore = getFirestore(firebase);
export const auth: Auth = getAuth(firebase);
export const storage = getStorage(firebase);

export const storageBaseUrl =
    'https://firebasestorage.googleapis.com/v0/b/hx3-faidherbe.appspot.com/o';

export const FaidherbeFunction = [
    'Peu Importe',
    'Z',
    'CDO',
    'SUICIDE',
    'SEKHSB',
    'MISS',
    'LSD',
    'KS',
    'PZ',
    'PDM',
    'ROH',
    'TANPHY',
    'SKHRIBE',
    'APOLLON',
    'KAMIKAZE',
    'VENUS',
    'TARZAN',
];

export type PDMEntry = {
    concerned: string[];
    content: string;
    date: Timestamp;
    private: boolean;
    id: string;
};

export type PZGallery = {
    name: string;
    classroom: string;
    images: string[];
};

export type Student = {
    id: string;
    name: string;
    functions: string[];
    description: string;
    classroom: string;
    img: string;
};

type StudentMap = ReturnType<typeof useReactMap<string, Student>>;
type EntryMap = ReturnType<typeof useReactMap<string, PDMEntry>>;
type PZMap = ReturnType<typeof useReactMap<string, PZGallery>>;

type ContextType = {
    entries: EntryMap;
    students: StudentMap;
    connected: boolean;
    setConnected: (connected: boolean) => void;
    counter: any;
    setCounter: (counter: any) => void;
    pz: PZMap;
    classrooms: string[];
    setCurrentClassroom: (classroom: string) => void;
    currentClassroom: string;
    kdbList: string[];
    setKdbList: (kdbList: string[]) => void;
};
const DatabaseContext = createContext<ContextType | undefined>(undefined);

export let initialized = false;

export async function refreshDatabase(ctx: ContextType) {
    initialized = true;

    await setPersistence(auth, browserSessionPersistence);
    await updateEntries(ctx.entries);
    await updateStudents(ctx);
    await updatePzAndKdb(ctx);

    console.log('Database initialized');
}

export async function setEntry(ctx: ContextType, entry: PDMEntry) {
    if (!(entry.date instanceof Timestamp))
        entry.date = new Timestamp((entry.date as any).seconds, (entry.date as any).nanoseconds);

    await setDoc(doc(db, 'entries', entry.id), {
        concerned: entry.concerned,
        content: entry.content,
        date: entry.date,
        private: entry.private,
    });

    ctx.entries.set(entry.id, entry);
}

export async function addNewEntry(
    ctx: ContextType,
    concerned: string[],
    content: string,
    isPrivate: boolean
) {
    const id = randomId();
    const entry = {
        id,
        concerned: concerned,
        content: content,
        date: Timestamp.now(),
        private: isPrivate,
    };
    await setEntry(ctx, entry);
    return id;
}

export async function updateEntries(entries: EntryMap) {
    const col = hasPDMAccess()
        ? await getDocs(collection(db, 'entries'))
        : await getDocs(query(collection(db, 'entries'), where('private', '==', false)));

    let map = new Map<string, PDMEntry>();
    for (let doc of col.docs) {
        const id = doc.id;
        const content = doc.data().content;
        const date = doc.data().date;
        const isprivate = doc.data().private;
        const concerned = doc.data().concerned;

        map.set(id, {
            id,
            concerned,
            content,
            date: date instanceof Timestamp ? date : new Timestamp(date.seconds, date.nanoseconds),
            private: isprivate,
        });
    }

    entries.replace(map);
}

export async function deleteFolder(path: string) {
    const storageRef = await ref(storage, path);
    const files = await listAll(storageRef);
    await Promise.all(files.items.map((file) => deleteObject(file)));
}

export async function updatePzAndKdb(ctx: ContextType) {
    const d = await (await fetch(storageBaseUrl)).json();
    const map = new Map<string, PZGallery>();

    const kdb: string[] = [];

    for (let item of d.items) {
        if (item.name.startsWith('classrooms/') && item.name.split('/')[2] == 'pz') {
            const gallery = item.name.split('/')[3];

            if (!map.has(gallery))
                map.set(gallery, { name: gallery, images: [], classroom: item.name.split('/')[1] });
            map
                .get(gallery)
                ?.images.push(
                    storageBaseUrl + '/' + item.name.replaceAll('/', '%2F') + '?alt=media'
                );
        } else if (item.name.startsWith('kdb/')) {
            kdb.push((item.name as string).split('/').pop()?.split('.')[0] as string);
        }
    }
    ctx.setKdbList(kdb);
    ctx.pz.replace(map);
}

export async function updateStudents(ctx: ContextType) {
    const col = await getDocs(collection(db, 'classrooms'));

    let map = new Map<string, Student>();
    const cter = {
        ...ctx.counter,
    };
    for (let doc of col.docs) {
        const classroom = doc.id;

        for (let id in doc.data().students) {
            const student = doc.data().students[id];
            let s: Student = {
                classroom,
                description: student.description,
                id: id,
                name: student.name,
                functions: student.functions,
                img: getProfileUrl(classroom, student.name),
            };

            map.set(id, s);
        }

        cter[classroom] = {
            tan: doc.data().tan,
            arctan: doc.data().arctan,
            cotan: doc.data().cotan,
            tanpon: doc.data().tanpon,
        };
    }
    ctx.setCounter(cter);

    ctx.students.replace(map);
}

function getProfileUrl(classroom: string, name: string) {
    const relPath =
        `classrooms/${classroom}/profiles/${name.toLowerCase().replaceAll(' ', '')}.png?alt=media`.replaceAll(
            '/',
            '%2F'
        );
    const u = `${storageBaseUrl}/${relPath}`;

    return u;
}

export function isConnected() {
    if (auth && auth.currentUser) return true;
    return false;
}

export function hasPDMAccess() {
    if (!auth || !auth.currentUser) return false;

    return (
        (isConnected() && auth.currentUser.email == 'tarikdu137@gmail.com') ||
        auth.currentUser.email?.startsWith('pdm')
    );
}

export function hasPZAccess() {
    if (!auth || !auth.currentUser) return false;

    return (
        (isConnected() && auth.currentUser.email == 'tarikdu137@gmail.com') ||
        auth.currentUser.email?.startsWith('pz')
    );
}

export function isValidFolderName(folderName: string): boolean {
    // Caractères interdits sur Windows
    const invalidCharacters = /[<>:"/\\|?*\x00-\x1F]/;

    // Vérifier la longueur du nom (facultatif, peut varier selon le système de fichiers)
    if (folderName.length === 0 || folderName.length > 255) {
        return false;
    }

    // Vérifier les caractères interdits
    if (invalidCharacters.test(folderName)) {
        return false;
    }

    // Si toutes les vérifications passent, le nom est valide
    return true;
}

export function getUserFromName(ctx: ContextType, name: string) {
    if (ctx.classrooms.includes(ctx.currentClassroom)) {
        const l = [...ctx.students.map.values()].filter((v) => v.name == name);
        if (l.length > 0) {
            return l[0];
        }
    }
    return undefined;
}

export function namesToIds(ctx: ContextType, names: string[]): string[] {
    return names.map((s) => getUserFromName(ctx, s)?.id).filter((n) => n != undefined) as string[];
}

export function idsToNames(ctx: ContextType, ids: string[]): string[] {
    return ids.map((s) => ctx.students.map.get(s)?.name).filter((n) => n != undefined) as string[];
}

export function hasMathAccess(ctx: ContextType) {
    return ctx.connected && auth.currentUser;
}
export function areEntriesSame(entry1: PDMEntry, entry2: PDMEntry) {
    return (
        entry1.private == entry2.private &&
        arraysEqual(entry1.concerned, entry2.concerned) &&
        entry1.content == entry2.content
    );
}

function arraysEqual(a: any[], b: any[]) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;

    for (var i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}

export function DatabaseContextProvider({ children }: { children: ReactNode | undefined }) {
    const entries = useReactMap<string, PDMEntry>();
    const students = useReactMap<string, Student>();
    const pz = useReactMap<string, PZGallery>();
    const [connected, setConnected] = useState(isConnected());

    const [counter, setCounter] = useState({});
    const [currentClassroom, setCurrentClassroom] = useState('230');

    const classrooms: string[] = [...Object.keys(counter)];
    const [kdbList, setKdbList] = useState([] as string[]);

    return (
        <DatabaseContext.Provider
            value={{
                entries,
                students,
                connected,
                setConnected,
                counter,
                setCounter,
                classrooms,
                pz,
                setCurrentClassroom,
                currentClassroom,
                kdbList,
                setKdbList,
            }}
        >
            {children}
        </DatabaseContext.Provider>
    );
}

export function useDatabase() {
    const ctx = useContext(DatabaseContext);

    if (!initialized && ctx) refreshDatabase(ctx);

    if (!ctx) throw new Error('useReactMapContext must be used within a ReactMapProvider');
    return ctx;
}
