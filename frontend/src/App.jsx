import React, { useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';

import { AppBar, Toolbar, Typography } from '@material-ui/core';
import { Tabs, Tab, Box } from '@material-ui/core';

import pages from './pages';

const useStyles = makeStyles(theme => ({
	root: {
		display: 'flex',
		flexWrap: 'wrap',
	},

	toolbar: theme.mixins.toolbar,

	content: {
		flexGrow: 1,
		padding: theme.spacing(3),
	},
}));

function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`tabpanel-${index}`}
			aria-labelledby={`tab-${index}`}
			{...other}
		>
			{value === index && <Box p={3}>{children}</Box>}
		</div>
	);
}

function App() {
	const classes = useStyles();
	const [currentPage, setCurrentPage] = useState(0);

	const handleTabChange = (event, i) => setCurrentPage(i);

	return (
		<div className={classes.root}>
			<CssBaseline />
			{/* top app bar */}
			<AppBar position="fixed" className={classes.appBar}>
				<Toolbar>
					<Typography variant="h6" noWrap>
						PenguinWX
					</Typography>
				</Toolbar>
			</AppBar>
			<div style={{ width: '100%' }}>
				<div className={classes.toolbar} />
				<AppBar position="static" color="default">
					<Tabs value={currentPage} onChange={handleTabChange} indicatorColor="primary" textColor="primary">
						{pages.map(page => (
							<Tab key={page.name} label={page.name} />
						))}
					</Tabs>
				</AppBar>
				{/* main content */}
				<div className={classes.content}>
					{pages.map((page, i) => (
						<TabPanel key={page.name} value={currentPage} index={i}>
							{page.component}
						</TabPanel>
					))}
				</div>
			</div>
		</div>
	);
}

export default App;
