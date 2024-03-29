/* eslint-disable prettier/prettier */
import * as React from 'react';
import { useContext } from 'react';
import ExpensesOutput from '../components/ExpensesOutput/ExpensesOutput';
import { ExpensesContext } from '../store/expenses-context';

function AllExpenses({route}) {
	const expensesCtx = useContext(ExpensesContext);
	return (
		<ExpensesOutput
			expenses={expensesCtx.expenses}
			expensesPeriod={'Total'}
			fallbackText={'No expenses registered.'}
			userEmail={""}
		/>
	);
}

export default AllExpenses;
