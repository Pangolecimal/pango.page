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

	/** @param {any | any[]} any */
	function copy(any) {
		return JSON.parse(JSON.stringify(any));
	}

	/** @type {any[]} */
	let sorted = JSON.parse(JSON.stringify(routes));

	/** @param {any[]} values @param {number} depth */
	function foo(values, depth) {
		if (depth > max_depth || values.length === 0 || !values.some((v) => v.depth === depth)) {
			return values;
		}

		let t = [[], copy(values)];

		let offset = 0;
		for (let i = 0; i < values.length; i++) {
			if ((values[i].depth === depth || (i === 0 && values[i].depth < depth)) && values[i].type === 'file') {
				let el = t[1].splice(i - offset, 1);
				t[0].push(...el);
				offset += 1;
			}
		}

		t.push([]);
		for (let i = 0; i < t[1].length; i++) {
			if (t[1][i].depth === depth && t[1][i].type === 'folder') {
				t.push([]);
			}
			t[t.length - 1].push(t[1][i]);
		}

		t.splice(1, 1);

		for (let i = 1; i < t.length; i++) {
			t[i] = foo(t[i], depth + 1);
		}

		return t.reduceRight((acc, cur) => acc.concat(cur));
	}
	sorted = foo(sorted, 1);

	return { routes: sorted, max_depth };
}
