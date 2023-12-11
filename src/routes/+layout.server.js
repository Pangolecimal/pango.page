import fs from 'fs';

export async function load() {
	let routes = ['./src/routes'];

	for (let i = 0; i < 5; i++) {
		routes = routes.flatMap((path) => {
			let result;
			try {
				result = fs.readdirSync(path);
			} catch {
				return path;
			}
			if (result.length == 0) return path;
			return result.flatMap((p) => path + '/' + p);
		});
	}

	routes = routes
		.flatMap((r) => {
			let l = r.lastIndexOf('/');
			return r.slice('./src/routes'.length, l) ?? '';
		})
		.filter((r) => r.length > 0);

	routes = Array.from(new Set(routes));

	return {
		routes,
	};
}
