/* eslint-disable prettier/prettier */
import axios from 'axios';

const BACKEND_URL = 'https://expense-tracker-6bf16-default-rtdb.firebaseio.com';

export async function storeExpense(expenseData, accessToken) {
	const response = await axios.post(
		BACKEND_URL + '/expenses.json?auth=' + accessToken,
		expenseData
	);
	const id = response.data.name;
	return id;
}

export async function fetchExpenses({ token }) {
	const response = await axios.get(
		BACKEND_URL + '/expenses.json?auth=' + token
	);
	const expenses = [];
	for (const key in response.data) {
		const expenseObj = {
			id: key,
			description: response.data[key].description,
			amount: response.data[key].amount,
			date: new Date(response.data[key].date),
			email: response.data[key].email,
		};
		expenses.push(expenseObj);
	}
	return expenses;
}

export function updateExpense(id, expenseData, accessToken) {
	return axios.put(
		BACKEND_URL + `/expenses/${id}.json?auth=${accessToken}`,
		expenseData
	);
}

export function deleteExpense(id, accessToken) {
	return axios.delete(BACKEND_URL + `/expenses/${id}.json?auth=` + accessToken);
}
