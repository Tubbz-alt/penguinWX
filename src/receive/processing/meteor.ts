import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import * as path from 'path';

import * as classes from '../../classes';

import twitter from '../twitter';

// initialize the image file list
let imagefiles: string[] = [];

const postProcessing = (config: classes.config, pass: classes.pass, passPath: string, passName: string) => {
	if (pass.satellite.tweet) {
		twitter(config, pass, imagefiles);
	};
};

export default (config: classes.config, pass: classes.pass, passPath: string, passName: string) => {
	console.log('Processing NOAA satellite...');

	// demodulate the QPSK modulated signal to a sample file
	let demod = spawn('meteor_demod', ['-o', path.resolve(passPath, passName + '.s'), '-m', pass.satellite.modulation, '-B', path.resolve(passPath, passName + '.raw.wav')]);
	demod.stdout.on('data', (data) => {
		console.log(data.toString());
	});
	demod.stderr.on('data', (data) => {
		console.log(data.toString());
	});

	// after demodulating
	demod.on('exit', () => {
		// decode the sample file (output composite, write stat file, and manually specify APIDs)
		// if the diffdecode flag is set we add the `-d` option, if it's false there's a blank element
		// the filter after the options array removes this blank element
		let decode = spawn('meteor_decode', ['-o', path.resolve(passPath, passName + '.png'), '-q', '-s', '-a', pass.satellite.apid, pass.satellite.diffdecode ? '-d' : '', path.resolve(passPath, passName + '.s')].filter((el) => {return el !== ''}));
		decode.stdout.on('data', (data) => {
			console.log(data.toString());
		});
		decode.stderr.on('data', (data) => {
			console.log(data.toString());
		});

		// after decoding
		decode.on('exit', () => {
			// rectify the image
			let rectify = spawn('rectify.py', [path.resolve(passPath, passName + '.png')]);
			rectify.stdout.on('data', (data) => {
				console.log(data.toString());
			});
			rectify.stderr.on('data', (data) => {
				console.log(data.toString());
			});

			// after rectifying
			rectify.on('exit', () => {
				let rotate: ChildProcessWithoutNullStreams;
				// only rotate if we had a northbound pass
				if (pass.northbound) {
					// rotate image 180 (mogrify will overwrite original file)
					rotate = spawn('mogrify', ['-rotate', '180', path.resolve(passPath, passName + '-rectified.png')]);
					rotate.stdout.on('data', (data) => {
						console.log(data.toString());
					});
					rotate.stderr.on('data', (data) => {
						console.log(data.toString());
					});
				} else {
					// dummy command so we can still use the exit event even if we aren't rotating
					rotate = spawn('node', ['-v']);
				};

				// after rotating if necessary
				rotate.on('exit', () => {
					// compress to a jpeg for web useage - also scale to height of 8192 if greater than 8192 (max twitter image resolution)
					let websize = spawn('ffmpeg', ['-i', path.resolve(passPath, passName + '-rectified.png'), '-q:v', '1', '-filter_complex', ' scale=w=-2:h=min(8192\\,ih)', path.resolve(passPath, passName + '-rectified-websize.jpg')]);
					websize.stdout.on('data', (data) => {
						console.log(data.toString());
					});
					websize.stderr.on('data', (data) => {
						console.log(data.toString());
					});

					// after websize
					websize.on('exit', () => {
						// add processed image to image list
						imagefiles.push(path.resolve(passPath, passName + '-rectified-websize.jpg'));

						postProcessing(config, pass, passPath, passName);
					});
				});
			});
		});
	});
};