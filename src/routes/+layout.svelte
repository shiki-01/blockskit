<script lang="ts">
	import { onMount } from 'svelte';
	import '../app.css';
	import '@fontsource-variable/lexend-exa';

	let { children } = $props();

	onMount(() => {
		if ('serviceWorker' in navigator) {
			navigator.serviceWorker
				.register('/service-worker.js', {
					type: 'module'
				})
				.then((registration) => {
					console.log('Service Worker registered with scope:', registration.scope);
				})
				.catch((error) => {
					console.error('Service Worker registration failed:', error);
				});
		}

		let lastTouched: number = 0;
		document.addEventListener('touchend', (event) => {
			const now = new Date().getTime();
			if (now - lastTouched <= 300) {
				event.preventDefault();
			}
			lastTouched = now;
		})
	});
</script>

<main class="flex h-[100dvh] w-[100dvw] touch-none items-center justify-center select-none">
	<div
		class="relative"
		style="
            width: min(100%, calc(100vh * 9 / 16));
            height: min(100%, calc(100vw * 16 / 9));
            aspect-ratio: 9 / 16;
            min-width: 200px;
        "
	>
		{@render children()}
	</div>
</main>

<style>
	:global(body) {
		font-family: 'Lexend Exa Variable', sans-serif;
		background-color: #162833ff;
	}
</style>
