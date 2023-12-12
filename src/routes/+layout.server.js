import fs from 'fs';

export async function load() {
	let hrefs = ['./src/routes'];

	for (let i = 0; i < 5; i++) {
		hrefs = hrefs.flatMap((path) => {
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

	hrefs = hrefs
		.flatMap((r) => {
			let l = r.lastIndexOf('/');
			return r.slice('./src/routes'.length, l) ?? '';
		})
		.filter((r) => r.length > 0);

	hrefs = Array.from(new Set(hrefs));

	let max_depth = 0;
	// /** @typedef {{depth: number; type: string; href: string; name: string;}} Route */
	// /** @type {Route[]} */
	let routes = hrefs.map((route) => {
		let route_path = route.split('/');
		let route_end = route_path.at(-1) ?? '';
		let route_depth = route_path.length - 1;
		max_depth = Math.max(max_depth, route_depth);

		return {
			depth: route_depth,
			type: hrefs.some((r) => r.includes(route) && r !== route) ? 'folder' : 'file',
			href: route,
			name: route_end
				.split('_')
				.map((r) => {
					if (r.length == 0) return r;
					return r[0].toUpperCase() + r.slice(1);
				})
				.join(' '),
		};
	});

	// /** @type {Object<string, Route | any>} */
	// let groups = {};
	// /** @param {string[]} path @param {Route} route */
	// function insert(path, route) {
	// 	let g = groups;
	// 	for (let i = 0; i < path.length; i++) {
	// 		if (g[path[i]] == null) g[path[i]] = route;
	// 		g = g[path[i]];
	// 	}
	// }
	// for (let i = 0; i < routes.length - 1; i++) {
	// 	let path = routes[i].href.split('/').slice(1);
	// 	insert(path, routes[i]);
	// }

	return { routes, max_depth };
}
