<script>
	import { onMount } from 'svelte';
	import { base } from '$app/paths';

	console.clear();

	/** @type {import('./$types').LayoutData} */
	export let data;
	// console.log(data.routes);

	let /** @type {HTMLElement} */ header;
	let /** @type {HTMLElement} */ open;
	function close_header() {
		header.dataset.active = 'false';
		open.dataset.active = 'true';
	}
	function open_header() {
		header.dataset.active = 'true';
		open.dataset.active = 'false';
	}

	/** @param {string} name @param {string} href */
	function make_details(name, href) {
		let existing = document.getElementById(`ft-${href}`);
		if (existing != null) {
			console.warn('details already exist:', arguments, existing);
			return existing;
		}

		let details = document.createElement('details');
		details.className = 'ft-item expandable';
		details.id = `ft-${href}`;

		let summary = document.createElement('summary');
		summary.className = 'ft-title';

		let i = document.createElement('i');
		i.className = 'fa-solid fa-chevron-right';

		let a = document.createElement('a');
		a.className = 'ft-title';
		a.href = base + href;
		a.innerText = name;

		summary.appendChild(i);
		summary.appendChild(a);

		details.appendChild(summary);

		return details;
	}

	/** @param {string} name @param {string} href */
	function make_item(name, href) {
		let div = document.createElement('div');
		div.className = 'ft-item';

		let i = document.createElement('i');
		i.className = 'fa-solid fa-file-lines fa-sm';

		let a = document.createElement('a');
		a.className = 'ft-title';
		a.href = base + href;
		a.innerText = name;

		div.appendChild(i);
		div.appendChild(a);

		return div;
	}

	function make_filetree() {
		for (let i = 0; i < data.routes.length; i++) {
			let curr = data.routes[i];
			let path = curr.href.split('/');

			let details = document.getElementById('ft-/');
			let prev_details = details;

			// start at 1 because 0 is guaranteed to work (it is the root)
			for (let j = 1; j < path.length - 1; j++) {
				let path_so_far = path.slice(0, j + 1).join('/');
				prev_details = details;
				details = document.getElementById(`ft-${path_so_far}`);

				if (details == null) {
					let name = data.routes.find((r) => r.href === path_so_far)?.name ?? '404';
					details = make_details(name, path_so_far);
					prev_details?.appendChild(details);
				}
			}

			if (curr.type === 'folder') {
				prev_details = details;
				details = make_details(curr.name, path.join('/'));
				prev_details?.appendChild(details);
			}
			if (curr.type === 'file') {
				let file = make_item(curr.name, path.join('/'));
				details?.appendChild(file);
			}
		}
	}

	onMount(() => {
		make_filetree();
	});
</script>

<div id="wrapper">
	<header data-active={false} bind:this={header}>
		<h2>Page Tree</h2>
		<nav id="filetree">
			<details class="ft-item expandable" id="ft-/">
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
			<button id="settings-close" on:click={close_header}>
				<i class="fa-solid fa-square-chevron-left" />
			</button>
		</div>
	</header>

	<div class="main">
		<button id="settings-open" on:click={open_header} data-active={true} bind:this={open}>
			<i class="fa-solid fa-square-chevron-right" />
		</button>
		<slot />
	</div>
</div>

<style>
	:global(*) {
		box-sizing: border-box;
		font-family: monospace;
	}
	:global(*:not(ul, ol)) {
		margin: 0;
	}
	:global(:is(ol, ul) > li) {
		padding-bottom: 1rem;
	}
	:global(html, body) {
		height: 100%;
		background: var(--ctp-mocha-base);
		color: var(--ctp-mocha-text);
		font-size: 1.1rem;
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

	:global(img) {
		max-width: 50ch;
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

	a {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: clip;
		text-wrap: nowrap;
		-webkit-user-drag: none;
	}

	#wrapper {
		height: 100%;
		position: relative;
		transition: var(--trans-time);
	}
	.main {
		height: 100%;
		position: relative;
		transition: var(--trans-time);
	}
	#wrapper:has(header[data-active='true']) .main {
		padding-left: 24rem;
	}
	header {
		display: grid;
		grid-template-rows: auto 1fr;

		width: 24rem;
		height: 100%;

		font-size: 1.25rem;
		padding: 1rem;
		background: var(--ctp-mocha-mantle);
		overflow: auto;

		position: fixed;
		z-index: 90;

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

	:global(details > *:not(summary)) {
		padding-left: 2ch;
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
		left: -2.5ch;
		transition: var(--trans-time);
		width: 2ch;
		text-align: center;
	}
	:global(details[open] > summary > i) {
		rotate: 90deg;
	}

	:global(details) {
		position: relative;
	}
	:global(details[open]::before) {
		--width: 0.1rem;
		content: '';

		position: absolute;
		translate: calc(-1.5ch - var(--width) / 2) 0;
		bottom: 0.1rem;

		width: var(--width);
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
		z-index: 100;

		transition: var(--trans-time);
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
		background: var(--ctp-mocha-crust);
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
		:global(html, body) {
			font-size: 1rem;
		}

		#wrapper:has(header[data-active='true']) .main {
			padding-left: 0;
			top: 24rem;
			height: calc(100% - 24rem);
		}
		header {
			top: 4rem;
			width: 100%;
			height: 20rem;
			font-size: 1.5rem;
		}
		:global(header[data-active='false']) {
			height: 0;
			padding: 0 1rem;
		}

		#settings {
			width: 100%;
			top: 0;
			bottom: auto;
		}
		#settings-close {
			right: 0.75rem;
			top: 100%;
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
