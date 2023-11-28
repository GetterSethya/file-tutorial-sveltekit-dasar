<script lang="ts">
    import {enhance} from "$app/forms"
</script>


<main class="text-white">
	<h1>Welcome to SvelteKit</h1>

	<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
    
    <form action="/logout/?logout" method="POST" use:enhance style="display: contents;">
        <button class="btn variant-ghost-primary">Logout</button>
    </form>

</main>
