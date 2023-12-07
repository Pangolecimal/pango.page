<script>
	// import { onMount } from 'svelte';

	/** @type {import('./$types').LayoutData} */
	export let data;

	let max_depth = 0;
	let routes = data.routes.map((route) => {
		if (route === '/') return { name: 'Home', depth: 1, href: route };

		let route_path = route.split('/');
		let route_end = route_path.at(-1) ?? '';
		let route_depth = route_path.length;
		max_depth = Math.max(max_depth, route_depth);

		return {
			name: route_end
				.split('_')
				.map((r) => {
					if (r.length == 0) return r;
					return r[0].toUpperCase() + r.slice(1);
				})
				.join(' '),
			href: route,
			depth: route_depth,
		};
	});

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

	let ft = '';
	ft += '<ul>';
	for (let i = 0; i < routes.length; i++) {
		// for (let i = 0; i < max_depth; i++) {
		// let routes_i = routes.filter((r) => r.href.split('/').length === i);

		ft += '<li>';
		ft += '<a href="' + routes[i].href;
		ft += `" style="padding-left: ${routes[i].depth * 1.5}rem">` + routes[i].name;
		ft += '</a>';
	}
	ft += '</ul>';
</script>

<!-- {#each routes as route, i}
	<div
		class="file"
		data-depth={route.depth}
		data-active={true}
		data-index={i}
		style="padding-left: {route.depth * 2}rem;"
	>
		{#if route.depth < max_depth}
			<i class="fa-solid fa-folder" />
		{:else}
			<i class="fa-solid fa-file" />
		{/if}
		<a href={route.href}>
			{route.name}
		</a>
	</div>
{/each} -->

<div id="wrapper">
	<header data-active={true} bind:this={header}>
		<div id="filetree">{@html ft}</div>

		<!-- Settings, etc. -->
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
	@import '$lib/fontawesome/pro/css/all.css';
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
	/* .file {
		padding-top: 1rem;
		overflow: hidden;
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
