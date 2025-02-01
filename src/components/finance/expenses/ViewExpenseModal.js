import { DialogPanel, DialogTitle } from '@headlessui/react'
import { DocumentArrowDownIcon, EyeIcon, UserCircleIcon, XMarkIcon } from '@heroicons/react/24/outline'
import React from 'react'

const ViewExpenseModal = ({ onClose }) => {

	const syllabus = []



	return (
		<>
			<div className="fixed inset-0" />
			<div className="fixed inset-0 overflow-hidden">
				<div className="absolute inset-0 overflow-hidden">
					<div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
						<DialogPanel
							transition
							className="pointer-events-auto w-screen max-w-6xl transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
							>
							<div className="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl">
								<div className="flex min-h-0 flex-1 flex-col">
									<div className="bg-purple-900 px-3 py-3 sm:px-6">
										<div className="flex items-start justify-between">
											<DialogTitle className=" text-base font-semibold text-white">
												View Class Info
											</DialogTitle>
											<div className="ml-3 flex h-7 items-center">
												<button
													type="button"
													onClick={onClose}
													className="relative rounded-md text-white hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
												>
													<span className="absolute -inset-2.5" />
													<span className="sr-only">Close panel</span>
													<XMarkIcon aria-hidden="true" className="size-6" />
												</button>
											</div>
										</div>
									</div>
									<div className="relative flex-1 px-6 py-6 sm:px-6 overflow-y-auto">
										<div className="form-content">
											<ul
												role="list"
												className="grid grid-cols-1 gap-x-4 gap-y-4"
											>
												<li className="overflow-hidden rounded-xl border border-gray-300">
													<div className="flex items-center justify-between gap-x-4 px-4 pt-4">
														<div className="flex items-center item-title-blk">
															<div className="inline-flex rounded-lg p-3 bg-teal-50 text-purple-500 ring-4 ring-white">
																<UserCircleIcon
																	aria-hidden="true"
																	className="size-5"
																/>
															</div>
															<div className="text-lg pl-4 font-medium text-gray-900">
																Expense Details
															</div>
														</div>
													</div>

													<div className="px-4 py-4 text-sm/6">

														<dl className="grid auto-cols-auto grid-cols-4 gap-4 w-full">
															<div className="content-item pb-2 border-b border-gray-300">
																<dt className="text-sm/6 text-gray-500">
																	Name
																</dt>
																<dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">

																</dd>
															</div>
															<div className="content-item pb-2 border-b border-gray-300">
																<dt className="text-sm/6 text-gray-500">
																	Invoice Number
																</dt>
																<dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">

																</dd>
															</div>
															<div className="content-item pb-2 border-b border-gray-300">
																<dt className="text-sm/6 text-gray-500">
																	Purchase Date
																</dt>
																<dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">

																</dd>
															</div>
															<div className="content-item pb-2 border-b border-gray-300">
																<dt className="text-sm/6 text-gray-500">
																	Department
																</dt>
																<dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">

																</dd>
															</div>

															<div className="content-item pb-2 border-b border-gray-300">
																<dt className="text-sm/6 text-gray-500">
																	Category
																</dt>
																<dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">

																</dd>
															</div>

															<div className="content-item pb-2 border-b border-gray-300">
																<dt className="text-sm/6 text-gray-500">
																	Supplier
																</dt>
																<dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">

																</dd>
															</div>

															<div className="content-item pb-2 border-b border-gray-300">
																<dt className="text-sm/6 text-gray-500">
																	Pur. Qty
																</dt>
																<dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">

																</dd>
															</div>

															<div className="content-item pb-2 border-b border-gray-300">
																<dt className="text-sm/6 text-gray-500">
																	Amount
																</dt>
																<dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">

																</dd>
															</div>

															<div className="content-item pb-2 border-b border-gray-300">
																<dt className="text-sm/6 text-gray-500">
																	Purchase User
																</dt>
																<dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">

																</dd>
															</div>

															<div className="content-item pb-2 border-b border-gray-300">
																<dt className="text-sm/6 text-gray-500">
																	Created By
																</dt>
																<dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">

																</dd>
															</div>

															<div className="content-item pb-2 border-b border-gray-300">
																<dt className="text-sm/6 text-gray-500">
																	Bank Account
																</dt>
																<dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">

																</dd>
															</div>

															<div className="content-item pb-2 border-b border-gray-300 sm:col-span-2">
																<dt className="text-sm text-gray-500">
																	Description
																</dt>
																<dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">

																</dd>
															</div>
														</dl>
													</div>
												</li>


												<li
													className="overflow-hidden rounded-xl border border-gray-300"
												>
													<div className="flex items-center justify-between gap-x-4 px-4 pt-4">
														<div className="flex items-center item-title-blk">
															<div className="inline-flex rounded-lg p-3 bg-teal-50 text-purple-500 ring-4 ring-white">
																<UserCircleIcon
																	aria-hidden="true"
																	className="size-5"
																/>
															</div>
															<div className="text-lg pl-4 font-medium text-gray-900">
																Attachments
															</div>
														</div>
													</div>

													<div className="px-4 py-4 text-sm/6">
														<ul
															role="list"
															className="grid grid-cols-4 gap-x-6 gap-y-8"
														>
															{syllabus.map((item, index) => (
																<li
																	key={item.id}
																	className="overflow-hidden rounded-xl border border-gray-300"
																>
																	<div className="flex items-center justify-between gap-x-4 px-4 py-4">
																		<div className="flex items-center item-title-blk">
																			<div className="inline-flex rounded-lg p-3 bg-teal-50 text-teal-700 ring-4 ring-white">
																				<DocumentArrowDownIcon
																					aria-hidden="true"
																					className="size-5"
																				/>
																			</div>
																			<div className="flex flex-col text-lg pl-4 font-medium text-gray-900">
																				<span>{item.subject}</span>{' '}
																				{/* Displaying the subject name */}
																			</div>
																		</div>
																		<a href="#" className="text-gray-400">
																			<EyeIcon
																				aria-hidden="true"
																				className="size-5"
																			/>
																		</a>
																	</div>
																</li>
															))}
														</ul>
													</div>
												</li>
											</ul>
										</div>
									</div>
								</div>
								<div className="flex shrink-0 px-4 py-4 bg-gray-100 w-full justify-end">
									<button
										onClick={onClose}
										className="ml-4 inline-flex justify-center rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500"
									>
										Close
									</button>
								</div>
							</div>
						</DialogPanel>
					</div>
				</div>
			</div>
		</>
	)
}

export default ViewExpenseModal
