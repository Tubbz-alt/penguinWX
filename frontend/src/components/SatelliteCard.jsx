import React, { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AuthContext from '../contexts/AuthContext';

import { Card, CardHeader, CardContent } from '@material-ui/core';
import { TableContainer, Table, TableBody, TableRow, TableCell } from '@material-ui/core';
import { Switch } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
	card: {
		width: '100%',
	},
	disabledText: {
		color: 'rgba(0, 0, 0, 0.4)',
	},
}));

function SatelliteCard(props) {
	const { satellite } = props;
	const classes = useStyles();

	const [loading, setLoading] = useState(false);
	const [enabled, setEnabled] = useState(satellite.enabled);
	const {auth} = useContext(AuthContext);

	useEffect(() => {
		setEnabled(satellite.enabled);
	}, [satellite]);

	const toggleEnabled = event => {
		const newVal = event.target.checked;
		setLoading(true);
		fetch('/api/satellite/' + satellite.satellite, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', 'auth-jwt': auth.token },
			body: JSON.stringify({ ...satellite, enabled: newVal }),
		}).then(res => {
			setLoading(false);
			if (res.status > 199 && res.status < 300) setEnabled(newVal);
		});
	};

	const tableData = [
		{
			key: 'Frequency',
			value: satellite.frequency / 1000 / 1000 + ' MHz',
		},
		{
			key: 'Sample Rate',
			value: satellite.sample_rate / 1000 + ' KHz',
		},
		{
			key: 'Gain',
			value: satellite.gain + ' dB',
		},
		{
			key: 'Type',
			value: satellite.decode_method.toUpperCase(),
		},
		{
			key: 'Min Elevation',
			value: satellite.min_elevation + '°',
		},
	];

	if (!satellite) return <React.Fragment />;

	return (
		<Card className={classes.card}>
			<CardHeader
				action={
					!auth.requiresAuth || auth.token ? (
						<Switch disabled={loading} checked={enabled} onChange={toggleEnabled} />
					) : (
						''
					)
				}
				title={satellite.satellite}
			/>
			<CardContent>
				<TableContainer>
					<Table>
						<TableBody>
							{tableData.map(row => (
								<TableRow key={row.key}>
									<TableCell
										className={!enabled ? classes.disabledText : ''}
										component="th"
										scope="row"
									>
										{row.key}
									</TableCell>
									<TableCell className={!enabled ? classes.disabledText : ''} align="right">
										{row.value}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</CardContent>
		</Card>
	);
}

export default SatelliteCard;
