import React, { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { makeStyles } from '@material-ui/core/styles';
import AuthContext from '../contexts/AuthContext';

import { Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import { FormControl, InputLabel, Input, InputAdornment, IconButton, FormHelperText, Button } from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
	spacer: {
		flexGrow: 1,
	},
	input: {
		marginBottom: '15px',
	},
}));

function LoginDialog(props) {
	const classes = useStyles();
	const { onClose, open } = props;
	const {auth, updateAllAuth, setToken} = useContext(AuthContext);

	const [showPassword, setShowPassword] = useState(false);

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
		fetch('/api/session', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', 'auth-jwt': auth.token },
			body: JSON.stringify(data),
		}).then(res => {
			if (res.status > 199 && res.status < 300) {
				res.json().then(newToken => {
					setToken(newToken);
					updateAllAuth();
					handleClose();
				});
			}
		});
	};

	const handleClose = () => {
		reset();
		setShowPassword(false);
		onClose();
	};

	const handleClickShowPassword = () => {
		setShowPassword(!showPassword);
	};

	const handleMouseDownPassword = event => {
		event.preventDefault();
	};

	return (
		<Dialog onClose={onClose} open={open} fullWidth maxWidth="xs">
			<DialogTitle>Login</DialogTitle>
			<form onSubmit={handleSubmit(onSubmit)}>
				<DialogContent>
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
				</DialogContent>
				<DialogActions>
					<span className={classes.spacer} />
					<Button variant="contained" onClick={handleClose}>
						Cancel
					</Button>
					<Button variant="contained" color="primary" type="submit" disabled={!isDirty || !isValid}>
						Login
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	);
}

export default LoginDialog;
