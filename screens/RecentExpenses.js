/* eslint-disable prettier/prettier */
import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import ExpensesOutput from '../components/ExpensesOutput/ExpensesOutput';
import { ExpensesContext } from '../store/expenses-context';
import { AuthContext } from '../store/auth-context';
import { getDateMinusDays } from '../util/date';
import { fetchExpenses } from '../util/https';
import { login } from '../util/auth';
import LoadingOverlay from '../components/UI/LoadingOverlay';
import ErrorOverlay from '../components/UI/ErrorOverlay';

function RecentExpense() {
	const [isFetching, setIsFetching] = useState(true);
	const [error, setError] = useState();
	const expensesCtx = useContext(ExpensesContext);
	const authCtx = useContext(AuthContext);
	const token = authCtx.token;
	const password = authCtx.password;
	const email = authCtx.email;

	useEffect(() => {
		async function getExpenses() {
			setIsFetching(true);
			try {
				const expenses = await fetchExpenses({ token });
				expensesCtx.setExpenses(expenses);
			} catch (err) {	
				if(err.response.status === 401)	{
					try {
						const { token : newToken, emailId } = await login(email, password);
						//console.log("newToken",newToken)
						authCtx.authenticate(newToken, emailId, password, async ()=>{
							const expenses = await fetchExpenses({ token:newToken });
							//console.log("expenses",expenses)
							expensesCtx.setExpenses(expenses);
							setError(null);
						});
					} catch (err1) {
						console.log('step3');
						console.log('error',err1);
					}
				}
				setError('Could not fetch');
			}
			setIsFetching(false);
		}
		getExpenses();
	}, []);

	async function errorHandler() {
		try {
			setIsFetching(true);
			const { token : newToken, emailId } = await login(email, password);
			//console.log("newToken",newToken)
			authCtx.authenticate(newToken, emailId, password, async ()=>{
				const expenses = await fetchExpenses({ token:newToken });
				//console.log("expenses",expenses)
				expensesCtx.setExpenses(expenses);
				setError(null);
				setIsFetching(false);
			});
		} catch (err1) {
			console.log('step3');
			console.log('error',err1);
			setIsFetching(false);
		}
	}

	if (error && !isFetching) {
		return <ErrorOverlay message={error} onConfirm={errorHandler}/>;
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
