
import DraftsIcon from '@mui/icons-material/Drafts';


import Box from '@mui/material/Box';

export function EmptyScreen() {
  return (
    <Box>
      <div style={{ color: "gray", textAlign: "center", marginTop: "1rem" }}>
        <DraftsIcon />
        <div>No items</div>
      </div>
    </Box>
  )
}

export default EmptyScreen