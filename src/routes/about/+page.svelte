<script>
	import { base } from '$app/paths';
	console.log(base);
</script>

<main>
	<h1>About</h1>

	<br />

	<p>This is My Personal Page.</p>

	<br />
	<p>It was built with Svelte v4 and SvelteKit.</p>

	<img src="{base}/svelte-horizontal.svg" alt="svelte" />
</main>

<style>
	main {
		display: grid;
		place-items: center;
		gap: 1rem;
		padding: 2rem;
	}

	img {
		width: min(60ch, 75%);
	}

	p {
		text-align: center;
	}
</style>
