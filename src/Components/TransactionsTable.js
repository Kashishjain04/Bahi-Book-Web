import React, { useState } from "react";
import moment from "moment";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import DeleteOutlined from "@ant-design/icons/DeleteOutlined";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import ReceiptOutlined from "@mui/icons-material/ReceiptOutlined";
import useTheme from "@mui/material/styles/useTheme";
import Box from "@mui/material/Box";
import "../assets/css/TransactionsTable.css";

const TablePaginationActions = (props) => {
	const theme = useTheme();
	const { count, page, rowsPerPage, onPageChange } = props;

	const handleFirstPageButtonClick = (event) => {
		onPageChange(event, 0);
	};

	const handleBackButtonClick = (event) => {
		onPageChange(event, page - 1);
	};

	const handleNextButtonClick = (event) => {
		onPageChange(event, page + 1);
	};

	const handleLastPageButtonClick = (event) => {
		onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
	};

	return (
		<Box sx={{ flexShrink: 0, ml: 2.5 }}>
			<IconButton
				onClick={handleFirstPageButtonClick}
				disabled={page === 0}
				aria-label="first page"
			>
				{theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
			</IconButton>
			<IconButton
				onClick={handleBackButtonClick}
				disabled={page === 0}
				aria-label="previous page"
			>
				{theme.direction === "rtl" ? (
					<KeyboardArrowRight />
				) : (
					<KeyboardArrowLeft />
				)}
			</IconButton>
			<IconButton
				onClick={handleNextButtonClick}
				disabled={page >= Math.ceil(count / rowsPerPage) - 1}
				aria-label="next page"
			>
				{theme.direction === "rtl" ? (
					<KeyboardArrowLeft />
				) : (
					<KeyboardArrowRight />
				)}
			</IconButton>
			<IconButton
				onClick={handleLastPageButtonClick}
				disabled={page >= Math.ceil(count / rowsPerPage) - 1}
				aria-label="last page"
			>
				{theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
			</IconButton>
		</Box>
	);
};

const TransactionsTable = ({ transactions }) => {
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(5);

	// Avoid a layout jump when reaching the last page with empty rows.
	const emptyRows =
		page > 0 ? Math.max(0, (1 + page) * rowsPerPage - transactions.length) : 0;

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	return (
		<div className="transactionsTable">
			<TableContainer component={Paper}>
				<Table
					className="transactionsTable__table"
					sx={{ minWidth: 650 }}
					size="small"
					aria-label="a dense table"
				>
					<TableHead className="transactionsTable__head">
						<TableRow>
							<TableCell align="center">Date/Time</TableCell>
							<TableCell align="center">Amount</TableCell>
							<TableCell align="center">By</TableCell>
							<TableCell align="center">Description</TableCell>
							<TableCell align="center">Receipt</TableCell>
							<TableCell align="center">Delete</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{(rowsPerPage > 0
							? transactions.slice(
									page * rowsPerPage,
									page * rowsPerPage + rowsPerPage
							  )
							: transactions
						)?.map((transaction, index) => (
							<TableRow
								className={`transactionsTable__row i-${index % 2}`}
								key={transaction.id}
							>
								<TableCell align="center">
									{moment(transaction?.timestamp?._seconds * 1000).format(
										"MMM DD, YYYY - hh:mm A"
									)}
								</TableCell>
								<TableCell
									className={transaction.amount < 0 ? "gave" : "got"}
									align="center"
								>
									₹ {Math.abs(transaction.amount)}
								</TableCell>
								<TableCell align="center">{transaction.by}</TableCell>
								<TableCell style={{ width: "40%" }} align="center">
									{transaction.desc || "No Description"}
								</TableCell>
								<TableCell align="center">
									{transaction.receipt ? (
										<a
											rel="noreferrer"
											href={transaction.receipt}
											target="_blank"
										>
											<ReceiptOutlined className="trans__receipt" />
										</a>
									) : (
										"No Receipt"
									)}
								</TableCell>
								<TableCell align="center">
									<IconButton>
										<DeleteOutlined className="deleteBtn" />
									</IconButton>
								</TableCell>
							</TableRow>
						))}
						{emptyRows > 0 && (
							<TableRow style={{ height: 45 * emptyRows }}>
								<TableCell colSpan={6} />
							</TableRow>
						)}
					</TableBody>
					<TableFooter className="transactionsTable__footer">
						<TableRow>
							<TablePagination
								rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
								count={transactions.length}
								rowsPerPage={rowsPerPage}
								page={page}
								SelectProps={{
									inputProps: {
										"aria-label": "rows per page",
									},
									native: true,
								}}
								onPageChange={handleChangePage}
								onRowsPerPageChange={handleChangeRowsPerPage}
								ActionsComponent={TablePaginationActions}
							/>
						</TableRow>
					</TableFooter>
				</Table>
			</TableContainer>
		</div>
	);
};

export default TransactionsTable;
