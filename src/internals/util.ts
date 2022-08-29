const randomDate = (): Date => {
	const start = new Date();
	const end = new Date(2100, 0, 1);
	return new Date(start.getTime() + (Math.random() * (end.getTime() - start.getTime())));
};


export { randomDate };
