import Splash from './Splash';
import Satellites from './Satellites';

const pages = [
	{
		linkName: 'Home',
		path: '/',
		exact: true,
		component: Splash
	},
	{
		linkName: 'Satellites',
		path: '/satellites',
		component: Satellites
	}
];

export default pages;