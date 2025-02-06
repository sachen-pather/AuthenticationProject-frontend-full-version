import { useAuth } from "../AuthContext";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import TimeSeriesChart from "./TimeSeriesChart";
import "./AppPage.css";

/**
 * AppPage component handles user authentication, data retrieval, and rendering of the main application page.
 *
 * - Initializes default dates (today and yesterday) for data retrieval.
 * - Checks user authentication status and redirects to login page if not authenticated.
 * - Provides a logout function to handle user sign-out.
 * - Retrieves data based on user input parameters (device ID, data type, start date, end date).
 * - Displays a loading indicator while checking authentication status.
 * - Renders the main application interface with input fields for device ID, data type, and date range.
 * - Displays a time series chart with the retrieved data if available.
 *
 * @component
 */

const AppPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const [data, setData] = useState(null);
  const [dataType, setDataType] = useState("pSC");
  const [deviceId, setDeviceId] = useState("e00fce68e3dabdc63fb13d69");
  const [loading, setLoading] = useState(true);

  const getDefaultDates = useCallback(() => {
    const today = new Date();
    const yesterday = new Date(today);
    // Set the date of the 'yesterday' object to one day before today
    yesterday.setDate(yesterday.getDate() - 1);

    // Format the dates to ISO string and slice to get the first 19 characters (YYYY-MM-DDTHH:MM:SS)
    const formattedToday = today.toISOString().slice(0, 19);
    const formattedYesterday = yesterday.toISOString().slice(0, 19);

    // Return an object containing the formatted dates
    return { today: formattedToday, yesterday: formattedYesterday };
  }, []); // useCallback ensures the function is memoized and not recreated on every render

  const [startDate, setStartDate] = useState(() => getDefaultDates().yesterday);
  const [endDate, setEndDate] = useState(() => getDefaultDates().today);

  // Effect to check authentication status
  useEffect(() => {
    const checkAuth = () => {
      // Retrieve the authentication status from localStorage
      const storedAuth = localStorage.getItem("isAuthenticated");
      if (!storedAuth) {
        setIsAuthenticated(false);
        navigate("/");
      }
      setLoading(false);
    };

    checkAuth();
  }, [navigate, setIsAuthenticated]); // Dependencies array ensures this effect runs only when navigate or setIsAuthenticated changes

  /** Function to handle user logout
   * Handles the logout process by making a request to the logout endpoint.
   *
   * This function performs the following steps:
   * 1. Sends a GET request to the logout endpoint using the fetch API.
   * 2. If the request is successful (response.ok), it removes the "isAuthenticated" item from localStorage,
   *    updates the authentication state, and navigates to the home page.
   * 3. If the request fails, it logs the error status to the console.
   * 4. In case of any error during the fetch request, it logs the error to the console,
   *    clears the local authentication state, and navigates to the home page.
   */

  const handleLogout = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_LOGIN_DATABASE}/Account/logout`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_BEARER_LOGIN}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        localStorage.removeItem("isAuthenticated");
        setIsAuthenticated(false);
        navigate("/");
      } else {
        console.error("Logout failed with status:", response.status);
      }
    } catch (error) {
      console.error("Logout failed:", error);
      // Still clear local auth on error
      localStorage.removeItem("isAuthenticated");
      setIsAuthenticated(false);
      navigate("/");
    }
  };

  // Function to handle data retrieval
  /**
   * Handles the retrieval of data from a remote server based on specified parameters.
   *
   * This function is used to fetch data from a remote server using the provided device ID,
   * start date, end date, and data type. It performs the following steps:
   * 1. Checks if the user is authenticated. If not, it exits early.
   * 2. Validates the required parameters (deviceId, startDate, endDate, dataType). If any are missing, it logs a message and exits early.
   * 3. Initiates a fetch request to the remote server with the specified parameters.
   * 4. Handles the response:
   *    - If the response status is 401 (Unauthorized), it logs the user out and navigates to the home page.
   *    - If the response is not OK, it throws an error.
   *    - If the response is OK, it parses the JSON data and updates the state with the retrieved data.
   * 5. Logs the time taken for the data retrieval process.
   * 6. Handles any errors that occur during the fetch request and logs the time taken before the failure.
   *
   * @async
   * @function handleRetrieval
   * @returns {Promise<void>} A promise that resolves when the data retrieval process is complete.
   */
  const handleRetrieval = useCallback(async () => {
    if (!isAuthenticated) return;

    if (
      !deviceId?.trim() ||
      !startDate?.trim() ||
      !endDate?.trim() ||
      !dataType?.trim()
    ) {
      console.log("Missing required parameters - skipping data retrieval");
      setData(null);
      return;
    }

    const startTime = performance.now();
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_DATA_DATABASE
        }?deviceId=${deviceId}&startDate=${startDate}&endDate=${endDate}&Data=${dataType}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_BEARER_TOKEN}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("isAuthenticated");
          setIsAuthenticated(false);
          navigate("/");
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const jsonData = await response.json();
      const endTime = performance.now();
      console.log(`Data retrieval took ${endTime - startTime}ms`);

      if (!jsonData || (Array.isArray(jsonData) && jsonData.length === 0)) {
        console.log("Received empty data");
        setData(null);
        return;
      }

      setData(jsonData);
    } catch (error) {
      const endTime = performance.now();
      console.log(`Data retrieval failed after ${endTime - startTime}ms`);
      console.error("Retrieval failed:", error);
      setData(null);
    }
  }, [
    deviceId,
    startDate,
    endDate,
    dataType,
    isAuthenticated,
    navigate,
    setIsAuthenticated,
  ]);

  // Effect to trigger data retrieval when dependencies change
  useEffect(() => {
    if (isAuthenticated && !loading) {
      handleRetrieval();
    }
  }, [handleRetrieval, isAuthenticated, loading]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="app-container">
      <header className="nav-header">
        <div className="nav-content">
          <div className="branding">
            <h1 className="nav-title">
              Welcome! You can now monitor real time performance of the
              batteries.
            </h1>
          </div>
          <div className="nav-actions">
            <button onClick={handleLogout} className="logout-button">
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="content-card">
          <div className="input-container">
            <div className="device-input">
              <label>Device ID:</label>
              <input
                type="text"
                value={deviceId}
                onChange={(e) => setDeviceId(e.target.value)}
                placeholder="Enter Device ID"
              />
            </div>

            <div className="device-input">
              <label>Data Type:</label>
              <input
                type="text"
                value={dataType}
                onChange={(e) => setDataType(e.target.value)}
                placeholder="Enter Data Type"
              />
            </div>

            <div className="date-container">
              <div className="date-input">
                <label>Start Date:</label>
                <input
                  type="datetime-local"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div className="date-input">
                <label>End Date:</label>
                <input
                  type="datetime-local"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          {data && (
            <TimeSeriesChart
              data={data}
              xKey="ts"
              yKey={dataType}
              title={`${dataType} Over Time`}
              startDate={`${startDate}`}
              endDate={`${endDate}`}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default AppPage;
