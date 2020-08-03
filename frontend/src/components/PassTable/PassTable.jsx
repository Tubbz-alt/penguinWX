import React, { useState, useEffect } from 'react';

import {
	Paper,
	TableContainer,
	Table,
	TableHead,
	TableBody,
	TableRow,
	TableCell,
	TableFooter,
	TablePagination,
	Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const secondsToDuration = _seconds => {
	const totalSeconds = Math.round(_seconds);
	const min = Math.floor(totalSeconds / 60);
	const sec = totalSeconds - min * 60;

	return min + ':' + (sec < 10 ? '0' : '') + sec;
};

const useStyles = makeStyles(theme => ({
	centerPadded: {
		display: 'flex',
		width: '100%',
		margin: '10px 0px',
		justifyContent: 'center',
		textAlign: 'center',
	},
}));

function PassTable(props) {
	const { rows } = props;
	const classes = useStyles();

	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(rows.length < 25 ? rows.length : 10);
	//const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

	useEffect(() => {
		setPage(0);
		setRowsPerPage(rows.length < 25 ? rows.length : 10);
	}, [rows]);

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = event => {
		setRowsPerPage(parseInt(event.target.value, rows.length < 25 ? rows.length : 10));
		setPage(0);
	};

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
					{rows &&
						rows.length > 0 &&
						(rowsPerPage > 0 ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : rows).map(
							row => (
								<TableRow key={row.start}>
									<TableCell component="th" scope="row">
										{row.satellite}
									</TableCell>
									<TableCell align="right">{row.start.toLocaleString()}</TableCell>
									<TableCell align="right">{secondsToDuration(row.duration / 1000)}</TableCell>
									<TableCell align="right">{row.size.toLocaleString() + ' kB'}</TableCell>
									<TableCell align="right">{row.status}</TableCell>
								</TableRow>
							)
						)}
				</TableBody>
				{(rows && rows.length > 0) && (
					<TableFooter>
						<TableRow>
							<TablePagination
								rowsPerPageOptions={[5, 10, 25, { label: 'All', value: rows.length }]}
								count={rows.length}
								rowsPerPage={rowsPerPage}
								page={page}
								SelectProps={{
									inputProps: { 'aria-label': 'rows per page' },
									//native: true,
								}}
								onChangePage={handleChangePage}
								onChangeRowsPerPage={handleChangeRowsPerPage}
							/>
						</TableRow>
					</TableFooter>
				)}
			</Table>
			{(!rows || rows.length < 1) && (
				<Typography className={classes.centerPadded}>No Passes Available</Typography>
			)}
		</TableContainer>
	);
}

export default PassTable;
