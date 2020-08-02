import React, { useEffect, useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { CardHeader, CardContent } from '@material-ui/core';

import TimeCard from '../../components/TimeCard';
import CountdownCard from '../../components/CountdownCard';
import PassTable from '../../components/PassTable';

const useStyles = makeStyles(theme => ({
	passCard: {
		margin: '0px 10px 25px'
	},
	timeCardsWrapper: {
		display: 'flex',
		flexWrap: 'wrap',
	}
}));

function Splash() {
	const [ passes, setPasses ] = useState([]);
	const classes = useStyles();

	useEffect(() => {
		if (process.env.NODE_ENV === 'production') {
			fetch('/api/passes')
			.then(res => res.json())
			.then((data) => {
				setPasses(
					data
					.map(row => ({
						...row,
						start: new Date(row.start),
						end: new Date(row.end)
					}))
				);
			})
			.catch(console.error);
		}
	}, []);

	let nextPass;
	if (passes.filter(p => p.status === 'scheduled').sort((a, b) => a.start - b.start).length > 0) {
		nextPass = passes.filter(p => p.status === 'scheduled').sort((a, b) => a.start - b.start)[0];
	}

	return (
		<div>
			<div className={classes.timeCardsWrapper}>
				<TimeCard />
				{nextPass &&
					<CountdownCard title="Time Until Next Pass" endDate={nextPass.start} />
				}
			</div>
			<div className={classes.passCard}>
				<CardHeader title="Upcoming Passes" />
				<CardContent>
					<PassTable rows={passes.filter(p => p.status === 'scheduled').sort((a, b) => a.start - b.start)} />
				</CardContent>
			</div>
			<div className={classes.passCard}>
				<CardHeader title="Previous Passes" />
				<CardContent>
					<PassTable rows={passes.filter(p => p.status !== 'scheduled').sort((a, b) => b.start - a.start)} />
				</CardContent>
			</div>
		</div>
	);
}

export default Splash;