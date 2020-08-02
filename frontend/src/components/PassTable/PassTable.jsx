import React, { useEffect, useState } from 'react';

import { Paper, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const secondsToDuration = _seconds => {
	const totalSeconds = Math.round(_seconds);
	const min = Math.floor(totalSeconds / 60);
	const sec = totalSeconds - (min * 60);

	return min + ':' + (sec < 10 ? '0' : '') + sec;
};

const useStyles = makeStyles(theme => ({
	centerPadded: {
		display: 'flex',
		width: '100%',
		margin: '10px 0px',
		justifyContent: 'center',
		textAlign: 'center'
	}
}));

function PassTable(props) {
	const { rows } = props;
	const classes = useStyles();

	return (
		<TableContainer component={Paper}>
			<Table aria-label="passes table">
				<TableHead>
					<TableRow>
						<TableCell>Satellite</TableCell>
						<TableCell align="right">Date</TableCell>
						<TableCell align="right">Duration</TableCell>
						<TableCell align="right">Size</TableCell>
						<TableCell align="right">Status</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{(rows && rows.length > 0) &&
						rows.map((row) => (
							<TableRow key={row.start}>
								<TableCell component="th" scope="row">
									{row.satellite}
								</TableCell>
								<TableCell align="right">{row.start.toLocaleString()}</TableCell>
								<TableCell align="right">{secondsToDuration(row.duration / 1000)}</TableCell>
								<TableCell align="right">{row.size.toLocaleString() + ' kB'}</TableCell>
								<TableCell align="right">{row.status}</TableCell>
							</TableRow>
						))
					}
				</TableBody>
			</Table>
			{(!rows || rows.length < 1) && <Typography className={classes.centerPadded}>No Passes Available</Typography>}
		</TableContainer>
	);
}

export default PassTable;