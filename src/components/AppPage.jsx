import { useAuth } from "../AuthContext";
import { useState, useEffect, useCallback } from "react";
import TimeSeriesChart from "./TimeSeriesChart";
import "./AppPage.css";

const AppPage = () => {
  const { setIsAuthenticated } = useAuth();
  const [data, setData] = useState(null);
  const [dataType, setDataType] = useState("pSC");
  const [deviceId, setDeviceId] = useState("e00fce68e3dabdc63fb13d69");

  const getDefaultDates = () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Format dates to ISO string and slice to get the format "YYYY-MM-DDTHH:mm:ss"
    const formattedToday = today.toISOString().slice(0, 19);
    const formattedYesterday = yesterday.toISOString().slice(0, 19);

    return { today: formattedToday, yesterday: formattedYesterday };
  };

  const defaultDates = getDefaultDates();
  const [startDate, setStartDate] = useState(defaultDates.yesterday);
  const [endDate, setEndDate] = useState(defaultDates.today);

  /* const formatDateTime = (date, time) => {
    if (!date || !time) return "";
    return `${date}T${time}`;
  };*/

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
        setIsAuthenticated(false);
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleRetrieval = useCallback(async () => {
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
      console.log("Response status:", response.status);
      const jsonData = await response.json();
      const endTime = performance.now();
      console.log(`Data retrieval took ${endTime - startTime}ms`);
      console.log("Received data:", jsonData);
      setData(jsonData);
    } catch (error) {
      const endTime = performance.now();
      console.log(`Data retrieval failed after ${endTime - startTime}ms`);
      console.error("retrieval failed:", error);
      setData(null);
    }
  }, [deviceId, startDate, endDate, dataType]);

  useEffect(() => {
    handleRetrieval();
  }, [handleRetrieval]);

  return (
    <div className="app-container">
      <header className="nav-header">
        <div className="nav-content">
          <div className="branding">
            <h1 className="nav-title">
              Welcome to your dashboard! You are now signed in and can access
              all protected features. 🎉
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
              yKey={`${dataType}`}
              title={`${dataType}  Over Time`}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default AppPage;
