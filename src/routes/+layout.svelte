<script>
	import { onMount } from 'svelte';

	/** @type {import('./$types').LayoutData} */
	export let data;

	let max_depth = 0;
	/** @typedef {{depth: number; type: string; href: string; name: string;}} Route */
	/** @type {Route[]} */
	let routes = data.routes.map((route) => {
		let route_path = route.split('/');
		let route_end = route_path.at(-1) ?? '';
		let route_depth = route_path.length - 1;
		max_depth = Math.max(max_depth, route_depth);

		return {
			depth: route_depth,
			type: data.routes.some((r) => r.includes(route) && r !== route) ? 'folder' : 'file',
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
	// console.log(routes);

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

	let /** @type {HTMLElement} */ header;
	let /** @type {HTMLElement} */ open;
	let /** @type {HTMLElement} */ close;
	function close_header() {
		header.dataset.active = 'false';
		open.dataset.active = 'true';
	}
	function open_header() {
		header.dataset.active = 'true';
		open.dataset.active = 'false';
	}

	let ft = ``;
	for (let i = 0; i < routes.length; i++) {
		let { depth: cd, href, name } = routes[i]; // [C]urrent [D]epth
		let pd = routes[i - 1]?.depth ?? 0; // [P]revios [D]epth
		let nd = routes[i + 1]?.depth ?? 0; // [N]ext [D]epth

		let a = `<details class="ft-item expandable" id="ft-${href}"><summary class="ft-title">
					<i class="fa-solid fa-chevron-right"></i><a class="ft-title" href="${href}">${name}</a></summary>\n`;
		let b = `\t<div class="ft-item"><i class="fa-solid fa-file-lines fa-sm"></i><a class="ft-title" href="${href}">${name}</a></div>\n`;
		let c = `</details>\n`;

		if (cd < nd && pd > cd) ft += c;
		if (cd < nd) ft += a;
		if (cd === nd) ft += b;
		if (cd > nd) ft += b + c;
	}

	onMount(() => {
		Array.from(document.querySelectorAll('summary > a')).forEach((a) => {
			a.addEventListener('click', (e) => {
				// @ts-ignore
				e.target.parentNode.click();
			});
		});
	});
</script>

<div id="wrapper">
	<header data-active={true} bind:this={header}>
		<h2>Page Tree</h2>
		<nav id="filetree">
			<details class="ft-item expandable" id="ft-/">
				<summary class="ft-title"><i class="fa-solid fa-chevron-right" /><a href="/">Home</a></summary>
				{@html ft}
			</details>
		</nav>

		<div id="settings">
			<a class="clear" href="https://github.com/Pangolecimal/pango.page" target="_blank" rel="noreferrer noopener"
				><i class="fa-brands fa-github" />
			</a>
			<a class="clear" href="https://vk.com/rehuba" target="_blank" rel="noreferrer noopener">
				<i class="fa-brands fa-vk" />
			</a>
			<button id="settings-close" data-active="true" on:click={close_header} bind:this={close}>
				<i class="fa-solid fa-square-chevron-left" />
			</button>
		</div>
	</header>

	<main>
		<button id="settings-open" on:click={open_header} data-active="false" bind:this={open}>
			<i class="fa-solid fa-square-chevron-right" />
		</button>
		<slot />
	</main>
</div>

<style>
	:global(*) {
		box-sizing: border-box;
		margin: 0;
		font-family: monospace;
	}
	:global(html, body) {
		height: 100%;
		background: var(--ctp-mocha-base);
		color: var(--ctp-mocha-text);
		font-size: 1rem;
	}
	:global(a) {
		text-decoration: none;
		color: var(--ctp-mocha-peach);
		font-weight: bold;

		overflow: hidden;
		white-space: nowrap;
		text-overflow: clip;
		text-wrap: nowrap;
		-webkit-user-drag: none;

		&:hover {
			text-decoration: underline;
			color: var(--ctp-mocha-pink);
		}
		&:active {
			text-decoration: underline;
			color: var(--ctp-mocha-mauve);
		}
	}
	:global(a.clear) {
		text-decoration: none;
		color: var(--ctp-mocha-text);
		font-weight: bold;

		overflow: visible;
		white-space: nowrap;
		text-overflow: clip;
		text-wrap: nowrap;
		-webkit-user-drag: none;

		&:hover {
			text-decoration: underline;
			/* color: var(--ctp-mocha-text); */
		}
		&:active {
			text-decoration: underline;
			/* color: var(--ctp-mocha-subtext1); */
		}
	}
	:global(button) {
		border: none;
		transition: filter 100ms;
		background: inherit;
		color: inherit;
		&:hover {
			filter: brightness(115%);
		}
		&:active {
			filter: brightness(75%);
		}
	}
	:global(.unselectable) {
		-webkit-touch-callout: none;
		-webkit-user-select: none;
		-khtml-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}
	:global(.invisible) {
		display: none;
	}

	:global([data-active='true']) {
		opacity: 100%;
		visibility: visible;
	}
	:global([data-active='false']) {
		opacity: 0;
		visibility: hidden;
	}

	/* for cross browser compatibility */
	:global(details::-webkit-details-marker) {
		display: none;
	}
	:global(summary) {
		display: block;
		cursor: pointer;
		outline: none;
	}

	/*  */

	:root {
		--trans-time: 250ms;
	}
	#wrapper {
		display: grid;
		grid-template-columns: auto 1fr;
		height: 100%;
		position: relative;
		transition: var(--trans-time);
	}
	main {
		position: relative;
		transition: var(--trans-time);
		overflow: auto;
	}
	header {
		display: grid;
		grid-template-rows: auto 1fr;

		width: 24rem;
		height: 100dvh;

		font-size: 1.25rem;
		padding: 1rem;
		padding-bottom: 6rem;
		background: var(--ctp-mocha-mantle);
		overflow-x: hidden;

		white-space: nowrap;

		transition: var(--trans-time);
	}
	:global(header[data-active='false']) {
		width: 0;
		padding-left: 0;
		padding-right: 0;
	}

	#filetree {
		height: fit-content;
		padding-left: 2rem;
		position: relative;
	}

	:global(summary::-webkit-details-marker) {
		display: none;
	}
	:global(details > *:not(summary)) {
		padding-left: 1.5rem;
	}

	:global(summary) {
		transition: var(--trans-time);
	}
	:global(details > summary) {
		position: relative;
		transition: var(--trans-time);
	}
	:global(details > summary > i) {
		position: absolute;
		left: -1.5rem;
		transition: var(--trans-time);
	}
	:global(details[open] > summary > i) {
		rotate: 90deg;
	}

	:global(details) {
		position: relative;
	}
	:global(details[open]::before) {
		content: '';

		position: absolute;
		translate: -1.15rem 0;
		bottom: 0.1rem;

		width: 0.1rem;
		height: calc(100% - 2rem);
		background: var(--ctp-mocha-text);
	}

	:global(details[open] > div.ft-item) {
		position: relative;
	}
	:global(details[open] > div.ft-item > i) {
		position: absolute;
		left: 0;
		top: 1rem;
	}
	:global(div.ft-item, summary) {
		padding-top: 0.25rem;
		padding-bottom: 0.25rem;
	}

	#settings {
		display: grid;
		grid-auto-flow: column;
		align-items: center;
		justify-content: space-evenly;
		align-self: end;

		position: fixed;
		left: 0;
		bottom: 0;
		width: 24rem;

		padding: 1rem;
		font-size: 2rem;
		background: var(--ctp-mocha-crust);
	}
	#settings-close {
		display: grid;
		place-items: center;
		position: absolute;
		right: 0;
		width: fit-content;
		height: fit-content;

		border-radius: 1rem 0 0 1rem;
		padding: 0.5rem;
		padding-left: 0.75rem;
		background: var(--ctp-mocha-mantle);
		color: var(--ctp-mocha-text);

		font-size: 2rem;
		transition: var(--trans-time);
	}
	#settings-open {
		display: grid;
		place-items: center;
		position: fixed;
		left: 0;
		bottom: 0.75rem;
		width: fit-content;
		height: fit-content;

		border-radius: 0 1rem 1rem 0;
		font-size: 2rem;
		padding: 0.5rem;
		padding-right: 0.75rem;
		background: var(--ctp-mocha-mantle);
		color: var(--ctp-mocha-text);

		transition: var(--trans-time);
	}

	/*  */

	@media only screen and (orientation: portrait) {
		#wrapper {
			grid-auto-flow: column;
			grid-template-columns: 1fr;
			grid-template-rows: 1fr 0;
		}

		header {
			padding-bottom: 0;
			padding-top: 5rem;
			width: 100%;
		}
		:global(header[data-active='false']) {
			height: 0;
			padding: 0 1rem;
		}
		:global(#wrapper:has(header[data-active='false'])) {
			grid-template-rows: 0 1fr;
		}
		:global(#wrapper:has(header[data-active='true']) main) {
			opacity: 0;
			visibility: hidden;
		}

		#settings {
			width: 100%;
			top: 0;
			bottom: auto;
		}
		#settings-close {
			right: 0.75rem;
			top: 0;
			rotate: 90deg;
			border-radius: 0 1rem 1rem 0;
			padding-left: 0.5rem;
			padding-right: 0.75rem;
		}
		#settings-open {
			top: 0;
			right: 0.75rem;
			left: auto;
			rotate: 90deg;
		}
	}
</style>
