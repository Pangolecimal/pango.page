<script>
	import { onMount } from 'svelte';
	console.clear();

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
	console.log('routes:', JSON.parse(JSON.stringify(routes)));

	/** @type {Object<string, Route | any>} */
	let groups = {};
	/** @param {string[]} path @param {Route} route */
	function insert(path, route) {
		let g = groups;
		for (let i = 0; i < path.length; i++) {
			if (g[path[i]] == null) g[path[i]] = route;
			g = g[path[i]];
		}
	}
	for (let i = 0; i < routes.length - 1; i++) {
		let path = routes[i].href.split('/').slice(1);
		insert(path, routes[i]);
	}
	console.log('groups:', JSON.parse(JSON.stringify(groups)));

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

		let a = `<details class="ft-item expandable" id="ft-${href}"><summary class="ft-title"><a class="ft-title" href="${href}">${name}</a></summary>\n`;
		let b = `\t<div class="ft-item"><a class="ft-title" href="${href}">${name}</a></div>\n`;
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
		<nav id="filetree">
			<details class="ft-item expandable" id="ft-/">
				<summary class="ft-title"><a href="/">Home</a></summary>
				{@html ft}
			</details>

			<!-- Structure: -->
			<!--<details class="ft-item expandable invisible">
					<summary class="ft-title">Name</summary>
					<div class="ft-item">
						<a class="ft-title" href="/">Name 1</a>
						<a class="ft-title" href="/">Name 2</a>
					</div>
				</details> -->
		</nav>

		<div id="settings">
			<i class="fa-solid fa-cog" />
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
	@import '$lib/fontawesome/css/all.css';
	@import '$lib/colors-catppuccin.css';
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
		--trans-time: 500ms;
	}
	#wrapper {
		display: grid;
		grid-template-columns: auto 1fr;
		height: 100%;
		position: relative;
	}
	main {
		position: relative;
	}
	header {
		display: grid;

		width: 24rem;
		height: 100%;

		font-size: 1.25rem;
		padding: 1rem;
		background: var(--ctp-mocha-mantle);
		overflow: hidden;

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
		padding-left: 2rem;
	}

	:global(summary) {
		transition: var(--trans-time);
	}
	:global(details > summary) {
		position: relative;
		transition: var(--trans-time);
	}
	:global(details > summary::before) {
		content: '\f054';
		position: absolute;
		left: -1.5rem;
		transition: var(--trans-time);
		height: 100%;
	}
	:global(details[open] > summary::before) {
		rotate: 90deg;
	}

	:global(details) {
		position: relative;
	}
	:global(details[open]::before) {
		content: '';

		position: absolute;
		translate: -1.15rem 0;
		bottom: 0;

		width: 0.1rem;
		height: calc(100% - 2rem);
		background: var(--ctp-mocha-text);
	}

	:global(details[open] > div.ft-item) {
		position: relative;
	}
	:global(details[open] > div.ft-item::before) {
		content: '\f15b';
		display: grid;
		place-items: center;

		position: absolute;
		left: 0.25rem;
		height: 100%;
		width: 1rem;

		font-size: 1rem;
	}
	/* :global(.ft-item) {
		padding-top: 0.5rem;
	} */

	#settings {
		display: grid;
		grid-auto-flow: column;
		place-items: center;
		align-self: end;

		position: absolute;
		left: 0;
		bottom: 0;
		width: 24rem;

		padding: 1rem;
		font-size: 2rem;
		background: var(--ctp-mocha-crust);
	}
	#settings-close {
		position: absolute;
		right: 0;

		font-size: 2rem;
		padding: 0.5rem;
		background: var(--ctp-mocha-crust);
		color: var(--ctp-mocha-text);

		transition: var(--trans-time);
	}
	#settings-open {
		position: absolute;
		left: 0;
		bottom: 0.5rem;

		border-radius: 0 1rem 1rem 0;
		font-size: 2rem;
		padding: 0.5rem;
		background: var(--ctp-mocha-mantle);
		color: var(--ctp-mocha-text);

		transition: var(--trans-time);
	}

	/*  */

	/* @media only screen and (orientation: portrait) {
		#wrapper {
			grid-auto-flow: column;
			grid-template-columns: 1fr;
			grid-template-rows: auto 1fr;
		}

		header {
			width: 100%;
		}
	} */
</style>
