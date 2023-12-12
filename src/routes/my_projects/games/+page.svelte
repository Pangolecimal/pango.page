<script>
	import { base } from '$app/paths';
</script>

<main>
	<h1>My Games</h1>

	<br />
	<p>Currently playable game here is <b>Lights Out</b></p>

	<p>But there are some other games over at my github!</p>
	<ul>
		Here are some of them:
		<li>
			<a href="https://pangolecimal.github.io/TikiTaki/" target="_blank" rel="noreferrer noopener">
				TicTacToe with differently sized dots
			</a>
		</li>
		<li>
			<a href="https://pangolecimal.github.io/AdvancedTicTacToe/" target="_blank" rel="noreferrer noopener">
				Advanced TicTacToe played on a 3x3 grid of 3x3 grids!
			</a>
		</li>
		<li>
			<a href="https://pangolecimal.github.io/Elementals-Battle/" target="_blank" rel="noreferrer noopener">
				Elementals (Work In Progress)
			</a>
		</li>
	</ul>
</main>

<style>
	main {
		display: grid;
		place-items: center;
		gap: 1rem;
		padding: 2rem;
	}

	ul > li {
		margin-left: 2rem;
		margin-top: 1rem;
	}
</style>
