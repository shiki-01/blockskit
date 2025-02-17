<script lang="ts">
	import '../app.css';
    import '@fontsource-variable/lexend-exa';
	let { children } = $props();
</script>

<main class="touch-none select-none flex justify-center items-center w-[100dvw] h-[100dvh]">
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
        background-color: #162833FF;
    }
</style>