export type TxType = 'expense' | 'income';


export interface Transaction {
id: number;
type: TxType;
amount: number;
category: string;
date: string; // YYYY-MM-DD
description?: string;
}


export interface TxStatsCategory { category: string; total: number }
export interface TxMonthly { month: string; income: number; expense: number }