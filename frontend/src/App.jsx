import React from 'react';
import { HashRouter, Switch, Route } from 'react-router-dom';

import Shell from './components/Shell';
import pages from './pages';

function App() {
	return (
		<HashRouter>
			<Shell pages={pages}>
				<Switch>
					{pages.map(page => (
						<Route exact={page.exact} path={page.path}>
							<page.component />
						</Route>
					))}
				</Switch>
			</Shell>
		</HashRouter>
	);
}

export default App;
