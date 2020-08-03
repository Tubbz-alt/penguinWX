import React, { useEffect, useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { Card, CardHeader, CardContent } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
	card: {
		margin: '15px',
		width: '100%',
		maxWidth: '350px',
	},
}));

function Auth() {
	const classes = useStyles();

	const [password, setPassword] = useState('');

	return (
		<Card className={classes.card}>
			<CardHeader title="Authentication" />
			<CardContent></CardContent>
		</Card>
	);
}

export default Ground;
