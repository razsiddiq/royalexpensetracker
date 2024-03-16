/* eslint-disable prettier/prettier */
import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';

import ExpensesList from './ExpensesList';
import ExpensesSummary from './ExpensesSummary';
import { GlobalStyles } from '../../constants/styles';

function ExpensesOutput({ expenses, expensesPeriod, fallbackText, userEmail = '' }) {
	let content = <Text style={styles.infoText}>{fallbackText}</Text>;
	const filteredExpeses = expenses.filter((item)=>userEmail !== '' ? userEmail === item.email : item);
	if (filteredExpeses.length > 0) {
		content = <ExpensesList expenses={filteredExpeses} />;
	}
	return (
		<View style={styles.container}>
			<ExpensesSummary expenses={filteredExpeses} periodName={expensesPeriod} />
			{content}
		</View>
	);
}

export default ExpensesOutput;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 24,
		paddingTop: 24,
		paddingBottom: 0,
		backgroundColor: GlobalStyles.colors.primary700,
	},
	infoText: {
		color: 'white',
		fontSize: 16,
		textAlign: 'center',
		marginTop: 32,
	},
});
