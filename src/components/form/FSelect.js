import { useFormContext, Controller } from "react-hook-form";
import { Select, FormControl, InputLabel } from "@mui/material";

function FSelect({ name, label, children, controlProps={}, labelProps={}, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormControl {...controlProps}>
          <InputLabel {...field} {...labelProps}>{label}</InputLabel>
          <Select
            {...field}
            select
            error={!!error}
            helperText={error?.message}
            {...other}
          >
            {children}
          </Select>
        </FormControl>
      )}
    />
  );
}

export default FSelect;
