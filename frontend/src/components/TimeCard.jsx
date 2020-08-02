import React, { useState } from 'react';
import usePreciseTimer from '../hooks/usePreciseTimer';

import { makeStyles } from '@material-ui/core/styles';
import { Card, CardHeader, CardContent, Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
	card: {
		margin: '0px 10px 25px',
		minWidth: '325px',
		maxWidth: '400px',
		flex: 1
	},
	cardContent: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	}
}));

function TimeCard(props) {
	const {title, time} = props;

	const [ currentDate, setDate ] = useState(new Date());
	usePreciseTimer(() => setDate(new Date()), 1000, !time);

	const classes = useStyles();

	return (
		<Card className={classes.card}>
			<CardHeader title={title ? title : 'Current Time'} />
			<CardContent className={classes.cardContent}>
				<Typography variant="h5">{time ? time.toLocaleString() : currentDate.toLocaleString()}</Typography>
			</CardContent>
		</Card>
	);
}

export default TimeCard;