<script>
	import { base } from '$app/paths';
</script>

<main>
	<div class="content">
		<h1 class="full">Neovim</h1>

		<img class="popout" src="{base}/images/neovim-mark.svg" alt="Neovim" width="200px" />

		<p class="feature">
			Neovim is a highly extensible and improved version of the Vim text editor. It aims to provide a more
			maintainable and extensible codebase while preserving the powerful editing features of Vim. Neovim is known
			for its focus on modularity, enabling users to extend and customize their editing environment with plugins
			and configurations.
		</p>

		<h2 class="feature">Key Features of Neovim</h2>
		<ul class="popout">
			<li>Modular Architecture</li>
			<li>Built-in Terminal Emulator</li>
			<li>Enhanced Plugin Support</li>
			<li>Modern Configuration Options</li>
		</ul>

		<h2 class="feature">Getting Started</h2>
		<p class="popout">To start using Neovim, you can follow these steps:</p>
		<ol class="feature">
			<li>
				Install Neovim on your system. You can find installation instructions on the <a
					href="https://neovim.io/">official Neovim website</a
				>.
			</li>
			<li>
				Explore the built-in features and commands of Neovim. The <code>:help</code> command is a powerful resource
				for learning about different functionalities.
			</li>
			<li>
				Customize your Neovim setup by creating a <code>init.vim</code> or <code>init.lua</code> configuration file
				in the appropriate directory.
			</li>
			<li>
				Discover and install plugins to enhance your editing experience. Popular plugin managers like Vim-Plug,
				Dein.vim, and others can simplify the process.
			</li>
		</ol>

		<h2 class="feature">Community and Resources</h2>
		<p class="feature">
			Join the Neovim community to connect with other users, share configurations, and stay updated on the latest
			developments:
		</p>
		<ul class="feature">
			<li>Official Website: <a href="https://neovim.io/">Neovim</a></li>
			<li>GitHub Repository: <a href="https://github.com/neovim/neovim">Neovim on GitHub</a></li>
			<li>Community Chat: <a href="https://gitter.im/neovim/neovim">Neovim Gitter Chat</a></li>
		</ul>
	</div>
</main>

<style>
	main {
		padding: 2rem 0;
		height: 100%;
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
