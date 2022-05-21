import { useCallback, useMemo } from "react";

import {
  Stack,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import { 
  DateTimePicker
} from '@mui/x-date-pickers/DateTimePicker';

import { TimePicker } from '@mui/x-date-pickers/TimePicker';

import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';

import { useForm, Controller } from "react-hook-form";
import LoadingScreen from "../../components/LoadingScreen";
import { useSelector, useDispatch } from "react-redux";
import { FormProvider, FTextField, FSelect } from "../../components/form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import format from "date-fns/format";
import { DEFAULT_DATE_FORMAT } from "../../app/config";
import getMonth from "date-fns/getMonth";
import getYear from "date-fns/getYear";
import parse from "date-fns/parse";

const ExpenseSchema = Yup.object().shape({
  date: Yup.date().required(),
  time: Yup.string(),
  category: Yup.string().required(),
  description: Yup.string(),
  amount: Yup.number().required(),
  receipt: Yup.string(),
});

function NewExpenseDialog({ open, onClose }) {
  const { categories, isLoading } = useSelector(state => state.categories);

  const currentDate = useMemo(() => new Date(), []);
  const defaultValues = {
    date: format(currentDate, DEFAULT_DATE_FORMAT),
    category: "other",
    amount: 0,
  }
  const methods = useForm({
    resolver: yupResolver(ExpenseSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    setError,
    control,
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmit = useCallback(async (data) => {
    const parsedDate = parse(data.date, DEFAULT_DATE_FORMAT, currentDate);
    const expense = {
      ...defaultValues,
      month: getMonth(parsedDate) + 1,
      year: getYear(parsedDate),
      ...data,
    }
    onClose(expense)
    reset();
  }, []);

  const categoriesMap = useMemo(() => {
    return categories.reduce((acc, category) => {
      acc[category.value] = category;
      return acc;
    }, {});
  }, [categories])

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add New Expense</DialogTitle>
      <DialogContent>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2} direction="column">
            <Controller
              name="date"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <DesktopDatePicker
                  label="Date"
                  {...field}
                  renderInput={(params) => <TextField {...params} />}
                />
              )}
            />

            <Controller
              name="time"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TimePicker
                  label="Time"
                  {...field}
                  renderInput={(params) => <TextField {...params} />}
                />
              )}
            />

            <FSelect
              required
              name="category"
              label="Category"
              variant="filled"
            >
              {categories && categories.map(category => 
                <MenuItem key={category.value} value={category.value}>
                  {/* <ListItemIcon>
                    {categoriesMap[category.value] && <img src={categoriesMap[category.value].icon} />}
                  </ListItemIcon> */}
                  <ListItemText>{category.label}</ListItemText>
                </MenuItem>)}
            </FSelect>

            <FTextField 
              required
              name="description" 
              label="Description"
              variant="filled"
            />

            <FTextField
              type="number"
              name="amount"
              label="Amount"
              variant="filled"
            />

            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={isSubmitting || isLoading}
            >
              Add Expense
            </Button>

            <Button
              variant="contained"
              color="secondary"
              onClick={onClose}
              disabled={isSubmitting || isLoading}
            >
              Close
            </Button>
          </Stack>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}

export default NewExpenseDialog;