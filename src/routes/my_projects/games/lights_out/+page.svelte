<script>
	import { onMount } from 'svelte';

	let GRID_SIZE = 5;
	// bottom row => top row
	// . . * * *    . . . + .
	// . * . * .    . + . . +
	// . * * . *    + . . . .
	// * . . . *    . . . + +
	// * . * * .    . . . . +
	// * * . * *    . . + . .
	// * * * . .    . + . . .
	const CONFIG5 = [
		[0, 0, 1, 1, 1],
		[0, 1, 0, 1, 0],
		[0, 1, 1, 0, 1],
		[1, 0, 0, 0, 1],
		[1, 0, 1, 1, 0],
		[1, 1, 0, 1, 1],
		[1, 1, 1, 0, 0],
	];

	/** @param {number} idx
	 * @returns {{x:number, y:number}} */
	function id2pos(idx) {
		return { x: Math.floor(idx % GRID_SIZE), y: Math.floor(idx / GRID_SIZE) };
	}

	/** @param {{x:number, y:number}} pos
	 * @returns {number} */
	function pos2id(pos) {
		return pos.x + pos.y * GRID_SIZE;
	}

	function update() {
		const grid = document.getElementById('grid');
		if (grid == null) return console.error('no grid found');
		grid.setAttribute('style', `--size: ${GRID_SIZE}`);

		setTimeout(handle_random, 100);
	}

	/**	@param {EventTarget} target */
	function handle_cell(target) {
		// @ts-ignore
		const id = parseInt(target.dataset.id, 10);
		const pos = id2pos(id);
		const poss = [{ x: pos.x, y: pos.y }];
		if (pos.x >= 0 && pos.x < GRID_SIZE - 1) poss.push({ x: pos.x + 1, y: pos.y });
		if (pos.x > 0 && pos.x < GRID_SIZE) poss.push({ x: pos.x - 1, y: pos.y });
		if (pos.y >= 0 && pos.y < GRID_SIZE - 1) poss.push({ x: pos.x, y: pos.y + 1 });
		if (pos.y > 0 && pos.y < GRID_SIZE) poss.push({ x: pos.x, y: pos.y - 1 });

		const ids = poss.map(pos2id);
		const toggle = ids.map((i) => document.querySelector(`[data-id="${i}"]`) ?? null).filter((c) => c != null);
		toggle.forEach((c) => {
			// @ts-ignore
			c.dataset.on = c.dataset.on == 'true' ? 'false' : 'true';
		});

		setTimeout(handle_end, 100);
	}

	function handle_random() {
		const cells = Array.from(document.querySelectorAll('.cell'));

		if (GRID_SIZE === 5) {
			if (cells.length != 25) return setTimeout(() => handle_random(), 100);

			cells.forEach((cell) => {
				// @ts-ignore
				cell.dataset.on = false;
			});
			const config = CONFIG5[Math.floor(Math.random() * CONFIG5.length)];
			for (let i = 0; i < 5; i++) {
				// @ts-ignore
				document.querySelector(`[data-id="${i + 20}"]`).dataset.on = `${config[i] == 1}`;
			}
		}
		cells.forEach((cell) => {
			if (Math.random() < 0.5) return;
			// @ts-ignore
			handle_cell(cell);
		});
	}

	function handle_end() {
		const cells = Array.from(document.querySelectorAll('.cell'));
		let win = true;
		cells.forEach((cell) => {
			// @ts-ignore
			win &&= cell.dataset.on === 'false';
		});
		if (win) alert('Congratulations!');
	}

	onMount(() => {
		Array.from(document.querySelectorAll('.cell')).forEach((cell) => {
			cell.addEventListener('click', (e) => {
				// @ts-ignore
				handle_cell(e.target);
			});
		});

		update();
	});
</script>

<div id="game">
	<div class="menu">
		<h2>
			Lights Out (<a
				href="https://en.wikipedia.org/wiki/Lights_Out_(game)"
				target="_blank"
				rel="noreferrer noopener">Wiki</a
			>)
		</h2>
		<button on:click={handle_random}>Randomize</button>
	</div>
	<div class="main">
		<div id="grid" data-size={GRID_SIZE}>
			{#each { length: GRID_SIZE ** 2 } as _, i}
				<div class="cell" data-on={true} data-id={i} />
			{/each}
		</div>
	</div>
</div>

<style>
	:root {
		--w: rgb(255 255 255 / 0.1);

		--bg: var(--ctp-mocha-surface0);
		--off: var(--ctp-mocha-surface2);
		--on: var(--ctp-mocha-overlay2);

		/* --bg: var(--slate-900);
		--off: var(--slate-700);
		--on: var(--slate-400); */
	}

	div#game {
		display: grid;
		padding: 2rem;
		gap: 2rem;
		width: 100%;
		height: calc(100dvh - 5rem);

		/* grid-template-columns: 1fr 2fr 1fr;
		grid-template-rows: 1fr; */
		grid-template-areas: 'm h';
	}

	@media only screen and (orientation: portrait) {
		div#game {
			grid-template-rows: 1fr 2fr;
			grid-template-columns: 1fr;
			grid-template-areas:
				'h'
				'm';
		}
	}

	.menu {
		display: grid;
		place-items: center;

		grid-area: h;
		width: 100%;
		height: 100%;
	}
	button {
		width: fit-content;
		height: fit-content;

		border: none;
		border-radius: 0.25rem;

		padding: 0.5rem;
		font-size: 1.25rem;
		font-weight: 900;

		color: var(--ctp-mocha-base);
		background: var(--ctp-mocha-peach);
	}

	.main {
		display: grid;
		align-items: center;
		justify-content: center;
		grid-area: m;
	}
	.main > #grid {
		--padding: 0.5rem;
		--size: 5;
		--cell-size: calc(min(60vmin, 30rem) / var(--size));
		--cell-gap: calc(var(--padding) * 0.5);
		--grid-size: calc(var(--size) * var(--cell-size) + (var(--size) + 1) * var(--cell-gap) + var(--padding) * 2);

		display: grid;
		grid-template-columns: repeat(var(--size), 1fr);

		width: var(--grid-size);
		height: var(--grid-size);

		background: var(--bg);
		padding: var(--padding);
		border-radius: calc(var(--padding) + var(--cell-gap));
		gap: var(--cell-gap);
	}
	.main > #grid > .cell {
		width: max(var(--cell-size), 100%);
		height: max(var(--cell-size), 100%);
		border-radius: var(--cell-gap);

		transition: all 0.05s;

		&:hover {
			filter: brightness(120%);
		}
	}
	.main > #grid > .cell:hover {
		filter: brightness(120%);
	}

	:global(#grid > .cell[data-on='false']) {
		background: var(--off);
	}
	:global(#grid > .cell[data-on='true']) {
		background: var(--on);
	}
</style>
