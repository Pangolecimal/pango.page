<script>
	import { onMount } from 'svelte';
	import { base } from '$app/paths';

	/** @type {import('./$types').LayoutData} */
	export let data;
	console.log(data.routes.map((r) => r.href));

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

	let /** @type {HTMLElement} */ filetree;
	function make_filetree() {
		let ft = ``;
		for (let i = 0; i < data.routes.length; i++) {
			let c = data.routes[i];
			let p = data.routes[i - 1] ?? { depth: 0, type: 'file' };
			let n = data.routes[i + 1] ?? { depth: 0, type: 'file' };

			let cd = c.depth;
			let pd = p.depth;
			let nd = n.depth;

			let A = `<details class="ft-item expandable" id="ft-${
				c.href
			}"><summary class="ft-title">\n\t<i class="fa-solid fa-chevron-right"></i><a class="ft-title" href="${
				base + c.href
			}">${c.name}</a></summary>\n`;
			let B = `\t<div class="ft-item"><i class="fa-solid fa-file-lines fa-sm"></i><a class="ft-title" href="${
				base + c.href
			}">${c.name}</a></div>\n`;
			let C = `</details>\n`;

			let d = 'folder';
			let f = 'file';

			let delta = '';

			if (cd < nd && pd > cd) delta += C; // ?
			if (cd < nd) delta += A;
			if (cd === nd) delta += B;
			if (cd > nd) delta += B + C;

			// if (href === '/my_projects/games') {
			// 	console.log(delta);
			// 	console.log(ft);
			// }

			ft += delta;
		}

		filetree.innerHTML += ft;
	}

	onMount(() => {
		make_filetree();
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
			<details class="ft-item expandable" id="ft-/" bind:this={filetree}>
				<summary class="ft-title"><i class="fa-solid fa-chevron-right" /><a href="{base}/">Home</a></summary>
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

	/* globals for all pages ^^^ | locals for layout vvv */

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
			height: 100%;
		}
		:global(header[data-active='false']) {
			height: 0;
			padding: 0 1rem;
		}
		:global(#wrapper:has(header[data-active='false'])) {
			grid-template-rows: 0fr 1fr;
		}
		:global(#wrapper:has(header[data-active='true'])) {
			grid-template-rows: 1fr 1fr;
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
