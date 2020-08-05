import React, { useState, useEffect, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { makeStyles } from '@material-ui/core/styles';
import AuthContext from '../../contexts/AuthContext';

import { Card, CardHeader, CardContent, CardActions } from '@material-ui/core';
import { TextField, Button } from '@material-ui/core';

import Notification from '../../components/Notification';

const useStyles = makeStyles(theme => ({
	card: {
		margin: '15px',
		width: '100%',
		maxWidth: '350px',
	},
	spacer: { flexGrow: 1 },
	input: {
		marginBottom: 15,
	},
}));

function Ground() {
	const classes = useStyles();
	const {auth} = useContext(AuthContext);

	const [notificationState, setNotificationState] = useState({ open: false, message: '', variant: 'info' });
	const closeNotification = () => {
		setNotificationState({ ...notificationState, open: false });
	};

	const {
		register,
		handleSubmit,
		getValues,
		errors,
		formState: { isValid, isDirty },
		reset,
		trigger,
	} = useForm({
		mode: 'onChange',
	});

	useEffect(() => {
		if (process.env.NODE_ENV === 'production') {
			fetch('/api/ground', {
				headers: { 'auth-jwt': auth.token },
			})
				.then(res => res.json())
				.then(data => {
					reset(data);
					trigger();
				})
				.catch(e => {
					console.error(e);
				});
		} else {
			setTimeout(() => {
				reset({ longitude: -80, latitude: 36, elevation: 0.25 });
				trigger();
			}, 500);
		}
	}, [auth.token, reset, trigger]);

	const onSubmit = data => {
		const newGround = {
			longitude: parseFloat(data.longitude),
			latitude: parseFloat(data.latitude),
			elevation: parseFloat(data.elevation),
		};
		fetch('/api/ground', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', 'auth-jwt': auth.token },
			body: JSON.stringify(newGround),
		}).then(res => {
			if (res.status > 199 && res.status < 300) {
				reset(newGround);
				trigger();
				setNotificationState({
					open: true,
					message: 'Updated ground position',
					variant: 'success',
				});
			} else {
				reset();
				trigger();
				setNotificationState({
					open: true,
					message: 'Failed to update ground position',
					variant: 'error',
				});
			}
		});
	};

	return (
		<Card className={classes.card}>
			<CardHeader title="Ground Position" />
			<form onSubmit={handleSubmit(onSubmit)}>
				<CardContent>
					<TextField
						fullWidth
						className={classes.input}
						type="number"
						inputProps={{ step: 'any' }}
						InputLabelProps={{ shrink: Boolean(getValues('longitude')) }}
						helperText={errors.longitude ? 'Longitude must be a number from -180 to 180' : ''}
						inputRef={register({ required: true, min: -180, max: 180 })}
						error={Boolean(errors.longitude)}
						name="longitude"
						label="Longitude"
					/>
					<TextField
						fullWidth
						className={classes.input}
						type="number"
						inputProps={{ step: 'any' }}
						InputLabelProps={{ shrink: Boolean(getValues('latitude')) }}
						helperText={errors.latitude ? 'Latitude must be a number from -90 to 90' : ''}
						inputRef={register({ required: true, min: -90, max: 90 })}
						error={Boolean(errors.latitude)}
						name="latitude"
						label="Latitude"
					/>
					<TextField
						fullWidth
						className={classes.input}
						type="number"
						inputProps={{ step: 'any' }}
						InputLabelProps={{ shrink: Boolean(getValues('elevation')) }}
						helperText={errors.elevation ? 'Elevation must be a number' : ''}
						inputRef={register({ required: true })}
						error={Boolean(errors.elevation)}
						name="elevation"
						label="Elevation in kilometers"
					/>
				</CardContent>
				<CardActions>
					<span className={classes.spacer} />
					<Button variant="contained" color="primary" type="submit" disabled={!isDirty || !isValid}>
						Save
					</Button>
				</CardActions>
			</form>
			<Notification
				open={notificationState.open}
				variant={notificationState.variant}
				message={notificationState.message}
				onClose={closeNotification}
			/>
		</Card>
	);
}

export default Ground;
