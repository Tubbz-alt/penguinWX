const db = require('./database').db;
const https = require('https');

module.exports.updateTLEs = () => new Promise((resolve, reject) => {
	https.get('https://www.celestrak.com/NORAD/elements/weather.txt', res => {
		let data = '';

		res.on('data', chunk => {
			data += chunk;
		});

		res.on('end', () => {
			const lines = data.replace(/\r/g, '').split('\n').filter(l => l);
			let items = [];
			for (let i = 0; i < lines.length; i = i + 3) {
				items.push({
					satellite: lines[i],
					line_1: lines[i+1],
					line_2: lines[i+2]
				});
			}
			
			const sqlVals = items.map(item => [item.satellite,item.line_1,item.line_2]).flat();
			const sqlPlaceholders = items.map(() => '(?,?,?)').join(',');
			
			db.run(`\
				INSERT or REPLACE INTO tle (satellite, line_1, line_2)\
				VALUES ${sqlPlaceholders}\
			`, sqlVals, e => {
				if (e) {
					console.error('ERROR INSERTing tle into `tle` table: ', e);
					reject(e);
				} else {
					resolve();
				}
			});
		});
	}).on("error", e => {
		console.error("ERROR getting TLE data: ", e);
		reject(e);
	});
});