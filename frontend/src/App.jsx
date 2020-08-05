import React, { useState } from 'react';
import useOnMount from './hooks/useOnMount';

import { makeStyles } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';

import { AppBar, Toolbar, Typography, Button } from '@material-ui/core';
import { Tabs, Tab, Box } from '@material-ui/core';

import AuthContext from './contexts/AuthContext';
import LoginDialog from './components/LoginDialog';
import pages from './pages';

const useStyles = makeStyles(theme => ({
	root: {
		display: 'flex',
		flexWrap: 'wrap',
	},
	spacer: {
		flexGrow: 1,
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

	// page handlers
	const [currentPage, setCurrentPage] = useState(0);
	const handleTabChange = (event, i) => setCurrentPage(i);

	// login window state
	const [login, setLogin] = useState(false);

	// define auth state
	const [auth, setAuth] = useState({ token: null, requiresAuth: true });

	const updateAllAuth = () => {
		fetch('/api/session')
			.then(res => res.json())
			.then(data => {
				setAuth({ token: localStorage.getItem('token'), requiresAuth: data });
			})
			.catch(e => {
				console.error(e);
			});
	}

	// store a new auth token
	const setToken = (token) => {
		localStorage.setItem('token', token);
		setAuth({ ...auth, token: token });
	};
	// load an auth token from storage
	const loadToken = () => setAuth({ ...auth, token: localStorage.getItem('token') });

	// build our authentication context object
	const authContextValue = {
		auth,
		setAuth,
		updateAllAuth,
		setToken,
		loadToken
	};

	// on component mount setup our auth context
	useOnMount(() => {
		if (process.env.NODE_ENV === 'production') {
			updateAllAuth();
		} else {
			setAuth({ token: '', requiresAuth: false });
		}
	});

	return (
		<AuthContext.Provider value={authContextValue}>
			<div className={classes.root}>
				<CssBaseline />
				<LoginDialog open={login} onClose={() => setLogin(false)} />
				{/* top app bar */}
				<AppBar position="fixed" className={classes.appBar}>
					<Toolbar>
						<Typography variant="h6" noWrap>
							PenguinWX
						</Typography>
						<span className={classes.spacer} />
						{(process.env.NODE_ENV === 'production' ? auth.requiresAuth && !auth.token : true) && (
							<Button style={{ color: 'white' }} onClick={() => setLogin(true)}>
								Login
							</Button>
						)}
					</Toolbar>
				</AppBar>
				<div style={{ width: '100%' }}>
					<div className={classes.toolbar} />
					<AppBar position="static" color="default">
						<Tabs
							value={currentPage}
							onChange={handleTabChange}
							indicatorColor="primary"
							textColor="primary"
						>
							{pages.map(
								page =>
									(page.authed ? !auth.requiresAuth || auth.token : true) && (
										<Tab key={page.name} label={page.name} />
									)
							)}
						</Tabs>
					</AppBar>
					{/* main content */}
					<div className={classes.content}>
						{pages.map(
							(page, i) =>
								(page.authed ? !auth.requiresAuth || auth.token : true) && (
									<TabPanel key={page.name} value={currentPage} index={i}>
										{page.component}
									</TabPanel>
								)
						)}
					</div>
				</div>
			</div>
		</AuthContext.Provider>
	);
}

export default App;
