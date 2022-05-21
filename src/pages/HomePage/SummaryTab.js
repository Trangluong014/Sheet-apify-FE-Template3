import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Typography,
  Box,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  ListItemButton,
  ListItemIcon,
} from "@mui/material";
import { 
  Bar,
  Cell,
  BarChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
  PieChart,
  Pie,
} from "recharts";
import { useEffect, useMemo, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTheme } from '@mui/material/styles';
import { DEFAULT_DATE_FORMAT } from "../../app/config";
import LoadingScreen from "../../components/LoadingScreen";
import { useWebsiteConfig } from "../../hooks/useWebsiteConfig";
import { getAllExpenses } from "../../features/expenses/expensesSlice";
import EmptyScreen from "../../components/EmptyScreen"
import _range from "lodash/range";
import _round from "lodash/round"
import addDays from "date-fns/addDays";
import getDay from "date-fns/getDay";
import getMonth from "date-fns/getMonth";
import getYear from "date-fns/getYear";
import parse from "date-fns/parse";
import format from "date-fns/format";

import AddIcon from '@mui/icons-material/Add';

function ExpensesTab() {
  const { expenses, isLoading } = useSelector(state => state.expenses);
  const { categories, isLoading: isCategoriesLoading } = useSelector(state => state.categories);
  const config = useWebsiteConfig();
  const dispatch = useDispatch();
  const theme = useTheme();

  const barData = useMemo(() => {
    const today = new Date();
    return _range(-7, 1)
      .map(day => addDays(today, day))
      .map(date => {
        const year = getYear(date);
        const month = getMonth(date) + 1;
        const dateToMatch = getDay(date);
        const monthExpenses = expenses?.[year]?.[month] || [];
        return {
          date,
          dayOfWeek: format(date, "EEE"),
          value: monthExpenses
            .filter(item => getDay(parse(item.date, DEFAULT_DATE_FORMAT, today)) === dateToMatch)
            .map(item => item.amount)
            .reduce((a, b) => a + b, 0)
        }
      });
  }, [expenses])
  const pieData = useMemo(() => {
    const today = new Date(); 
    const year = getYear(today);
    const month = getMonth(today) + 1;
    const monthExpenses = expenses?.[year]?.[month] || [];
    return (categories || [])
      .map(category => ({
        category: category.label,
        amount: monthExpenses
          .filter(item => item.category === category.value)
          .map(item => item.amount)
          .reduce((a, b) => a + b, 0)
      }))
      .filter(item => item.amount > 0)
  }, [expenses, categories])
  const pieColors = useMemo(() => {
    return [
      theme.palette.primary.main,
      theme.palette.secondary.main,
      theme.palette.error.main,
      theme.palette.success.main,
      theme.palette.warning.main,
    ]
  }, [theme])
  const recentExpenses = useMemo(() => {
    const today = new Date(); 
    const year = getYear(today);
    const month = getMonth(today) + 1;
    const monthExpenses = (expenses?.[year]?.[month] || []).slice(); 
    monthExpenses.sort((a, b) => parse(a.date, DEFAULT_DATE_FORMAT, today) - parse(b.date, DEFAULT_DATE_FORMAT, today));
    return monthExpenses.slice(0, 3);
  }, [expenses])

  const categoriesMap = useMemo(() => {
    return (categories || []).reduce((acc, category) => {
      acc[category.value] = category;
      return acc;
    }, {});
  }, [categories])

  return expenses && categories && !isLoading && !isCategoriesLoading
  ? <Box style={{ 
      maxHeight: '100%', 
      overflow: 'auto',
      flex: 1,
      padding: "2rem",
    }}>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Card sx={{ bgcolor: "primary.light", position: "relative" }}>
            <div style={{ position: "absolute", 
              top: "40%", 
              left: ".2rem", 
              right: ".2rem", 
              bottom: 0,
            }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <Bar dataKey="value" fill={theme.palette.primary.contrastText}>
                    {barData.map((entry, index) => (
                      <Cell
                        style={{
                          opacity: index === 6
                            ? .8
                            : index % 2 === 0 ? .6 : .4,
                        }} key={`cell-${index}`} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <CardContent style={{ height: 150 }} sx={{ color: "primary.contrastText" }}>
              <Typography sx={{ color: 'primary.contrastText' }} variant="subtitle1">Spent this week</Typography>
              <div>
                <Typography variant="body2" component="span">$</Typography>
                <Typography variant="h6" component="span">{_round(barData?.map(item => item.value).reduce((a, b) => a + b, 0), 2)}</Typography>
              </div>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie 
                data={pieData}
                dataKey="amount"
                label={item => item.category}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader subheader="Recent" />
            <CardContent>
              <List>
                {recentExpenses.map(item => <ListItemButton key={item.rowIndex}>
                  <ListItemIcon>
                    {categoriesMap[item.category] && <img src={categoriesMap[item.category].icon} />}
                  </ListItemIcon>
                  <ListItemText primary={`$ ${item.amount}`} secondary={item.description} />
                </ListItemButton>)}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  : <LoadingScreen />
}

export default ExpensesTab