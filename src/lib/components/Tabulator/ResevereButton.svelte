<script lang="ts">
	import type { TabulatorFull as Tabulator } from 'tabulator-tables';
	import { isModalOpenStore } from '$lib/stores/modalState';
	import { rowDataStore } from '$lib/stores/rowData';
	import CreateRequestModal from '../CreateRequestModal.svelte';
	export let rowData: { carType: string; carSeat: number; isAvailable: boolean };
	export let refTable: Tabulator;

	let openModal = false;

	function handleReserveClick() {
		isModalOpenStore.set(true);
		rowDataStore.set({ ...rowData, refTable });
	}
</script>

<div class="flex justify-center gap-4">
	<button
		class="btn btn-sm btn-secondary"
		disabled={!rowData.isAvailable}
		on:click={handleReserveClick}>จอง</button
	>
</div>
