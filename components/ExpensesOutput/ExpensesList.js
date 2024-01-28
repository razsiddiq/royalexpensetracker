/* eslint-disable prettier/prettier */
import * as React from 'react';
import { FlatList } from 'react-native';
import ExpenseItem from './ExpenseItem';

function renderExpenseItem(itemData) {
	return <ExpenseItem {...itemData.item} />;
}

function ExpensesSummary({ expenses }) {
	return (
		<FlatList
			data={expenses}
			renderItem={renderExpenseItem}
			keyExtractor={(item) => item.id}
		/>
	);
}

export default ExpensesSummary;