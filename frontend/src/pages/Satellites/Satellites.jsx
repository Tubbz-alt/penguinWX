import React, { useState, useEffect } from 'react';

import { makeStyles } from '@material-ui/core/styles';

import SatelliteCard from '../../components/SatelliteCard';

const useStyles = makeStyles(theme => ({
	root: {
		display: 'flex',
		flexWrap: 'wrap',
		padding: '1rem',
		justifyContent: 'center',
	},

	cardContainer: {
		margin: '15px',
		width: '100%',
		maxWidth: '350px',
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
	},
}));

function Satellites() {
	const classes = useStyles();
	const [satellites, setSatellites] = useState([]);

	useEffect(() => {
		if (process.env.NODE_ENV === 'production') {
			fetch('/api/satellites')
				.then(res => res.json())
				.then(data => {
					setSatellites(data.sort((a, b) => (a.satellite > b.satellite ? 1 : -1)));
				})
				.catch(e => {
					console.error(e);
				});
		} else {
			setSatellites(
				JSON.parse(
					'[{"satellite":"NOAA 18","frequency":137912500,"sample_rate":55000,"gain":40,"decode_method":"noaa","min_elevation":19,"enabled":true},{"satellite":"NOAA 15","frequency":137620000,"sample_rate":55000,"gain":40,"decode_method":"noaa","min_elevation":19,"enabled":true},{"satellite":"NOAA 19","frequency":137100000,"sample_rate":55000,"gain":40,"decode_method":"noaa","min_elevation":19,"enabled":true},{"satellite":"METEOR-M 2","frequency":137100000,"sample_rate":150000,"gain":50,"decode_method":"meteor","min_elevation":19,"enabled":true}]'
				).sort((a, b) => (a.satellite > b.satellite ? 1 : -1))
			);
		}
	}, []);

	return (
		<div className={classes.root}>
			{satellites.map(satellite => (
				<div key={satellite.satellite} className={classes.cardContainer}>
					<SatelliteCard satellite={satellite} />
				</div>
			))}
		</div>
	);
}

export default Satellites;
