import type { PlayerStats } from '@/pages/statistics/types/playerStats.types';
import type { MatchChartData } from '../types/playerMatchChartData.types';
import { CHART_COLORS } from '../constants/chart.constants';
import { Grid, Paper, Typography } from '@mui/material';
import { chartContainerSx, gridSize } from '../PlayerPage.styles';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface PlayerChartsProps {
  chartData: MatchChartData[];
  playerStats: PlayerStats;
}

export default function PlayerCharts({ chartData, playerStats }: PlayerChartsProps) {
  const pieChartData = [
    { name: 'Wins', value: playerStats.wins, fill: CHART_COLORS.green },
    { name: 'Losses', value: playerStats.losses, fill: CHART_COLORS.red },
    { name: 'Draws', value: playerStats.draws, fill: CHART_COLORS.orange },
  ].filter((item) => item.value > 0);

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid size={gridSize}>
        <Paper elevation={0} sx={chartContainerSx}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Win Rate over time
          </Typography>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData} margin={{ bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="matchIndex"
                label={{ value: 'Match', position: 'insideBottom', offset: -15 }}
              />
              <YAxis unit="%" domain={[0, 100]} />
              <Tooltip formatter={(value) => `${value}%`} />
              <Line
                type="monotone"
                dataKey="cumulativeWinRate"
                stroke={CHART_COLORS.blue}
                strokeWidth={2}
                dot={false}
                name="Win Rate"
              />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>
      <Grid size={gridSize}>
        <Paper elevation={0} sx={chartContainerSx}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Avg Goals over time
          </Typography>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData} margin={{ bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="matchIndex"
                label={{ value: 'Match', position: 'insideBottom', offset: -15 }}
              />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="cumulativeAvgGoals"
                stroke={CHART_COLORS.green}
                strokeWidth={2}
                dot={false}
                name="Avg Goals"
              />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>
      <Grid size={gridSize}>
        <Paper elevation={0} sx={chartContainerSx}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Goals per match
          </Typography>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData} margin={{ bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="matchIndex"
                label={{ value: 'Match', position: 'insideBottom', offset: -2 }}
              />
              <YAxis />
              <Tooltip itemSorter={(item) => (item.dataKey === 'goalsScored' ? -1 : 1)} />
              <Legend
                wrapperStyle={{ bottom: -10 }}
                itemSorter={(item) => (item.dataKey === 'goalsScored' ? -1 : 1)}
              />
              <Bar dataKey="goalsScored" fill={CHART_COLORS.blue} name="Goals Scored" />
              <Bar dataKey="goalsConceded" fill={CHART_COLORS.red} name="Goals Conceded" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>
      <Grid size={gridSize}>
        <Paper elevation={0} sx={chartContainerSx}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Results breakdown
          </Typography>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                outerRadius={70}
                dataKey="value"
                labelLine={true}
                label={({ name, value }) => `${name}: ${value}`}
              ></Pie>
            </PieChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>
    </Grid>
  );
}
