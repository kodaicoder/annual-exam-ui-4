<script>
	// @ts-nocheck
	import { createEventDispatcher } from 'svelte';

	import { isModalOpenStore } from '$lib/stores/modalState';
	import { rowDataStore } from '$lib/stores/rowData';
	import { filterStore } from '$lib/stores/filterData';

	import Swal from 'sweetalert2';

	import Select from 'svelte-select';
	import { TabulatorFull as Tabulator } from 'tabulator-tables';
	import { datePicker } from 'svelte-flatpickr-plus';
	import { Thai } from 'flatpickr_plus/dist/l10n/th.js';

	const dispatch = createEventDispatcher();

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

	let affiliationText;
	let companyText;
	let requestForm;

	const itemId = 'id';
	const label = 'data';
	const employees = [
		{
			id: 1,
			data: '0001 - นาย สมชาย ใจดี',
			company: 'บริษัท ทดสอบ จำกัด',
			affiliation: 'สังกัด ทดสอบ'
		},
		{
			id: 2,
			data: '0002 - นาย สมหญิง ใจดี',
			company: 'บริษัท ทดสอบ จำกัด2',
			affiliation: 'สังกัด ทดสอบ2'
		},
		{
			id: 3,
			data: '0003 - นาย สมศรี ใจดี',
			company: 'บริษัท ทดสอบ จำกัด3',
			affiliation: 'สังกัด ทดสอบ3'
		},
		{
			id: 4,
			data: '0004 - นาย สมศักดิ์ ใจดี',
			company: 'บริษัท ทดสอบ จำกัด4',
			affiliation: 'สังกัด ทดสอบ4'
		}
	];

	const companies = [
		{ data: 'บริษัท ทดสอบ จำกัด1' },
		{ data: 'บริษัท ทดสอบ จำกัด2' },
		{ data: 'บริษัท ทดสอบ จำกัด3' },
		{ data: 'บริษัท ทดสอบ จำกัด4' }
	];

	const approvers = [
		{ data: 'ผู้อนุมัติ 1' },
		{ data: 'ผู้อนุมัติ 2' },
		{ data: 'ผู้อนุมัติ 3' },
		{ data: 'ผู้อนุมัติ 4' }
	];

	const destinationStart = [
		{ data: 'สำนักงานใหญ่' },
		{ data: 'สำนักงานใหญ่ 2' },
		{ data: 'สำนักงานใหญ่ 3' },
		{ data: 'สำนักงานใหญ่ 4' }
	];

	const destinationEnd = [
		{ data: 'สาขา' },
		{ data: 'สาขา 2' },
		{ data: 'สาขา 3' },
		{ data: 'สาขา 4' }
	];

	const dateOptions = {
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
		enableTime: true,
		noCalendar: true,
		dateFormat: 'H:i',
		time_24hr: true
	};

	$: console.log($rowDataStore);
	$: console.log($filterStore);

	function closeModal() {
		isModalOpenStore.set(false);
		rowDataStore.set(null);
	}

	function handleEmployeesChange(ev) {
		affiliationText.textContent = ev.detail.affiliation;
		companyText.textContent = ev.detail.company;
	}

	function saveForm(data) {
		requestForm.reportValidity();
		Swal.fire({
			title: 'คุณต้องการบันทึกแบบฟอร์มหรือไม่?',
			showDenyButton: true,
			confirmButtonText: 'บันทึก',
			denyButtonText: `ยกเลิก`
		}).then((result) => {
			if (result.isConfirmed) {
				//TODO: send data to backend
				const sendData = { ...$filterStore, ...data };
				console.log(sendData);

				Swal.fire('บันทึกสำเร็จ!', '', 'success');
				dispatchSuccessSubmitEvent();
				closeModal();
			}
		});
	}

	function sendForm(data) {
		Swal.fire({
			title: 'คุณต้องการส่งคำขอหรือไม่?',
			showDenyButton: true,
			confirmButtonText: 'ส่งคำขอ',
			denyButtonText: `ยกเลิก`
		}).then((result) => {
			/* Read more about isConfirmed, isDenied below */
			if (result.isConfirmed) {
				if (result.isConfirmed) {
					//TODO: send data to backend
					const sendData = { ...$filterStore, ...data };
					console.log(sendData);

					Swal.fire('ส่งคำขอสำเร็จ!', '', 'success');
					dispatchSuccessSubmitEvent();
					closeModal();
				}
			}
		});
	}

	function handleSubmit(event) {
		event.preventDefault();

		const formData = new FormData(event.currentTarget);
		let formDataObject = Object.fromEntries(formData.entries());
		if (event.submitter.value === 'save') {
			saveForm(formDataObject);
		} else if (event.submitter.value === 'send') {
			sendForm(formDataObject);
		}
		console.log(event);
		console.log(event.target);
	}

	function dispatchSuccessSubmitEvent() {
		dispatch('successSubmit', {
			status: 'success',
			data: { ...$rowDataStore }
		});
	}
