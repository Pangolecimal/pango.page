<script>
	import { page } from '$app/stores';

	/** @type {import('./$types').LayoutData} */
	export let data;

	// let max_depth = 0;
	let routes = data.routes.map((route) => {
		if (route === '/') return { name: 'Home', depth: 1, href: route };

		let route_path = route.split('/');
		let route_end = route_path.at(-1) ?? '';
		let route_depth = route_path.length;
		// max_depth = Math.max(max_depth, route_depth);

		return {
			name: route_end
				.split('_')
				.map((r) => {
					if (r.length == 0) return r;
					return r[0].toUpperCase() + r.slice(1);
				})
				.join(' '),
			depth: route_depth,
			href: route,
		};
	});

	/* File Tree
> Home
> > About
> > My Projects
> > > Algorithms
> > > > Delaunay
> > > Configs
> > > Games
> > > > Lights Out
> > Op Projects
> > > Articles
> > > Configs
> > > Websites
*/
</script>

<div id="wrapper">
	<header>
		<div id="filetree">
			{#each routes as route}
				<div class="file">
					<a href={route.href} data-depth={route.depth} data-active={true}>{route.name}</a>
				</div>
			{/each}
		</div>

		<!-- Settings, etc. -->
		<div id="settings">
			<i class="fa-solid fa-cog" />
		</div>
	</header>

	<main><slot /></main>
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

	/*  */

	#wrapper {
		display: grid;
		grid-template-columns: auto 1fr;
		height: 100%;
	}

	header {
		display: grid;
		position: relative;

		width: 30ch;
		height: 100%;

		font-size: 1.25rem;
		padding: 1rem;
		background: var(--ctp-mocha-mantle);

		overflow-y: scroll;
	}

	#filetree {
		height: fit-content;
		display: grid;
		padding-bottom: 3rem;
	}
	.file {
		padding-top: 1rem;
	}
	[data-depth='1'] {
		padding-left: 1rem;
	}
	[data-depth='2'] {
		padding-left: 2rem;
	}
	[data-depth='3'] {
		padding-left: 3rem;
	}
	[data-depth='4'] {
		padding-left: 4rem;
	}
	[data-depth='5'] {
		padding-left: 5rem;
	}

	#settings {
		display: grid;
		place-items: center;
		align-self: end;

		position: sticky;

		padding: 0.5rem;
		font-size: 2rem;
		background: var(--ctp-mocha-crust);
	}

	/*  */

	@media only screen and (orientation: portrait) {
		#wrapper {
			grid-auto-flow: column;
			grid-template-columns: 1fr;
			grid-template-rows: auto 1fr;
		}

		#filetree {
			width: 100%;
		}
	}
</style>
