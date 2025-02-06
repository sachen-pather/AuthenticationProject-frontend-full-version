import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Brush,
} from "recharts";

/**
 * TimeSeriesChart component renders a responsive line chart with time series data.
 *
 * @param {Object[]} data - The data to be displayed in the chart.
 * @param {string} xKey - The key for the x-axis values in the data.
 * @param {string} yKey - The key for the y-axis values in the data.
 * @param {string} title - The title of the chart.
 * @param {string} startDate - The start date for the time series data.
 * @param {string} endDate - The end date for the time series data.
 *
 * @returns {JSX.Element} The rendered TimeSeriesChart component.
 *
 * @example
 * <TimeSeriesChart
 *   data={[{ timestamp: 1627849200, value: 10 }, { timestamp: 1627935600, value: 15 }]}
 *   xKey="timestamp"
 *   yKey="value"
 *   title="Sample Time Series Chart"
 *   startDate="2021-08-01"
 *   endDate="2021-08-02"
 * />
 *
 * @component
 * @example
 * // Example usage:
 * <TimeSeriesChart
 *   data={[{ timestamp: 1627849200, value: 10 }, { timestamp: 1627935600, value: 15 }]}
 *   xKey="timestamp"
 *   yKey="value"
 *   title="Sample Time Series Chart"
 *   startDate="2021-08-01"
 *   endDate="2021-08-02"
 * />
 *
 * @description
 * This component uses the Recharts library to render a responsive line chart. It adjusts its dimensions
 * based on the container size and formats the x-axis labels based on the date range.
 *
 * @remarks
 * The component uses the `useRef` hook to reference the chart container and the `useState` hook to manage
 * the chart dimensions. The `useEffect` hook is used to handle window resize events and update the chart dimensions.
 *
 * @see {@link https://recharts.org/en-US/api/LineChart} for more information on the LineChart component from Recharts.
 */
const TimeSeriesChart = ({ data, xKey, yKey, title, startDate, endDate }) => {
  // Create a reference to the chart container
  const chartContainerRef = useRef(null);
  // State to store chart dimensions
  const [chartDimensions, setChartDimensions] = useState({
    width: 0,
    height: 0,
  });

  // Effect to handle window resize events
  useEffect(() => {
    const handleResize = () => {
      if (chartContainerRef.current) {
        // Update chart dimensions based on container size
        setChartDimensions({
          width: chartContainerRef.current.offsetWidth,
          height: chartContainerRef.current.offsetHeight,
        });
      }
    };

    // Add resize event listener
    window.addEventListener("resize", handleResize);
    // Initial call to set dimensions
    handleResize();

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Define margin as a percentage of chart dimensions
  const marginPercentage = 0.1; // 10% margin
  const margin = {
    top: chartDimensions.height * marginPercentage,
    right: chartDimensions.width * marginPercentage,
    bottom: chartDimensions.height * marginPercentage,
    left: 0,
  };

  // Calculate the difference between start and end dates
  const start = new Date(startDate);
  const end = new Date(endDate);
  const dateDifference = (end - start) / (1000 * 60 * 60 * 24); // Difference in days

  // Convert timestamp to readable date
  const formattedData = data.map((item) => ({
    ...item,
    formattedTime: new Date(item[xKey] * 1000).toLocaleString(), // Convert Unix timestamp to readable date
  }));

  return (
    <div
      ref={chartContainerRef}
      className="chart-container"
      style={{
        width: "100%",
        height: "65%",
        backgroundColor: "black",
        border: "2px solid #00ff00", // Added border
      }}
    >
      <h3 style={{ color: "white" }}>{title}</h3>
      <ResponsiveContainer>
        <LineChart data={formattedData} margin={margin}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="formattedTime"
            angle={-60}
            textAnchor="end"
            height={40}
            tick={{ fontSize: 10, fill: "white" }} // Smaller font size and white color
            tickFormatter={(timeStr) => {
              const date = new Date(timeStr);
              return dateDifference <= 1
                ? date.toLocaleTimeString(undefined, {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : date.toLocaleDateString(undefined, {
                    day: "numeric",
                    month: "numeric",
                    year: "numeric",
                  });
            }}
          />
          <YAxis tick={{ fill: "white" }} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey={yKey}
            stroke="#00FF00" // Green color
            strokeWidth={3} // Thick line
            dot={false}
          />
          <Brush
            dataKey="formattedTime"
            height={30} // Less thick
            stroke="#00FF00"
            y={chartDimensions.height * 0.8} // Shift down
            fill="#000000" // Fill inside with black
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

TimeSeriesChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  xKey: PropTypes.string.isRequired,
  yKey: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  startDate: PropTypes.string.isRequired,
  endDate: PropTypes.string.isRequired,
};

export default TimeSeriesChart;
