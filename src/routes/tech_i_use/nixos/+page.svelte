<script>
	import { base } from '$app/paths';
</script>

<main>
	<div class="content">
		<h1 class="full">Nix and NixOS</h1>

		<img class="popout" src="{base}/images/nix-snowflake.svg" alt="NixOs" width="400px" />

		<p class="feature">
			Nix is a purely functional package manager that provides a reliable and reproducible way to manage software
			packages. It is designed to be independent of the host system, allowing users to create isolated
			environments for their applications.
		</p>

		<p class="popout">
			NixOS, on the other hand, is a Linux distribution built on top of the Nix package manager. It follows a
			declarative approach to system configuration, enabling users to define their system setup in a consistent
			and reproducible manner.
		</p>

		<h2 class="popout">Key Features of Nix</h2>
		<ul>
			<li>Functional Package Management</li>
			<li>Isolated Environments</li>
			<li>Reproducibility</li>
			<li>Atomic Upgrades and Rollbacks</li>
		</ul>

		<h2 class="popout">Key Features of NixOS</h2>
		<ul>
			<li>Declarative System Configuration</li>
			<li>Immutable System State</li>
			<li>Rollback Capability</li>
			<li>Configuration Rollbacks</li>
		</ul>

		<h2 class="popout">Getting Started</h2>
		<p>To get started with Nix and NixOS, you can visit the official websites:</p>
		<ul>
			<li><a href="https://nixos.org/">NixOS Official Website</a></li>
			<li><a href="https://nixos.org/nix/">Nix Package Manager</a></li>
		</ul>

		<p>
			Explore the documentation and community resources to learn more about installation, configuration, and best
			practices.
		</p>

		<p>
			Feel free to join the community forums and mailing lists to connect with other Nix and NixOS users and
			developers.
		</p>
	</div>
</main>

<style>
	main {
		padding-top: 2rem;
	}
	img {
		width: min(30ch, 60%);
		position: relative;
		left: 50%;
		translate: -50% 0;
	}

	h1,
	h2 {
		text-align: center;
	}

	p {
		text-align: justify;
		text-indent: 4ch;
	}

	.content {
		--gap: clamp(1rem, 6vw, 3rem);
		--full: minmax(var(--gap), 1fr);
		--content: min(50ch, 100% - var(--gap) * 2);
		--popout: minmax(0, 3rem);
		--feature: minmax(0, 6rem);

		display: grid;
		gap: 2rem;
		grid-template-columns:
			[full-start] var(--full)
			[feature-start] var(--feature)
			[popout-start] var(--popout)
			[content-start] var(--content) [content-end]
			var(--popout) [popout-end]
			var(--feature) [feature-end]
			var(--full) [full-end];
	}
	.content > * {
		grid-column: content;
	}
	.popout {
		grid-column: popout;
	}
	.feature {
		grid-column: feature;
	}
	.full {
		grid-column: full;
	}

	@media only screen and (orientation: portrait) {
		:root {
			font-size: 1.25rem;
		}

		.content {
			--gap: clamp(0rem, 6vw, 1rem);
			--content: min(20ch, 100% - var(--gap) * 2);
		}
	}
</style>
