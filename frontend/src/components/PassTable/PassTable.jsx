import React from 'react';

import { Paper, TableContainer, Table, TableHead, TableBody, TableRow, TableCell } from '@material-ui/core';

const secondsToDuration = _seconds => {
	const totalSeconds = Math.round(_seconds);
	const min = Math.floor(totalSeconds / 60);
	const sec = totalSeconds - (min * 60);

	return min + ':' + (sec < 10 ? '0' : '') + sec;
};

function PassTable(props) {
	const { rows } = props;

	return (
		<TableContainer component={Paper}>
			<Table aria-label="simple table">
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
					{rows && rows.map((row) => (
						<TableRow key={row.date}>
							<TableCell component="th" scope="row">
								{row.satellite}
							</TableCell>
							<TableCell align="right">{row.date.toLocaleString()}</TableCell>
							<TableCell align="right">{secondsToDuration(row.duration)}</TableCell>
							<TableCell align="right">{row.size.toLocaleString() + ' kB'}</TableCell>
							<TableCell align="right">{row.status}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
}

export default PassTable;