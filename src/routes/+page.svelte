<script lang="ts">
	import ResevereButton from '$lib/components/Tabulator/ResevereButton.svelte';
	import { onMount } from 'svelte';
	import { TabulatorFull as Tabulator } from 'tabulator-tables';
	import { datePicker } from 'svelte-flatpickr-plus';
	import { Thai } from 'flatpickr_plus/dist/l10n/th.js';
	import CreateRequestModal from '$lib/components/CreateRequestModal.svelte';
	import { filterStore } from '$lib/stores/filterData';

	const carSeats = [
		{
			seat: 1
		},
		{
			seat: 2
		},
		{
			seat: 3
		},
		{
			seat: 4
		},
		{
			seat: 5
		},
		{
			seat: 6
		},
		{
			seat: 7
		}
	];
	let carsData = [
		{
			id: 1,
			carType: 'รถเก๋ง',
			carSeat: 5,
			isAvailable: true
		},
		{
			id: 2,
			carType: 'รถตู้',
			carSeat: 7,
			isAvailable: true
		},
		{
			id: 3,
			carType: 'รถตู้',
			carSeat: 5,
			isAvailable: false
		},
		{
			id: 4,
			carType: 'รถกระบะ',
			carSeat: 7,
			isAvailable: true
		},
		{
			id: 5,
			carType: 'รถตู้',
			carSeat: 5,
			isAvailable: false
		},
		{
			id: 6,
			carType: 'รถเก๋ง',
			carSeat: 7,
			isAvailable: true
		},
		{
			id: 7,
			carType: 'รถตู้',
			carSeat: 5,
			isAvailable: false
		},
		{
			id: 8,
			carType: 'รถตู้',
			carSeat: 7,
			isAvailable: false
		}
	];
	const dateOptions = {
		allowInput: true,
		dateFormat: 'Z',
		altFormat: 'd/M/Y',
		altInput: true,
		ariaDateFormat: 'd/M/Y',
		minDate: 'today',
		maxDate: '2033-12',
		locale: Thai,
		useLocaleYear: true
	};
	const timeOptions = {
		allowInput: true,
		enableTime: true,
		noCalendar: true,
		dateFormat: 'H:i',
		time_24hr: true
	};

	let tableComponent: HTMLDivElement;
	let tabulatorTable: Tabulator;

	let shownTable = false;

	let carSeatSelectionFilter: HTMLSelectElement;

	onMount(() => {
		buildTable();
	});

	function buildTable() {
		tabulatorTable = new Tabulator(tableComponent, {
			layout: 'fitColumns',
			placeholder: 'ไม่พบข้อมูล',
			data: carsData, //link data to table
			reactiveData: true, //enable data reactivity
			columns: [
				{ title: 'Id', field: 'id', visible: false, clipboard: false },
				{ title: 'ประเภทรถ', field: 'carType', hozAlign: 'center', headerHozAlign: 'center' },
				{
					title: 'จำนวนที่นั่ง',
					field: 'carSeat',
					hozAlign: 'center',
					headerHozAlign: 'center'
				},

				{
					title: 'สถานะ',
					hozAlign: 'center',
					headerHozAlign: 'center',
					cssClass: 'flex justify-center gap-4',
					formatter: (cell: any, formatterParams: any, onRendered: any) => {
						return cell.getRow().getData().isAvailable ? `<p>ว่าง</p>` : `<p>มีรายการรออนุมัติ</p>`;
					}
				},
				{
					title: 'Action',
					hozAlign: 'center',
					headerHozAlign: 'center',
					cssClass: 'flex justify-center gap-4',
					headerSort: false,
					formatter: buildActionsSection
				}
			]
		});

		function buildActionsSection(cell: any, formatterParams: any, onRendered: any) {
			return onRendered(function () {
				let reservereButton = new ResevereButton({
					target: cell.getElement(),
					props: {
						rowData: cell.getRow().getData(),
						refTable: tabulatorTable
					}
				});
			});
		}
	}

	function resetForm() {
		carSeatSelectionFilter.value = '';
	}

	function submitHandler(event: {
		preventDefault: () => void;
		currentTarget: HTMLFormElement | undefined;
	}) {
		event.preventDefault();
		shownTable = true;

		const formData = new FormData(event.currentTarget);
		let formDataObject = Object.fromEntries(formData.entries());
		// Set the formDataArray to the store
		filterStore.set(formDataObject);
	}

	function handleSuccessSubmit(event: { detail: { data: { id: number } } }) {
		console.log('from Page', event.detail);
		if (event.detail.data) {
			const carUpdate = carsData.find((car) => car.id === event.detail.data.id);
			console.log(carUpdate);
			if (carUpdate) {
				carUpdate.isAvailable = false;

				// Find the index of the car that was updated
				const index = carsData.findIndex((car) => car.id === event.detail.data.id);

				// Replace the old car object with the updated car object
				if (index !== -1) {
					carsData[index] = carUpdate;
					console.log('UPDATED CARS DATA', carsData);
					tabulatorTable.setData(carsData);
				}
			}
		}
	}
</script>

