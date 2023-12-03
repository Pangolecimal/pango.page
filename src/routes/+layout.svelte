<script>
	import { page } from '$app/stores';

	/** @type {import('./$types').LayoutData} */
	export let data;
</script>

{#each data.routes as route}
	<a href={route}>GOTO {route}</a><br /><br />
{/each}
Curreantly at: {$page.url.pathname}
<slot />
