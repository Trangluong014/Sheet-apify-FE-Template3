import { useState } from "react";
import {
  Tabs,
  Tab,
  Typography,
  Box,
} from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import GroupIcon from '@mui/icons-material/Group';
import HistoryIcon from '@mui/icons-material/History';

import ExpensesTab from "./ExpensesTab";
import SummaryTab from "./SummaryTab";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      style={{ display: 'flex', flexDirection: 'column' }}
      {...other}
    >
      {value === index && children}
    </div>
  );
}

function HomePage() {
  const [tab, setTab] = useState(0);

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  const tabStyle = {
    overflow: 'hidden',
    flex: '1 1 auto',
    display: 'flex',
  }

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        flexDirection: 'column',
        maxHeight: '100%',
        overflow: 'hidden',
        flex: 1,
        display: 'flex',
    }}>
      <Tabs
        value={tab}
        onChange={handleChange}
        centered
        style={{ flex: '0 1 72px', minHeight: 72, }}
      >
        <Tab icon={<MeetingRoomIcon />} label="Summary" />
        <Tab icon={<AddIcon />} label="Expenses" />
      </Tabs>
      <TabPanel value={tab} index={0} style={tabStyle}>
        <SummaryTab />
      </TabPanel>
      <TabPanel value={tab} index={1} style={tabStyle}>
        <ExpensesTab />
      </TabPanel>
    </Box>
  )
}

export default HomePage;