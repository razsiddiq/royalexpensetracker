/* eslint-disable prettier/prettier */
import * as React from 'react';
import { useContext } from 'react';
import ExpensesOutput from '../components/ExpensesOutput/ExpensesOutput';
import { ExpensesContext } from '../store/expenses-context';

function UserWiseExpenses({route}) {
	const expensesCtx = useContext(ExpensesContext);
	const userEmail = route.params?.email;
	return (
		<ExpensesOutput
			expenses={expensesCtx.expenses}
			expensesPeriod={'Total'}
			fallbackText={'No expenses registered.'}
			userEmail={userEmail}
		/>
	);
}

export default UserWiseExpenses;
