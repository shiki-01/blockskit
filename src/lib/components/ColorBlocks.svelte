<script lang="ts">
	import { onMount } from 'svelte';
	import { step, level } from '$lib';
	import blockMeta from '$lib/block/meta';

	type Position = { x: number; y: number };
	type Block = { shape: string[]; color: string };

	const stageSize = 8;

	let mainElement: HTMLElement | null = null;
	let stageElement: HTMLElement | null = null;

	let handBlocks: Block[] = [];
	let score: number = 0;
	let stage: Array<Array<{ value: string | null; color: string | null }>> = createEmptyStage(stageSize);
	let draggedBlock: Block | null = null;
	let dragOffset: Position | null = null;
	let dragOffsetDetail: Position | null = null;
	let dragPosition: Position | null = null;
	let suggested: Position[] = [];
	let isTouch: boolean = false;

	const colors = [
		'#D9B632',
		'#D93432',
		'#32D965',
		'#3B45DB',
		'#ae3bdb'
	];

	function createEmptyStage(size: number) {
		return Array(size).fill(null).map(() => Array(size).fill({ value: null, color: null }));
	}

	function rotateBlock(block: string[]): string[] {
		const rotatedBlock = [];
		for (let j = 0; j < block[0].length; j++) {
			rotatedBlock.push(block.map(row => row[j]).reverse().join(''));
		}
		return rotatedBlock;
	}

	function weightedRandomChoice<T>(items: T[], weights: number[]): T {
		const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
		let randomValue = Math.random() * totalWeight;

		return items[weights.findIndex((_, i) => (randomValue -= weights[i]) < 0)];
	}

	function createRandomBlock(blockSet: {shape: string[]; weight: number}[], weights: number[]): Block {
		const selectedBlockMeta = weightedRandomChoice(blockSet, weights);
		let blockShape = selectedBlockMeta.shape;

		for (let i = 0; i < Math.floor(Math.random() * 4); i++) {
			blockShape = rotateBlock(blockShape);
		}

		return { shape: blockShape, color: colors[Math.floor(Math.random() * colors.length)] };
	}

	function getRandomBlocks(): Block[] {
		const blockSet = Object.values(blockMeta).flat();
		const adjustedWeights = blockSet.map(({ weight }) => weight * Math.pow(1.2, $level - 1));
		return Array(3).fill(null).map(() => createRandomBlock(blockSet, adjustedWeights));
	}

	function initializeGame() {
		stage = createEmptyStage(stageSize);
		score = 0;
		handBlocks = getRandomBlocks();
	}

	function getClientPosition(event: PointerEvent | TouchEvent) {
		if (event.type.startsWith('touch')) {
			const touch = (event as TouchEvent).touches[0] || (event as TouchEvent).changedTouches[0];
			if (!touch) {
				console.error('Touch event is missing touches or changedTouches');
				return { clientX: 0, clientY: 0 };
			}
			return { clientX: touch.clientX, clientY: touch.clientY };
		} else {
			return { clientX: (event as PointerEvent).clientX, clientY: (event as PointerEvent).clientY };
		}
	}

	function addEventListeners() {
		document.addEventListener(isTouch ? 'touchmove' : 'pointermove', handleDragBlock, { passive: false });
		document.addEventListener(isTouch ? 'touchend' : 'pointerup', handlePointerUp);
	}

	function removeEventListeners() {
		document.removeEventListener(isTouch ? 'touchmove' : 'pointermove', handleDragBlock);
		document.removeEventListener(isTouch ? 'touchend' : 'pointerup', handlePointerUp);
	}

	function setDragState(targetElement: HTMLElement, clientX: number, clientY: number, block: Block) {
		const boundingRect = targetElement.getBoundingClientRect();

		const offsetDetailX = clientX - boundingRect.left;
		const offsetDetailY = clientY - boundingRect.top;

		const xOffsetGrid = Math.floor(offsetDetailX / 32);
		const yOffsetGrid = Math.floor(offsetDetailY / 32);

		dragOffset = { x: xOffsetGrid, y: yOffsetGrid };
		dragOffsetDetail = { x: offsetDetailX, y: offsetDetailY };
		draggedBlock=block
	}

	function getDropPosition(event: PointerEvent | TouchEvent): Position | null {
		if (!stageElement) return null;
		const { clientX, clientY } = getClientPosition(event);
		const rect = stageElement.getBoundingClientRect();

		if (
			clientX >= rect.left &&
			clientX <= rect.right &&
			clientY >= rect.top &&
			clientY <= rect.bottom
		) {
			return {
				x: Math.floor((clientX - rect.left) / 32),
				y: Math.floor((clientY - rect.top) / 32),
			};
		}
		return null;
	}

	function getDragPosition(event: PointerEvent | TouchEvent): Position | null {
		if (!mainElement) return null;
		const { clientX, clientY } = getClientPosition(event);
		const rect = mainElement.getBoundingClientRect();

		return {
			x: clientX - rect.left,
			y: clientY - rect.top,
		};
	}

	function updateSuggestedPlacement(position: Position): void {
		if (!draggedBlock || !dragOffset) return;

		const startX = Math.floor(position.x / 32) - dragOffset.x;
		const startY = Math.floor(position.y / 32) - dragOffset.y;

		suggested = canPlaceBlock(draggedBlock.shape, startX, startY)
			? draggedBlock.shape.flatMap((row, rowIndex) =>
				row.split('').map((cell, colIndex) =>
					cell === '-' ? { x: startX + colIndex, y: startY + rowIndex } : { x: -1, y: -1 }
				)
			).filter(Boolean)
			: [];
	}

	function finalizePlacement(): void {
		handBlocks = handBlocks.filter(block => block !== draggedBlock);
		if (handBlocks.length === 0) nextTurn();
	}

	function resetDragState(): void {
		draggedBlock = null;
		dragOffset = null;
		dragOffsetDetail = null;
		dragPosition = null;
		suggested = [];
	}

	function handlePointerDown(event: PointerEvent, block: Block) {
		event.preventDefault();
		isTouch = event.pointerType === 'touch';

		const { clientX, clientY } = getClientPosition(event);

		if (!mainElement) return;

		setDragState(event.currentTarget as HTMLElement, clientX, clientY, block);

		addEventListeners();
	}

	function handlePointerUp(event: PointerEvent | TouchEvent): void {
		event.preventDefault();
		if (!draggedBlock || !dragOffset) return;

		removeEventListeners();

		const dropPosition = getDropPosition(event);
		if (dropPosition && canPlaceBlock(draggedBlock.shape, dropPosition.x, dropPosition.y)) {
			placeBlock(draggedBlock, dropPosition.x, dropPosition.y);
			finalizePlacement();
		}

		resetDragState();
	}

	function handleDragBlock(event: PointerEvent | TouchEvent): void {
		if (!draggedBlock || !dragOffset) return;

		const currentDragPosition = getDragPosition(event);
		if (currentDragPosition) {
			dragPosition = currentDragPosition;
			updateSuggestedPlacement(currentDragPosition);
		}
	}

	function canPlaceBlock(block: string[], x: number, y: number): boolean {
		return block.every((row, rowIndex) =>
			row.split('').every((cell, colIndex) => {
				if (cell === '-') {
					const targetCell = stage[y + rowIndex]?.[x + colIndex];
					return targetCell && targetCell.value === null;
				}
				return true;
			})
		);
	}

	function canPlaceAnyBlock(): boolean {
		for (const block of handBlocks) {
			for (let x = 0; x < stage[0].length; x++) {
				for (let y = 0; y < stage.length; y++) {
					if (canPlaceBlock(block.shape, x, y)) return true;
				}
			}
		}
		return false;
	}

	function placeBlock(block: Block, x: number, y: number): void {
		block.shape.forEach((row, rowIndex) => {
			row.split('').forEach((cell, colIndex) => {
				if (cell === '-') {
					stage[y + rowIndex][x + colIndex] = { value: '-', color: block.color };
				}
			});
		});
		checkAndClearLines();
	}

	function checkAndClearLines() {
		let rowsToClear: number[] = [];
		let colsToClear: number[] = [];

		for (let i = 0; i < stage.length; i++) {
			if (stage[i].every((cell) => cell.value === '-')) rowsToClear.push(i);
		}

		for (let j = 0; j < stage[0].length; j++) {
			if (stage.every((row) => row[j].value === '-')) colsToClear.push(j);
		}

		rowsToClear.forEach((row) => stage[row].forEach((cell) => Object.assign(cell, { value: null, color: null })));
		colsToClear.forEach((col) => stage.forEach((row) => Object.assign(row[col], { value: null, color: null })));

		score += rowsToClear.length + colsToClear.length;
	}

	function isGameOver() {
		if (!canPlaceAnyBlock()) {
			step.set(2);
		}
	}

	function nextTurn() {
		handBlocks = getRandomBlocks();
		isGameOver();
	}

	onMount(() => {
		initializeGame();
	});
