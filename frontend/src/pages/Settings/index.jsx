import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Ground from './Ground';

const useStyles = makeStyles(theme => ({
	root: {
		display: 'flex',
		flexWrap: 'wrap',
		padding: '1rem',
		justifyContent: 'center',
	},
}));

function Settings() {
	const classes = useStyles();

	return (
		<div className={classes.root}>
			<Ground />
		</div>
	);
}

export default Settings;
