import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import { Card, CardHeader, CardContent } from '@material-ui/core';
import { IconButton } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';

const useStyles = makeStyles(theme => ({
	card: {
		width: '100%',
	}
}));

function SatelliteCard() {
	const classes = useStyles();

	return (
		<Card className={classes.card}>
			<CardHeader
				action={
					<IconButton aria-label="settings">
						<MoreVertIcon />
					</IconButton>
				}
				title="NOAA 15"
			/>
			<CardContent>
				Hello World
			</CardContent>
		</Card>
	);
}

export default SatelliteCard;