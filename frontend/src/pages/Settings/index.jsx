import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Auth from './Auth';
import Ground from './Ground';
import Passes from './Passes';

const useStyles = makeStyles(theme => ({
	root: {
		display: 'flex',
		flexWrap: 'wrap',
		alignItems: 'flex-start',
		padding: '1rem',
		justifyContent: 'center',
	},
}));

function Settings() {
	const classes = useStyles();

	return (
		<div className={classes.root}>
			<Auth />
			<Ground />
			<Passes />
		</div>
	);
}

export default Settings;
