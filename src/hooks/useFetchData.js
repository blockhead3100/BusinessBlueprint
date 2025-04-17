import { useState, useEffect } from 'react';

const useFetchData = (url) => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            try {
                const response = await fetch(url);
                if (isMounted) {
                    setData(await response.json());
                }
            } catch (error) {
                if (isMounted) {
                    setError(error);
                }
            }
        };

        fetchData();

        return () => {
            isMounted = false; // Cleanup to prevent memory leaks
        };
    }, [url]);

    return { data, error };
};

export default useFetchData;