import { Box } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom'

const Main = () => {
    return (
        <header className="header">
            <Box className="container" m={2}>
                <Link to="/lk">
                    <Button variant="contained" color="primary">
                        Личный кабинет
                    </Button>
                </Link>
            </Box>
        </header>
    )
}

export default Main