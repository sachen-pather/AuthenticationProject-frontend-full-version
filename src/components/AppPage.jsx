import { useAuth } from "../AuthContext";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import TimeSeriesChart from "./TimeSeriesChart";
import "./AppPage.css";

const AppPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const [data, setData] = useState(null);
  const [dataType, setDataType] = useState("pSC");
  const [deviceId, setDeviceId] = useState("e00fce68e3dabdc63fb13d69");
  const [loading, setLoading] = useState(true);

  // Initialize dates
  const getDefaultDates = useCallback(() => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const formattedToday = today.toISOString().slice(0, 19);
    const formattedYesterday = yesterday.toISOString().slice(0, 19);

    return { today: formattedToday, yesterday: formattedYesterday };
  }, []);

  const [startDate, setStartDate] = useState(() => getDefaultDates().yesterday);
  const [endDate, setEndDate] = useState(() => getDefaultDates().today);

  // Authentication check
  useEffect(() => {
    const checkAuth = () => {
      const storedAuth = localStorage.getItem("isAuthenticated");
      if (!storedAuth) {
        setIsAuthenticated(false);
        navigate("/");
      }
      setLoading(false);
    };

    checkAuth();
  }, [navigate, setIsAuthenticated]);

  // Logout handler
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

  // Data retrieval handler
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

  // Effect for data retrieval
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
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default AppPage;
