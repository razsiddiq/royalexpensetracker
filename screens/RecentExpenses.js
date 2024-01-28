/* eslint-disable prettier/prettier */
import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import ExpensesOutput from '../components/ExpensesOutput/ExpensesOutput';
import { ExpensesContext } from '../store/expenses-context';
import { AuthContext } from '../store/auth-context';
import { getDateMinusDays } from '../util/date';
import { fetchExpenses } from '../util/https';
import LoadingOverlay from '../components/UI/LoadingOverlay';
import ErrorOverlay from '../components/UI/ErrorOverlay';

function RecentExpense() {
	const [isFetching, setIsFetching] = useState(true);
	const [error, setError] = useState();
	const expensesCtx = useContext(ExpensesContext);
	const authCtx = useContext(AuthContext);
	const token = authCtx.token;

	useEffect(() => {
		async function getExpenses() {
			setIsFetching(true);
			try {
				const expenses = await fetchExpenses({ token });
				expensesCtx.setExpenses(expenses);
			} catch (error) {
				setError('Could not fetch');
			}
			setIsFetching(false);
		}
		getExpenses();
	}, []);

	// function errorHandler() {
	// 	setError(null);
	// }

	if (error && !isFetching) {
		return <ErrorOverlay message={error} />; //onConfirm={errorHandler}
	}
	if (isFetching) {
		return <LoadingOverlay />;
	}

	const recentExpenses = expensesCtx.expenses.filter((expense) => {
		const today = new Date();
		const date7DaysAgo = getDateMinusDays(today, 7);
		return expense.date >= date7DaysAgo && expense.date <= today;
	});
	return (
		<ExpensesOutput
			expenses={recentExpenses}
			expensesPeriod={'Last 7 Days'}
			fallbackText={'No expenses registered for the last 7 days.'}
		/>
	);
}

export default RecentExpense;
