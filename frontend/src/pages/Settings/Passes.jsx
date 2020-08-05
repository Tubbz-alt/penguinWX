import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AuthContext from '../../contexts/AuthContext';

import { Card, CardHeader, CardContent } from '@material-ui/core';
import { Button } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
	card: {
		margin: '15px',
		width: '100%',
		maxWidth: '350px',
	},
	spacer: { flexGrow: 1 },
	button: {
		width: '100%',
		marginBottom: 15
	},
}));

function Passes() {
	const classes = useStyles();
	const { auth } = useContext(AuthContext);

	return (
		<Card className={classes.card}>
			<CardHeader title="Pass Actions" />
			<CardContent>
				<Button
					className={classes.button}
					variant="contained"
					color="primary"
					onClick={() => {
						fetch('/api/passes/action', {
							method: 'PUT',
							headers: { 'Content-Type': 'application/json', 'auth-jwt': auth.token },
							body: JSON.stringify({ action: 'schedule_new' }),
						});
					}}
				>
					Schedule New Passes
				</Button>
				<Button
					className={classes.button}
					variant="contained"
					color="secondary"
					onClick={() => {
						fetch('/api/passes/action', {
							method: 'PUT',
							headers: { 'Content-Type': 'application/json', 'auth-jwt': auth.token },
							body: JSON.stringify({ action: 'delete_scheduled' }),
						});
					}}
				>
					Clear Scheduled Passes
				</Button>
			</CardContent>
		</Card>
	);
}

export default Passes;
