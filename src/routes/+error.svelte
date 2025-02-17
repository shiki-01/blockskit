<script lang="ts">
	import { page } from '$app/state';
</script>

<div class="w-full">
	<h1>Error</h1>
	<pre>
        <code>
            {JSON.stringify($state.snapshot(page.error))}
        </code>
    </pre>
</div>
