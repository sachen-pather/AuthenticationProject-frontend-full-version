import PropTypes from "prop-types";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const TimeSeriesChart = ({ data, xKey, yKey, title }) => {
  // Convert timestamp to readable date
  const formattedData = data.map((item) => ({
    ...item,
    formattedTime: new Date(item[xKey] * 1000).toLocaleString(), // Convert Unix timestamp to readable date
  }));

  return (
    <div
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
        <LineChart
          data={formattedData}
          margin={{ top: 5, right: 30, left: 0, bottom: 40 }} // Increased bottom margin
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="formattedTime"
            angle={-60}
            textAnchor="end"
            height={40}
            tick={{ fontSize: 10, fill: "white" }} // Smaller font size and white color
            tickFormatter={(timeStr) => {
              const date = new Date(timeStr);
              return date.toLocaleDateString(undefined, {
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
};

export default TimeSeriesChart;
