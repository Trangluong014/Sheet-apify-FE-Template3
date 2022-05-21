import { BrowserRouter } from "react-router-dom";
import Router from "./routes";

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </LocalizationProvider>
  );
}

export default App;
