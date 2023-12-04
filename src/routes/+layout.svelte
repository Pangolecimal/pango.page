<script>
	import { page } from '$app/stores';

	/** @type {import('./$types').LayoutData} */
	export let data;

	let routes = data.routes.map((route) => {
		if (route === '/') return { name: 'Home', href: route };
		return {
			name: route
				.split('/')
				.map((r, i, a) => {
					if (r.length > 0 && i === a.length - 1) {
						return r[0].toUpperCase() + r.slice(1);
					}
					return i === a.length - 2 ? '>' : '-';
				})
				.join(' ')
				.split('_')
				.map((r) => {
					if (r.length == 0) return r;
					return r[0].toUpperCase() + r.slice(1);
				})
				.join(' '),
			href: route,
		};
	});
</script>

<div id="wrapper">
	<header>
		<!-- File Tree -->
		{#each routes as route, i}
			<label class="unselectable">
				<input type="checkbox" name={i.toString()} id={i.toString()} />{route.name}
			</label>
			<a href={route.href}>HERE</a><br />
		{/each}

		<!-- Settings, etc. -->
		<!-- <i class="fa-solid fa-cog" /> -->
	</header>

	<main>
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

	header {
		background: var(--ctp-mocha-mantle);
		width: 30ch;
		height: 100%;
		font-size: 1.25rem;
		padding: 1rem;
		resize: horizontal;
		overflow: hidden;
	}

	#wrapper {
		display: grid;
		grid-auto-flow: column;
		height: 100%;
	}
</style>
