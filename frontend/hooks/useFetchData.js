const { default: axios } = require("axios");
const { useEffect, useState } = require("react");

function useFetchData(apiEndPoint) {
    const [allData, setAllData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [initialLoad, setInitialLoad] = useState(true);

    useEffect(() => {
        if (initialLoad) {
            setInitialLoad(false);
            setLoading(false);
            return;
        }

        setLoading(true);

        const fetchAllData = async () => {
            try {
                const res = await axios.get(apiEndPoint);
                const allData = res.data;
                setAllData(allData);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching news data", error);
                setLoading(false);
            }
        };

        if (apiEndPoint) {
            fetchAllData();
        }
    }, [initialLoad, apiEndPoint]);

    return { allData, loading };
}

export default useFetchData;