</script>

<div bind:this={mainElement} style="--stageSize:{stageSize};" class="relative w-full flex flex-col items-center gap-4">
	<p>スコア:{score}</p>

	<!-- ステージ -->
	<div bind:this={stageElement} class="grid touch-none" role="application" aria-dropeffect="move">
		{#each stage as row, y}
			{#each row as cell, x}
				<div
					class="cell {'x-' + x} {'y-' + y} {cell.value ? 'filled' : ''}"
					style="background-color:{cell.color};"
				>
					{#if suggested.some((s) => s.x === x && s.y === y)}
						<div class="suggested" style="--suggestedColor: {draggedBlock?.color || '#052133'}"></div>
					{/if}
				</div>
			{/each}
		{/each}
	</div>

	{#if draggedBlock && dragPosition && dragOffsetDetail}
		<div
			class="dragging-block block-grid"
			style="
                top: {dragPosition.y - dragOffsetDetail.y}px; left: {dragPosition.x - dragOffsetDetail.x}px;
                grid-template-rows: repeat({draggedBlock.shape.length}, 32px);
                grid-template-columns: repeat({draggedBlock.shape[0].length}, 32px);
            "
		>
			{#each draggedBlock.shape as row}
				{#each row.split('') as cell}
					<div class="block-cell {cell === '-' ? 'filled' : ''}"
							 style="background-color:{cell === '-' ? draggedBlock.color : 'transparent'};"></div>
				{/each}
			{/each}
		</div>
	{/if}

	<h2>手持ちブロック</h2>
	<div class="flex flex-row gap-4">
		{#each handBlocks as block}
			<div
				class="block-grid"
				role="button"
				onpointerdown={(event) => handlePointerDown(event, block)}
				style="
                    grid-template-rows: repeat({block.shape.length}, 32px);
                    grid-template-columns: repeat({block.shape[0].length}, 32px);
                "
			>
				{#each block.shape as row}
					{#each row.split('') as cell}
						<div class="block-cell {cell === '-' ? 'filled' : ''}"
								 style="background-color:{cell === '-' ? block.color : 'transparent'};"></div>
					{/each}
				{/each}
			</div>
		{/each}
	</div>
</div>

<style>
    /* スタイル設定 */
    .grid {
        display: grid;
        grid-template-columns: repeat(var(--stageSize), 32px);
        border: solid 2px #0382d7;
        background-color: #0382d7;
        border-radius: 10px;
    }

    .x-0.y-0 {
        border-top-left-radius: 8px;
    }

    .x-7.y-0 {
        border-top-right-radius: 8px;
    }

    .x-0.y-7 {
        border-bottom-left-radius: 8px;
    }

    .x-7.y-7 {
        border-bottom-right-radius: 8px;
    }

    .cell {
        width: 32px;
        height: 32px;
        border: solid thin #0382d7;
        background-color: #162833;
    }

    .cell.filled::before, .cell.filled::after {
        content: "";
        position: absolute;
        width: 32px;
        height: 32px;
        border-radius: 4px;
        pointer-events: none;
    }

    .cell::before {
        border-top: solid 5px rgba(255, 255, 255, 0.2);
        border-left: solid 5px rgba(255, 255, 255, 0.2);
        z-index: 1;
    }

    .cell::after {
        border-bottom: solid 5px rgba(0, 0, 0, 0.2);
        border-right: solid 5px rgba(0, 0, 0, 0.2);
        z-index: 2;
    }

    .suggested {
        width: 100%;
        height: 100%;
        background-color: var(--suggestedColor);
        opacity: 0.5;
    }

    .block-grid {
        display: grid;
    }

    .block-cell {
        width: 32px;
        height: 32px;
        border-radius: 4px;
    }

    /* after, before に blend で縁をつけて立体的に */
    .block-cell.filled::after, .block-cell.filled::before {
        content: "";
        position: absolute;
        width: 32px;
        height: 32px;
        border-radius: 4px;
        pointer-events: none;
    }

    .block-cell::before {
        border-top: solid 5px rgba(255, 255, 255, 0.2);
        border-left: solid 5px rgba(255, 255, 255, 0.2);
        z-index: 1;
    }

    .block-cell::after {
        border-bottom: solid 5px rgba(0, 0, 0, 0.2);
        border-right: solid 5px rgba(0, 0, 0, 0.2);
        z-index: 2;
    }

    .dragging-block {
        position: absolute;
        pointer-events: none;
        z-index: 100;
    }
</style>
