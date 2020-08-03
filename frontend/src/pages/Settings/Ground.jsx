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

function Ground() {
	const classes = useStyles();

	const [ground, setGround] = useState({});

	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		if (process.env.NODE_ENV === 'production') {
			fetch('/')
				.then(res => res.json())
				.then(data => {
					setLoaded(true);
				})
				.catch(e => {
					console.error(e);
					setLoaded(true);
				});
		} else {
			setTimeout(() => {
				setGround({
					longitude: -80,
					latitude: 36,
					elevation: 0.25,
				});
				setLoaded(true);
			}, 500);
		}
	}, []);

	return (
		<Card className={classes.card}>
			<CardHeader title="Ground Position" />
			<CardContent></CardContent>
		</Card>
	);
}

export default Ground;
