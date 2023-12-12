<script>
	import { base } from '$app/paths';
</script>

<main>
	<div class="content">
		<h1>Neovim</h1>

		<img class="popout" src="{base}/neovim-mark.svg" alt="Neovim" width="200px" />

		<p class="popup">
			Neovim is a highly extensible and improved version of the Vim text editor. It aims to provide a more
			maintainable and extensible codebase while preserving the powerful editing features of Vim. Neovim is known
			for its focus on modularity, enabling users to extend and customize their editing environment with plugins
			and configurations.
		</p>

		<h2>Key Features of Neovim</h2>
		<ul>
			<li>Modular Architecture</li>
			<li>Built-in Terminal Emulator</li>
			<li>Enhanced Plugin Support</li>
			<li>Modern Configuration Options</li>
		</ul>

		<h2>Getting Started</h2>
		<p>To start using Neovim, you can follow these steps:</p>
		<ol>
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

		<h2>Community and Resources</h2>
		<p>
			Join the Neovim community to connect with other users, share configurations, and stay updated on the latest
			developments:
		</p>
		<ul>
			<li>Official Website: <a href="https://neovim.io/">Neovim</a></li>
			<li>GitHub Repository: <a href="https://github.com/neovim/neovim">Neovim on GitHub</a></li>
			<li>Community Chat: <a href="https://gitter.im/neovim/neovim">Neovim Gitter Chat</a></li>
		</ul>
	</div>
</main>

<style>
	main {
		display: grid;
		/* place-items: center; */
		gap: 2rem;
		padding: 2rem;
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
		text-indent: 4rem;
	}

	.content {
		--gap: clamp(1rem, 6vw, 3rem);
		--full: minmax(var(--gap), 1fr);
		--content: min(50ch, 100% - var(--gap) * 2);
		--popout: minmax(0, 2rem);
		--feature: minmax(0, 5rem);

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
</style>
