import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

type CircularChartProps = {
  value: number;
  total: number;
  label: string;
  color: string;
};

export default function CircularChart({
  value,
  total,
  label,
  color,
}: CircularChartProps) {
  const percentage = total > 0 ? (value / total) * 100 : 0;
  const radius = 60;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * percentage) / 100;

  return (
    <View style={styles.chartBox}>
      <Text style={styles.chartTitle}>{label}</Text>

      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Svg width={150} height={150}>
          <Circle
            stroke="#333"
            fill="none"
            cx="80"
            cy="80"
            r={radius}
            strokeWidth={strokeWidth}
          />

          <Circle
            stroke={color}
            fill="none"
            cx="80"
            cy="80"
            r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </Svg>

        <View style={styles.centerText}>
          <Text style={styles.centerValue}>{value}</Text>
          <Text style={styles.centerLabel}>{label}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  chartBox: {
    width: '100%',
    backgroundColor: '#1e1e2d',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
  },
  chartTitle: {
    color: '#fff',
    fontSize: 24,
    marginBottom: 15,
  },
  centerText: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerValue: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  centerLabel: {
    color: '#aaa',
    fontSize: 18,
  },
});
