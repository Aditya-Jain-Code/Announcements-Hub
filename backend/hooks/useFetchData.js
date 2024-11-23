const { default: axios } = require("axios");
const { useEffect, useState } = require("react");

function useFetchData(apiEndPoint) {
    // State to store the fetched data
    const [allData, setAllData] = useState([]);

    // State to track the loading status
    const [loading, setLoading] = useState(true);

    // State to ensure the API call happens only once during initial load
    const [initialLoad, setInitialLoad] = useState(true);

    useEffect(() => {
        if (initialLoad) {
            // Prevent API call on the initial render by setting initialLoad to false
            setInitialLoad(false);

            // Initially set loading to false to avoid the loading spinner on first render
            setLoading(false);
            return; // Exit the useEffect after setting initialLoad to false
        }

        // Set loading to true when data is being fetched
        setLoading(true);

        // Function to fetch data from the given API endpoint
        const fetchAllData = async () => {
            try {
                // Make an API call using axios
                const res = await axios.get(apiEndPoint);

                // Extract the data from the response
                const allData = res.data;

                // Update the state with the fetched data
                setAllData(allData);

                // Set loading to false after the data is successfully fetched
                setLoading(false);
            } catch (error) {
                // Log any errors that occur during the API call
                console.error("Error fetching news data", error);

                // Ensure loading is set to false even if there is an error
                setLoading(false);
            }
        };

        // Fetch data only if the API endpoint exists
        if (apiEndPoint) {
            fetchAllData();
        }
    }, [initialLoad, apiEndPoint]); // Dependencies: initialLoad and apiEndPoint to trigger data fetching

    // Return the fetched data and the loading state to be used in the component
    return { allData, loading };
}

export default useFetchData;
