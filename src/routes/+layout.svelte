<script>
	// // key = href,
	// /** @type {Object<string, string>[]} */
	// let ft = [];
	// for (let i = 0; i < routes.length; i++) {
	// 	let curr = routes[i];
	// 	if (prev.depth < curr.depth) {
	// 		ft += `\n\t<details class="ft-item is-expandable">`;
	// 		ft += `\n\t\t<summary class="ft-title">${prev.name}</summary>`;
	// 	}
	// 	if (prev.depth === curr.depth) {
	// 		ft += `\n\t\t\t<div class="ft-item">`;
	// 		ft += `\n\t\t\t\t<a class="ft-title" href="${curr.href}">${curr.name}</a>`;
	// 		ft += `\n\t\t\t</div>`;
	// 	}
	// 	if (curr.depth > next.depth) {
	// 		ft += `\n\t</details>`;
	// 	}
	// 	if (i === routes.length - 2) {
	// 		ft += `\n\t</details>`.repeat(next.depth);
	// 	}
	// }
	// console.log(ft);

	import { onMount } from 'svelte';
	console.clear();

	/** @type {import('./$types').LayoutData} */
	export let data;

	let max_depth = 0;
	let routes = data.routes.map((route) => {
		let route_path = route.split('/');
		let route_end = route_path.at(-1) ?? '';
		let route_depth = route_path.length - 1;
		max_depth = Math.max(max_depth, route_depth);

		return {
			depth: route_depth,
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
	console.log(routes);

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

	let /**@type {HTMLElement}*/ ft;
	function make_ft() {
		for (let i = 0; i < routes.length; i++) {
			let path = routes[i].href.split('/');

			let details_temp = document.getElementById(`ft-${path[1]}`);
			if (details_temp == null) {
				ft.innerHTML += `
				<details class="ft-item is-expandable" id="ft-${routes[i].href}">
					<summary class="ft-title">${routes[i].name}</summary>
					</details>`;
			}
			let details = details_temp ?? document.getElementById(`ft-${path[1]}`) ?? document.createElement('details'); // last ?? is a hack

			for (let j = 2; j < path.length; j++) {
				details_temp = document.getElementById(`ft-${path[j]}`);
				if (details_temp == null) {
					details.innerHTML += `
					<details class="ft-item is-expandable" id="ft-${path.slice(0, j).join('/')}">
						<summary class="ft-title">${routes.find((r) => r.href === path.slice(0, j).join('/')).name}</summary>
					</details>`;
				} else {
					details = details_temp;
				}
				console.log(details);
			}
		}
	}
	onMount(make_ft);
</script>

<div id="wrapper">
	<header data-active={true} bind:this={header}>
		<nav id="filetree">
			<details class="ft-item is-expandable" id="ft-/" bind:this={ft}>
				<summary class="ft-title"><a href="/">Home</a></summary>
			</details>

			<!-- Structure: -->
			<!--<details class="ft-item is-expandable invisible">
					<summary class="ft-title">The Soldier Son trilogy</summary>
					<div class="ft-item">
						<a class="ft-title" href="/">SHAMAN'S CROSSING</a>
						<a class="ft-title" href="/">FOREST MAGE</a>
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

	/*  */

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

		transition: 1s;
	}
	:global(header[data-active='false']) {
		width: 0;
		padding: 0;
	}

	#filetree {
		height: 100%;
		/* display: grid; */
		padding-bottom: 3rem;
		position: relative;
	}
	:global(#ft-ul) {
		padding: 0;
	}
	:global(ul) {
		background: rgb(255 0 0 / 0.1);
		list-style-type: none;
		padding-left: 2rem;
	}
	:global(li:has(ul:not(#ft-ul))::before) {
		content: '\25B6';
		/* display: inline-block; */
		margin-right: 6px;
	}
	:global(li::before) {
		display: none;
	}
	:global(details::-webkit-details-marker) {
		display: none;
	}
	:global(summary) {
		cursor: pointer;
	}

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

		transition: 1s;
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

		transition: 1s;
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
