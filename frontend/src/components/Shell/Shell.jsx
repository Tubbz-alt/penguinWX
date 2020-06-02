import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import { CssBaseline, Hidden } from '@material-ui/core';

import { AppBar, Toolbar, Typography, IconButton } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

import { Drawer, List, ListItem, ListItemText } from '@material-ui/core';

const drawerWidth = 175;

const useStyles = makeStyles(theme => ({
	root: {
		display: 'flex'
	},

	menuButton: {
		marginRight: theme.spacing(0.5),
		[theme.breakpoints.up('sm')]: {
			display: 'none',
		},
	},
	appBar: {
		zIndex: theme.zIndex.drawer + 1,
	},

	drawer: {
		width: drawerWidth,
		flexShrink: 0,
	},
	drawerPaper: {
		width: drawerWidth,
	},
	toolbar: theme.mixins.toolbar,

	content: {
		flexGrow: 1,
		padding: theme.spacing(3),
	},
}));

function Shell(props) {
	const classes = useStyles();
	const { pages } = props;

	const history = useHistory();
	const { pathname } = useLocation();
	
	const [mobileOpen, setMobileOpen] = React.useState(false);
	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen);
	};

	const drawerList = (
		<List>
			{pages.map(page => (
				<ListItem
					button
					key={page.linkName}
					selected={page.path === pathname}
					onClick={() => history.push(page.path)}
				>
					<ListItemText primary={page.linkName} />
				</ListItem>
			))}
		</List>
	);

	return (
		<div className={classes.root}>
			<CssBaseline />
			{/* top app bar */}
			<AppBar position="fixed" className={classes.appBar}>
				<Toolbar>
					{/* menu button - hides on desktop */}
					<IconButton
						edge="start"
						color="inherit"
						aria-label="menu"
						className={classes.menuButton}
						onClick={handleDrawerToggle}
					>
						<MenuIcon />
					</IconButton>
					<Typography variant="h6" noWrap>
						PenguinWX
					</Typography>
				</Toolbar>
			</AppBar>
			{/* mobile drawer - has open/close handlers */}
			<Hidden smUp implementation="css">
				<Drawer
					variant="temporary"
					anchor="left"
					open={mobileOpen}
					onClose={handleDrawerToggle}
					classes={{
						paper: classes.drawerPaper,
					}}
					ModalProps={{
						keepMounted: true, // Better open performance on mobile.
					}}
				>
					{drawerList}
				</Drawer>
			</Hidden>
			{/* desktop drawer - permanent */}
			<Hidden xsDown implementation="css">
				<Drawer
					className={classes.drawer}
					classes={{
						paper: classes.drawerPaper,
					}}
					variant="permanent"
				>
					<div className={classes.toolbar} />
					{drawerList}
				</Drawer>
			</Hidden>
			{/* main content */}
			<div className={classes.content}>
				<div className={classes.toolbar} />
				{props.children}
			</div>
		</div>
	);
}

export default Shell;