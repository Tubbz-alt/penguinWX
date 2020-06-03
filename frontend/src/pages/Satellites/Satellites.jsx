import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import { Card, CardActionArea } from '@material-ui/core';
import AddCircleOutlineRoundedIcon from '@material-ui/icons/AddCircleOutlineRounded';

import SatelliteCard from '../../components/SatelliteCard';

const useStyles = makeStyles(theme => ({
	root: {
		display: 'flex',
		flexWrap: 'wrap',
		padding: '1rem',
		justifyContent: 'center'
	},

	cardContainer: {
		margin: '15px',
		width: '100%',
		maxWidth: '400px',
	},

	addCard: {
		margin: '15px',
		maxWidth: '150px',
		minHeight: '150px',
		width: '100%',
		height: '100%',
	},
	addCardContent: {
		width: '100%',
		height: '150px',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
	addIconContainer: {
		paddingBottom: '7px',
	}
}));

function Satellites() {
	const classes = useStyles();

	return (
		<div className={classes.root}>
			
			<div className={classes.cardContainer}>
				<SatelliteCard />
			</div>

			<Card className={classes.addCard}>
				<CardActionArea>
					<div className={classes.addCardContent}>
						<div className={classes.addIconContainer}>
							<AddCircleOutlineRoundedIcon fontSize={'large'} />
						</div>
					</div>
				</CardActionArea>
			</Card>
		</div>
	);
}

export default Satellites;