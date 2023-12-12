<script>
	import { base } from '$app/paths';
</script>

<main>
	<h1>Home</h1>

	<br />

	<img src="{base}/napoleon.png" alt="the is nothing we can do" width="400px" />
	<h2>There is nothing we can do.</h2>

	<br />
	<p>
		<i>To navigate between pages use the</i> <b>PageTree<sup><i class="fa-solid fa-trademark fa-xs" /></sup></b>
	</p>
</main>

<style>
	main {
		display: grid;
		place-items: center;
		gap: 1rem;
		padding: 1rem;
	}
	img {
		width: min(60ch, 75%);
	}
	h2 {
		text-align: center;
		width: min(60ch, 75%);
	}
</style>
