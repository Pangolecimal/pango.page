<script>
	import { base } from '$app/paths';
</script>

<main>
	<h1>NixOS</h1>

	<br />

	<img src="{base}/nix-snowflake.svg" alt="NixOs" width="400px" />

	<br />

	<ul>
		<p><b>Nix</b> is the name of:</p>
		<li>Programming Language (<a href="https://nix.dev/">Nix</a>)</li>
		<li>Linux Distribution (<a href="https://nixos.org/">NixOS</a>)</li>
		<li>Package Repository (<a href="https://search.nixos.org/packages">nixpkgs</a>)</li>
	</ul>
	<p><a href="https://nixos.org/">NixOS</a></p>
</main>

<style>
	main {
		display: grid;
		place-items: center;
		gap: 1rem;
		padding: 1rem;
	}
	img {
		width: min(40ch, 45%);
	}
</style>