</script>

{#if $rowDataStore && $filterStore}
	<dialog class="modal" class:modal-open={$isModalOpenStore}>
		<div class="modal-box w-11/12 max-w-7xl h-screen max-h-[calc(100vh-2rem)]">
			<h2 class=" absolute text-3xl font-bold">สร้างรายการ</h2>

			<div class="modal-action mt-0">
				<form method="dialog">
					<button class="btn btn-sm btn-outline btn-error" on:click={closeModal}>กลับ</button>
				</form>
				<button
					class="btn btn-sm btn-outline btn-secondary"
					type="submit"
					value="save"
					formaction="save"
					form="reservedDetailForm"
				>
					บันทึก
				</button>
				<button
					class="btn btn-sm btn-secondary"
					type="submit"
					value="send"
					formaction="send"
					form="reservedDetailForm">ส่งคำขอ</button
				>
			</div>
			<form
				id="reservedDetailForm"
				name="reservedDetailForm"
				bind:this={requestForm}
				on:submit={handleSubmit}
				method="POST"
			>
				<div class="indicator w-full mt-10">
					<div class=" absolute -top-2 left-4 bg-white z-10 px-2">
						<b> กรอกรายละเอียดการจอง</b>
					</div>

					<div class="card border w-full rounded-lg shadow-lg">
						<div class="card-body grid gap-4">
							<div class="grid grid-cols-6">
								<div class="flex gap-2 col-span-2 items-center">
									<label class="form-control relative max-w-xs">
										<div class="label">
											<span class="label-text">วันที่ไป</span>
										</div>
										<input
											use:datePicker={dateOptions}
											readonly
											placeholder="dd/mm/yyyy"
											class="input input-bordered w-40 !text-black"
											value={$filterStore.startDate}
											disabled
										/>
										<span class="absolute pointer-events-none bottom-4 right-3 z-10">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="15"
												height="15"
												viewBox="0 0 24 24"
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
											value={$filterStore.startTime}
											class="input input-bordered w-28 !text-black !cursor-not-allowed"
											disabled
										/>
										<span class="absolute pointer-events-none bottom-4 right-3"
											><svg
												xmlns="http://www.w3.org/2000/svg"
												width="15"
												height="15"
												viewBox="0 0 512 512"
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
											use:datePicker={dateOptions}
											readonly
											placeholder="dd/mm/yyyy"
											value={$filterStore.endDate}
											class="input input-bordered w-40 !text-black"
											disabled
										/>
										<span class="absolute pointer-events-none bottom-4 right-3 z-10">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="15"
												height="15"
												viewBox="0 0 24 24"
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
											value={$filterStore.endTime}
											class="input input-bordered w-28 !text-black !cursor-not-allowed"
											disabled
										/>
										<span class="absolute pointer-events-none bottom-4 right-3"
											><svg
												xmlns="http://www.w3.org/2000/svg"
												width="15"
												height="15"
												viewBox="0 0 512 512"
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
										name="carSeat"
										class="select select-bordered w-32 !text-black"
										value={+$filterStore.carSeat}
										disabled
									>
										<option value="" selected hidden>------</option>
										{#each carSeats as carSeat}
											<option class="" value={carSeat.seat}>{carSeat.seat} ท่าน</option>
										{/each}
									</select>
								</label>

								<div class="form-control flex gap-2 mx-auto">
									<div class="label">
										<span class="label-text">สถานะ</span>
									</div>

									<div
										class="badge px-8 py-4 {$rowDataStore.isAvailable
											? 'badge-primary'
											: 'badge-error'}"
									>
										{$rowDataStore.isAvailable ? 'ว่าง' : 'มีรายการรออนุมัติ'}
									</div>
								</div>
							</div>
							<div class="grid grid-cols-6">
								<div class="form-control flex col-span-2 items-start">
									<div class="label">
										<span class="label-text">ประเภทรถ</span>
									</div>

									<p>{$rowDataStore.carType} {$rowDataStore.carSeat}</p>
								</div>
								<div class="form-control flex">
									<div class="label">
										<span class="label-text">เลขที่อ้างอิง</span>
									</div>

									<b>xxxxxxxxxxxxxxxx</b>
								</div>
								<div class="flex-grow"></div>
							</div>
						</div>
					</div>
				</div>

				<div class="indicator w-full mt-10">
					<div class=" absolute -top-2 left-4 bg-white z-10 px-2">
						<b> รายละเอียดผู้ขอใช้รถ</b>
					</div>

					<div class="card border w-full rounded-lg shadow-lg">
						<div class="card-body grid gap-4">
							<div class="grid grid-cols-6">
								<!-- svelte-ignore a11y-label-has-associated-control -->
								<label class="form-control relative col-span-2 max-w-xs">
									<div class="label">
										<span class="label-text">รหัส-ชื่อพนักงาน<span class="text-error">*</span></span
										>
									</div>
									<Select
										class="z-30"
										name="employee"
										{itemId}
										{label}
										items={employees}
										placeholder={'รหัส-ชื่อพนักงาน'}
										on:change={handleEmployeesChange}
									/>
								</label>

								<!-- <input
										type="text"
										placeholder="รหัส-ชื่อพนักงาน"
										class="input input-bordered w-full"
										required
									/> -->

								<div class="grid grid-cols-2 gap-2 col-span-2">
									<div class="flex form-control label items-start">
										<span class="label-text">สังกัด</span>
										<div class="h-full flex items-center">
											<p bind:this={affiliationText}>-</p>
										</div>
									</div>

									<div class="flex form-control label items-start">
										<span class="label-text">บริษัท</span>
										<div class="h-full flex items-center">
											<p bind:this={companyText}>-</p>
										</div>
									</div>
								</div>

								<label class="form-control relative col-span-2 max-w-xs">
									<div class="label">
										<span class="label-text">เบอร์โทรศัพท์<span class="text-error">*</span></span>
									</div>
									<input
										name="phoneNumber"
										type="tel"
										placeholder="xxxxxxxxx"
										class="input input-bordered w-full"
										required
									/>
								</label>
							</div>
							<div class="grid grid-cols-6">
								<label class="form-control relative col-span-2 max-w-xs">
									<div class="label">
										<span class="label-text">วัตถุประสงค์<span class="text-error">*</span></span>
									</div>
									<input
										name="objective"
										type="text"
										placeholder="วัตถุประสงค์"
										class="input input-bordered w-full"
										required
									/>
								</label>

								<label class="form-control relative col-span-2 max-w-xs">
									<div class="label">
										<span class="label-text">ผู้จอง</span>
									</div>
									<input
										name="requester"
										type="text"
										placeholder=""
										disabled={true}
										class="input input-bordered w-full !text-black"
										value="ณัชพล เมฆลาย"
									/>
								</label>
							</div>
							<div class="grid grid-cols-6">
								<label class="form-control relative col-span-2 max-w-xs">
									<div class="label">
										<span class="label-text">
											บริษัทที่รับผิดชอบค่าใช้จ่าย<span class="text-error">*</span>
										</span>
									</div>
									<select name="company" class="select select-bordered w-full" required>
										<option value="" selected hidden>------</option>
										{#each companies as company}
											<option value={company.data}>{company.data}</option>
										{/each}
									</select>
								</label>

								<label class="form-control relative col-span-2 max-w-xs">
									<div class="label">
										<span class="label-text"
											>ผู้อนุมัติการเดินทาง (ผอ. ต้นสังกัดขึ้นไป)<span class="text-error">*</span
											></span
										>
									</div>
									<select name="approver" class="select select-bordered w-full" required>
										<option value="" selected hidden>------</option>
										{#each approvers as approver}
											<option value={approver.data}>{approver.data}</option>
										{/each}
									</select>
								</label>

								<div class="form-control relative col-span-2 max-w-xs">
									<label class="label cursor-pointer justify-start gap-2 mt-10">
										<input name="isApproveViaSystem" type="checkbox" class="checkbox" />
										<span class="label-text">อนุมัติผ่านระบบ</span>
									</label>
								</div>
							</div>
							<div class="grid grid-cols-6">
								<label class="form-control relative col-span-2 max-w-xs">
									<div class="label">
										<span class="label-text">
											ต้นทาง<span class="text-error">*</span>
										</span>
									</div>
									<select name="startDestination" class="select select-bordered w-full" required>
										<option value="" selected hidden>------</option>
										{#each destinationStart as destination}
											<option value={destination.data}>{destination.data}</option>
										{/each}
									</select>
								</label>

								<label class="form-control relative col-span-2 max-w-xs">
									<div class="label">
										<span class="label-text">ปลายทาง<span class="text-error">*</span></span>
									</div>
									<select name="endDestination" class="select select-bordered w-full" required>
										<option value="" selected hidden>------</option>
										{#each destinationEnd as destination}
											<option value={destination.data}>{destination.data}</option>
										{/each}
									</select>
								</label>
							</div>
							<div class="grid">
								<label class="form-control">
									<div class="label">
										<span class="label-text"
											>คณะผู้เดินทาง (รายชื่อผู้ใช้รถ)<span class="text-error">*</span></span
										>
									</div>
									<textarea
										name="travelerGroup"
										class="textarea textarea-bordered h-8"
										placeholder="คณะผู้เดินทาง"
										required
									></textarea>
								</label>
							</div>
							<div class="grid">
								<label class="form-control">
									<div class="label">
										<span class="label-text">หมายเหตุ (ถ้ามี)</span>
									</div>
									<textarea
										name="remark"
										class="textarea textarea-bordered h-8"
										placeholder="คณะผู้เดินทาง"
									></textarea>
								</label>
							</div>
						</div>
					</div>
				</div>
			</form>
		</div>
	</dialog>
{/if}
