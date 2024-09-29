import { Box, Typography } from '@mui/material';
import TasksList from './TasksList';

const Home = async () => {
    return (
        <Box>
            <Typography variant="body1">Home</Typography>

            <TasksList />
        </Box>
    );
};

export default Home;
