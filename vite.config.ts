import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
	plugins: [
		sveltekit(),
		tailwindcss(),
		VitePWA({
			registerType: 'autoUpdate',
			manifest: {
				name: 'Blockskit',
				short_name: 'Blockskit',
				description: 'A color blocks game',
				theme_color: '#ffffff',
				icons: [
					{
						src: 'favicon.png',
						sizes: '512x512',
						type: 'image/png'
					}
				]
			},
			workbox: {
				maximumFileSizeToCacheInBytes: 5 * 1024 * 1024
			}
		})
	]
});
