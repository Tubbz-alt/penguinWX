import React, { useState } from 'react';
import usePreciseTimer from '../hooks/usePreciseTimer';

import { makeStyles } from '@material-ui/core/styles';
import { Card, CardHeader, CardContent, Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
	card: {
		margin: '0px 10px 25px',
		minWidth: '275px',
		maxWidth: '400px',
		flex: 1
	},
	cardContent: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	}
}));

const msToDuration = _ms => {
	const _seconds = _ms / 1000;
	const totalSeconds = Math.round(_seconds);
	const hour = Math.floor(totalSeconds / (60 * 60));
	const min = Math.floor((totalSeconds - (hour * 60 * 60)) / 60);
	const sec = totalSeconds - (hour * 60 * 60) - (min * 60);

	return (hour < 10 ? '0' : '') + hour + (min < 10 ? ':0' : ':') + min + (sec < 10 ? ':0' : ':') + sec;
};

function CountdownCard(props) {
	const {title, endDate} = props;

	const [ currentDate, setDate ] = useState(new Date());
	usePreciseTimer(() => setDate(new Date()), 1000, endDate && endDate > currentDate);

	const classes = useStyles();

	return (
		<Card className={classes.card}>
			<CardHeader title={title ? title : 'Time Remaining'} />
			<CardContent className={classes.cardContent}>
				<Typography variant="h5">{endDate && endDate > currentDate ? msToDuration(endDate.getTime() - currentDate.getTime()) : '00:00:00'}</Typography>
			</CardContent>
		</Card>
	);
}

export default CountdownCard;