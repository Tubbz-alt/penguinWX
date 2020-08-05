import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { Snackbar, SnackbarContent, IconButton } from '@material-ui/core';
import { amber, green } from '@material-ui/core/colors';

import CloseIcon from '@material-ui/icons/Close';
import InfoIcon from '@material-ui/icons/Info';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import WarningIcon from '@material-ui/icons/Warning';
import ErrorIcon from '@material-ui/icons/Error';

const variantIcon = {
	success: CheckCircleIcon,
	warning: WarningIcon,
	error: ErrorIcon,
	info: InfoIcon,
};

const useStyles = makeStyles(theme => ({
	success: {
		backgroundColor: green[600],
	},
	error: {
		backgroundColor: theme.palette.error.dark,
	},
	info: {
		backgroundColor: theme.palette.primary.main,
	},
	warning: {
		backgroundColor: amber[700],
	},
	icon: {
		fontSize: 20,
	},
	variantIcon: {
		fontSize: 20,
		opacity: 0.9,
		marginRight: theme.spacing(1),
	},
	message: {
		display: 'flex',
		alignItems: 'center',
	},
}));

function Notification(props) {
	const classes = useStyles();
	const { open, onClose, variant, message } = props;
	const Icon = variantIcon[variant];

	const handleClose = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}
		onClose();
	};

	return (
		<Snackbar
			anchorOrigin={{
				vertical: 'top',
				horizontal: 'right',
			}}
			open={open}
			autoHideDuration={6000}
			onClose={handleClose}
		>
			<SnackbarContent
				className={classes[variant]}
				aria-describedby="client-snackbar"
				message={
					<span className={classes.message}>
						<Icon className={classes.variantIcon} />
						{message}
					</span>
				}
				action={[
					<IconButton key="close" aria-label="close" color="inherit" onClick={onClose}>
						<CloseIcon className={classes.icon} />
					</IconButton>,
				]}
			/>
		</Snackbar>
	);
}

export default Notification;
