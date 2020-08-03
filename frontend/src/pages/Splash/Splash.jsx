import React, { useEffect, useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { CardHeader, CardContent } from '@material-ui/core';

import TimeCard from '../../components/TimeCard';
import CountdownCard from '../../components/CountdownCard';
import PassTable from '../../components/PassTable';

const useStyles = makeStyles(theme => ({
	passCard: {
		margin: '0px 10px 25px',
	},
	timeCardsWrapper: {
		display: 'flex',
		flexWrap: 'wrap',
	},
}));

function Splash() {
	const classes = useStyles();
	const [passes, setPasses] = useState([]);
	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		if (process.env.NODE_ENV === 'production') {
			fetch('/api/passes')
				.then(res => res.json())
				.then(data => {
					setPasses(
						data.map(row => ({
							...row,
							start: new Date(row.start),
							end: new Date(row.end),
						}))
					);
					setLoaded(true);
				})
				.catch(e => {
					console.error(e);
					setLoaded(true);
				});
		} else {
			setTimeout(() => {
				setPasses(
					JSON.parse(
						'[{"pass_id":"NOAA 18_886902","satellite":"NOAA 18","start":"2020-08-03T03:04:31.770Z","duration":971582,"end":"2020-08-03T03:20:43.352Z","max_elevation":26.932972979912062,"size":0,"status":"completed"},{"pass_id":"NOAA 19_886917","satellite":"NOAA 19","start":"2020-08-03T10:34:31.791Z","duration":850742,"end":"2020-08-03T10:48:42.533Z","max_elevation":21.104435936292568,"size":0,"status":"canceled"},{"pass_id":"NOAA 19_886920","satellite":"NOAA 19","start":"2020-08-03T12:14:43.887Z","duration":1022511,"end":"2020-08-03T12:31:46.398Z","max_elevation":44.52673248461256,"size":0,"status":"canceled"},{"pass_id":"NOAA 15_886921","satellite":"NOAA 15","start":"2020-08-03T12:56:10.179Z","duration":600561,"end":"2020-08-03T13:06:10.740Z","max_elevation":84.51189582905512,"size":0,"status":"canceled"},{"pass_id":"METEOR-M 2_886922","satellite":"METEOR-M 2","start":"2020-08-03T13:06:40.740Z","duration":592420,"end":"2020-08-03T13:16:33.161Z","max_elevation":40.8276326841808,"size":0,"status":"canceled"},{"pass_id":"METEOR-M 2_886925","satellite":"METEOR-M 2","start":"2020-08-03T14:42:07.888Z","duration":817573,"end":"2020-08-03T14:55:45.461Z","max_elevation":22.265522736725416,"size":0,"status":"scheduled"},{"pass_id":"NOAA 18_886926","satellite":"NOAA 18","start":"2020-08-03T15:28:32.265Z","duration":919659,"end":"2020-08-03T15:43:51.924Z","max_elevation":51.3905049059237,"size":0,"status":"scheduled"},{"pass_id":"NOAA 19_886939","satellite":"NOAA 19","start":"2020-08-03T21:57:59.830Z","duration":900249,"end":"2020-08-03T22:13:00.079Z","max_elevation":30.824575781229548,"size":0,"status":"scheduled"},{"pass_id":"NOAA 19_886943","satellite":"NOAA 19","start":"2020-08-03T23:38:47.862Z","duration":890009,"end":"2020-08-03T23:53:37.871Z","max_elevation":29.290788835800885,"size":0,"status":"scheduled"},{"pass_id":"NOAA 15_886944","satellite":"NOAA 15","start":"2020-08-04T00:13:20.974Z","duration":679214,"end":"2020-08-04T00:24:40.188Z","max_elevation":70.40067079286749,"size":0,"status":"scheduled"},{"pass_id":"METEOR-M 2_886944","satellite":"METEOR-M 2","start":"2020-08-04T00:25:10.189Z","duration":676025,"end":"2020-08-04T00:36:26.214Z","max_elevation":51.68780896801796,"size":0,"status":"scheduled"},{"pass_id":"NOAA 18_886946","satellite":"NOAA 18","start":"2020-08-04T01:12:02.177Z","duration":973797,"end":"2020-08-04T01:28:15.974Z","max_elevation":25.979623609615846,"size":0,"status":"scheduled"},{"pass_id":"NOAA 18_886949","satellite":"NOAA 18","start":"2020-08-04T02:52:23.177Z","duration":904599,"end":"2020-08-04T03:07:27.776Z","max_elevation":34.72072116119738,"size":0,"status":"scheduled"},{"pass_id":"NOAA 19_886968","satellite":"NOAA 19","start":"2020-08-04T12:02:55.044Z","duration":938374,"end":"2020-08-04T12:18:33.418Z","max_elevation":57.81509178948457,"size":0,"status":"scheduled"},{"pass_id":"NOAA 15_886969","satellite":"NOAA 15","start":"2020-08-04T12:31:07.589Z","duration":727294,"end":"2020-08-04T12:43:14.883Z","max_elevation":54.48373459776299,"size":0,"status":"scheduled"},{"pass_id":"METEOR-M 2_886969","satellite":"METEOR-M 2","start":"2020-08-04T12:43:44.883Z","duration":843773,"end":"2020-08-04T12:57:48.655Z","max_elevation":25.99208644140838,"size":0,"status":"scheduled"}]'
					).map(row => ({
						...row,
						start: new Date(row.start),
						end: new Date(row.end),
					}))
				);
				setLoaded(true);
			}, 500);
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
				{(!loaded || nextPass) && (
					<CountdownCard
						loading={!loaded}
						title="Time Until Next Pass"
						endDate={nextPass ? nextPass.start : new Date()}
					/>
				)}
			</div>
			<div className={classes.passCard}>
				<CardHeader title="Upcoming Passes" />
				<CardContent>
					<PassTable
						loading={!loaded}
						rows={passes.filter(p => p.status === 'scheduled').sort((a, b) => a.start - b.start)}
					/>
				</CardContent>
			</div>
			<div className={classes.passCard}>
				<CardHeader title="Previous Passes" />
				<CardContent>
					<PassTable
						loading={!loaded}
						rows={passes.filter(p => p.status !== 'scheduled').sort((a, b) => b.start - a.start)}
					/>
				</CardContent>
			</div>
		</div>
	);
}

export default Splash;
