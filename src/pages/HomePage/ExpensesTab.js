import {
  Stack,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Typography,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  ListItemButton,
  ListItemIcon,
  Fab,
  Box,
} from "@mui/material";
import { useEffect, useMemo, Fragment, useState, useCallback, } from "react";
import { useSelector, useDispatch } from "react-redux";
import LoadingScreen from "../../components/LoadingScreen";
import { useWebsiteConfig } from "../../hooks/useWebsiteConfig";
import { getAllExpenses, addNewExpense } from "../../features/expenses/expensesSlice";
import EmptyScreen from "../../components/EmptyScreen"
import _range from "lodash/range";
import addMonths from "date-fns/addMonths";
import getMonth from "date-fns/getMonth";
import getYear from "date-fns/getYear";
import _format from "date-fns/format";

import AddIcon from '@mui/icons-material/Add';
import NewExpenseDialog from './NewExpenseDialog';

function ExpensesTab() {
  const { expenses, isLoading } = useSelector(state => state.expenses);
  const { categories } = useSelector(state => state.categories);
  const [dialogOpen, setDialogOpen] = useState(false);
  const dispatch = useDispatch();
  const config = useWebsiteConfig();

  const dates = useMemo(() => {
    const currentDate = new Date();
    return _range(0, config?.monthsToLoad - 1, -1)
      .map(month => addMonths(currentDate, month))
      .map(date => ({ month: getMonth(date) + 1, year: getYear(date) }));
  }, [config]);

  const handleDialogClose = useCallback((value) => {
    setDialogOpen(false);
    if (value) {
      dispatch(addNewExpense(value));
    }
  }, []);

  const categoriesMap = useMemo(() => {
    return categories.reduce((acc, category) => {
      acc[category.value] = category;
      return acc;
    }, {});
  }, [categories])

  return expenses && !isLoading
  ? <Box style={{ 
      maxHeight: '100%', 
      overflow: 'auto',
      flex: 1,
    }}>
      <NewExpenseDialog open={dialogOpen} onClose={handleDialogClose} />
      <List
        sx={{
          width: '100%',
          maxHeight: '100%',
          overflow: 'auto',
          bgcolor: 'background.paper',
          position: 'relative',
          '& ul': { padding: 0 },
        }}
        subheader={<li />}
      >
        {dates.map(({month, year}) => {
            const monthExpenses = expenses[year]?.[month];
            return <li key={`section-${month}-${year}`}>
              <ul>
                <ListSubheader>{_format(new Date(year, month - 1, 1), "LLLL yyy")}</ListSubheader>
                {monthExpenses && monthExpenses.map(expense => (
                  <ListItemButton key={`item-${expense.rowIndex}`}>
                    <ListItemIcon>
                      {categoriesMap[expense.category] && <img src={categoriesMap[expense.category].icon} />}
                    </ListItemIcon>
                    <ListItemText 
                      primary={`$ ${expense.amount}`}
                      secondary={expense.description}
                    />
                  </ListItemButton>
                ))}
              </ul>
            </li>
          })
        }
      </List>
      <Fab
        onClick={() => setDialogOpen(true)}
        color="primary" 
        aria-label="add"
        style={{ 
          position: 'absolute', 
          bottom: "2rem",
          right: "2rem",
        }}
      >
        <AddIcon />
      </Fab>
    </Box>
  : <LoadingScreen />
}

export default ExpensesTab