<div>
	<h1 class="text-3xl font-bold">จองรถยนต์</h1>
</div>

<div class="indicator w-full mt-6">
	<div class=" absolute -top-2 left-4 bg-white z-10 px-2">
		<b> ตรวจสอบรายการรถยนต์ว่าง</b>
	</div>

	<div class="card border w-full rounded-lg shadow-lg">
		<form
			id="filterForm"
			name="filterForm"
			method="POST"
			on:reset={resetForm}
			on:submit={submitHandler}
		>
			<div class="card-body grid grid-cols-6">
				<div class="flex gap-2 col-span-2 items-center">
					<label class="form-control relative max-w-xs">
						<div class="label">
							<span class="label-text">วันที่ไป</span>
						</div>
						<input
							name="startDate"
							use:datePicker={dateOptions}
							readonly
							placeholder="dd/mm/yyyy"
							class="input input-bordered w-40"
							required
						/>
						<span class="absolute pointer-events-none bottom-4 right-3 z-10">
							<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
								><path
									fill="currentColor"
									d="M19 19H5V8h14m-3-7v2H8V1H6v2H5c-1.11 0-2 .89-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-1V1m-1 11h-5v5h5v-5Z"
								/></svg
							>
						</span>
					</label>
					<label class="form-control relative max-w-xs">
						<div class="label">
							<span class="label-text">เวลาไป</span>
						</div>
						<input
							name="startTime"
							use:datePicker={timeOptions}
							placeholder="--:--"
							readonly
							class="input input-bordered w-28"
							required
						/>
						<span class="absolute pointer-events-none bottom-4 right-3"
							><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 512 512"
								><path
									fill="currentColor"
									d="M271.514 95.5h-32v178.111l115.613 54.948l13.737-28.902l-97.35-46.268V95.5z"
								/><path
									fill="currentColor"
									d="M256 16C123.452 16 16 123.452 16 256s107.452 240 240 240s240-107.452 240-240S388.548 16 256 16Zm0 448c-114.875 0-208-93.125-208-208S141.125 48 256 48s208 93.125 208 208s-93.125 208-208 208Z"
								/></svg
							></span
						>
					</label>
				</div>
				<div class="flex gap-2 col-span-2 items-center">
					<label class="form-control relative max-w-xs">
						<div class="label">
							<span class="label-text">วันที่กลับ</span>
						</div>
						<input
							name="endDate"
							use:datePicker={dateOptions}
							readonly
							placeholder="dd/mm/yyyy"
							class="input input-bordered w-40"
							required
						/>
						<span class="absolute pointer-events-none bottom-4 right-3 z-10">
							<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
								><path
									fill="currentColor"
									d="M19 19H5V8h14m-3-7v2H8V1H6v2H5c-1.11 0-2 .89-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-1V1m-1 11h-5v5h5v-5Z"
								/></svg
							>
						</span>
					</label>
					<label class="form-control relative max-w-xs">
						<div class="label">
							<span class="label-text">เวลากลับ</span>
						</div>
						<input
							name="endTime"
							use:datePicker={timeOptions}
							placeholder="--:--"
							readonly
							class="input input-bordered w-28"
							required
						/>
						<span class="absolute pointer-events-none bottom-4 right-3"
							><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 512 512"
								><path
									fill="currentColor"
									d="M271.514 95.5h-32v178.111l115.613 54.948l13.737-28.902l-97.35-46.268V95.5z"
								/><path
									fill="currentColor"
									d="M256 16C123.452 16 16 123.452 16 256s107.452 240 240 240s240-107.452 240-240S388.548 16 256 16Zm0 448c-114.875 0-208-93.125-208-208S141.125 48 256 48s208 93.125 208 208s-93.125 208-208 208Z"
								/></svg
							></span
						>
					</label>
				</div>

				<label class="form-control max-w-xs mx-auto">
					<div class="label">
						<span class="label-text">จำนวนผู้เดินทาง</span>
					</div>
					<select
						bind:this={carSeatSelectionFilter}
						name="carSeat"
						class="select select-bordered w-32"
						required
					>
						<option value="" selected hidden>------</option>
						{#each carSeats as carSeat}
							<option value={carSeat.seat}>{carSeat.seat} ท่าน</option>
						{/each}
					</select>
				</label>

				<div class="flex gap-2 items-center mt-8 justify-center">
					<button type="reset" class="btn btn-outline btn-sm btn-error">ล้าง</button>
					<button class="btn btn-sm btn-secondary">ค้นหา</button>
				</div>
			</div>
		</form>
	</div>
</div>

<div class="indicator w-full mt-6 {shownTable ? 'block' : 'hidden'}">
	<div class=" absolute -top-2 left-4 bg-white z-10 px-2">
		<b> รายการรถยนต์ที่ว่าง</b>
	</div>

	<div class="card border w-full rounded-lg shadow-lg">
		<div class="card-body flex !flex-row justify-around items-center">
			<div class="w-full">
				<div bind:this={tableComponent}></div>
			</div>
		</div>
	</div>
</div>

<CreateRequestModal on:successSubmit={handleSuccessSubmit} />
