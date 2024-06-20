import { useCallback, useState } from 'react';

function useReactMap<K, V>(m?: Map<K, V>) {
    const [map, setMap] = useState<Map<K, V>>(m ? m : new Map());

    const set = useCallback((key: K, value: V) => {
        setMap((prevMap) => {
            const newMap = new Map(prevMap);
            newMap.set(key, value);
            return newMap;
        });
    }, []);

    const remove = useCallback((key: K) => {
        setMap((prevMap) => {
            const newMap = new Map(prevMap);
            newMap.delete(key);
            return newMap;
        });
    }, []);

    const clear = useCallback(() => {
        setMap(new Map());
    }, []);

    const replace = useCallback((map: Map<K, V>) => {
        setMap(map);
    }, []);

    return {
        map,
        set,
        remove,
        clear,
        replace,
    };
}

export default useReactMap;
