import React, { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { makeStyles } from '@material-ui/core/styles';
import AuthContext from '../../contexts/AuthContext';

import { Card, CardHeader, CardContent, CardActions } from '@material-ui/core';
import { FormControl, InputLabel, Input, InputAdornment, IconButton, FormHelperText, Button } from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';

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

function AuthComponent() {
	const classes = useStyles();
	const { auth, updateAllAuth, setToken } = useContext(AuthContext);

	const [showPassword, setShowPassword] = useState(false);

	const [notificationState, setNotificationState] = useState({ open: false, message: '', variant: 'info' });
	const closeNotification = () => {
		setNotificationState({ ...notificationState, open: false });
	};

	const {
		register,
		handleSubmit,
		errors,
		formState: { isValid, isDirty },
		reset,
	} = useForm({
		mode: 'onChange',
	});

	const onSubmit = data => {
		fetch('/api/password', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', 'auth-jwt': auth.token },
			body: JSON.stringify(data),
		}).then(res => {
			if (res.status > 199 && res.status < 300) {
				res.json().then(newToken => {
					setToken(newToken);
					updateAllAuth();
					reset({ password: '' });
				});
				setNotificationState({
					open: true,
					message: 'Set new password',
					variant: 'success',
				});
			} else {
				setNotificationState({
					open: true,
					message: 'Failed to set new password',
					variant: 'error',
				});
			}
		});
	};

	const handleClickShowPassword = () => {
		setShowPassword(!showPassword);
	};

	const handleMouseDownPassword = event => {
		event.preventDefault();
	};

	return (
		<Card className={classes.card}>
			<CardHeader title="Authentication" />
			<form onSubmit={handleSubmit(onSubmit)}>
				<CardContent>
					<FormControl fullWidth className={classes.input} error={Boolean(errors.password)}>
						<InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
						<Input
							id="standard-adornment-password"
							type={showPassword ? 'text' : 'password'}
							inputRef={register({ required: true, minLength: 1 })}
							name="password"
							endAdornment={
								<InputAdornment position="end">
									<IconButton onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword}>
										{showPassword ? <Visibility /> : <VisibilityOff />}
									</IconButton>
								</InputAdornment>
							}
						/>
						{errors.password && <FormHelperText>Password is required!</FormHelperText>}
					</FormControl>
				</CardContent>
				<CardActions>
					<span className={classes.spacer} />
					<Button
						variant="contained"
						color="secondary"
						disabled={!auth.requiresAuth}
						onClick={() => {
							localStorage.removeItem('token');
							window.location.reload();
						}}
					>
						Logout
					</Button>
					<Button variant="contained" color="primary" type="submit" disabled={!isDirty || !isValid}>
						Set Password
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

export default AuthComponent;
