const { spawn } = require('child_process');

	let normalize = spawn ('sox', [path + name + '.pregain.wav', pass + name + '.wav', 'gain', '-n']);
	let wxtoimg;
	let wxmap;
	normalize.on('exit', () => {
		wxtoimg = spawn('wxtoimg', [path + name + '.wav', path + name + '.png']);
	});
}