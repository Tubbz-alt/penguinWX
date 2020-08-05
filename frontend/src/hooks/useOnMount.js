import { useState } from 'react';

export const useOnMount = fn => {
	const [hasRun, setHasRun] = useState(false);
	if (!hasRun) {
		setHasRun(true);
		fn();
	}

	return hasRun;
};

export default useOnMount;