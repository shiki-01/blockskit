<script lang="ts">
	import { page } from '$app/state';
</script>

<div class="w-full p-10 text-white">
	<h1>Error</h1>
	<pre>
        <code>
            {JSON.stringify($state.snapshot(page.error))}
        </code>
    </pre>
</div>
