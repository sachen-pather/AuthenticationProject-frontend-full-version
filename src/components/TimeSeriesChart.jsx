import PropTypes from "prop-types";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const TimeSeriesChart = ({ data, xKey, yKey, title }) => {
  // Convert timestamp to readable date
  const formattedData = data.map((item) => ({
    ...item,
    formattedTime: new Date(item[xKey] * 1000).toLocaleString(), // Convert Unix timestamp to readable date
  }));

  return (
    <div className="chart-container" style={{ width: "100%", height: "40%" }}>
      <h3>{title}</h3>
      <ResponsiveContainer>
        <LineChart
          data={formattedData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="formattedTime"
            angle={-45}
            textAnchor="end"
            height={120}
          />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey={yKey}
            stroke="#8884d8"
            dot={false}
            name={yKey}
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
