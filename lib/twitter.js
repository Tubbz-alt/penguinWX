const Twit = require('twit');
const fs = require('fs');

/* https://www.makeuseof.com/tag/photo-tweeting-twitter-bot-raspberry-pi-nodejs/ */

module.exports = (config, pass, images) => {
	const T = new Twit(config.twitter);

	let mediaIds = [];
	let uploadCounter = 0;
	
	const date = new Date(pass.start);
	const dateParts = date.toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: '2-digit', hour: 'numeric', minute: 'numeric', timeZoneName: 'short'}).split(', ');
	const dateString = dateParts[0] + ', ' + dateParts[1] + '\n' + dateParts[2];

	const statusString = pass.sat.name + '\n' + dateString;

	console.log('\n\n' + statusString + '\n\n');

	images.forEach((item) => {
		const b64content = fs.readFileSync(item, { encoding: 'base64' });
		console.log('Uploading an image...');
		T.post('media/upload', { media_data: b64content }, (err, data, response) => {
			if (err) {
				console.log('ERROR:');
				console.log(err);
			} else {
				console.log('Image uploaded!');
				media_ids.push(data.media_id_string);
				uploadCounter = uploadCounter + 1;
				if (uploadCounter === mediaIds.length) {
					T.post('statuses/update', { status: statusString, media_ids: mediaIds }, (err, data, response) => {
						if (err) {
							console.log('ERROR:');
							console.log(err);
						} else {
							console.log('Tweeted images!');
						};
					});
				};
			};
		});
	});
};