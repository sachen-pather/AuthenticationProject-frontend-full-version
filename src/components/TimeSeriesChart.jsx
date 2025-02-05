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

const TimeSeriesChart = ({ data, xKey, yKey, title, startDate, endDate }) => {
  const chartContainerRef = useRef(null);
  const [chartDimensions, setChartDimensions] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const handleResize = () => {
      if (chartContainerRef.current) {
        setChartDimensions({
          width: chartContainerRef.current.offsetWidth,
          height: chartContainerRef.current.offsetHeight,
        });
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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
