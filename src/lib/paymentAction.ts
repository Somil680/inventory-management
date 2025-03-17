'use server'

import prisma from '../lib/prisma'
import { BankAccountInput, BankTransaction } from './type'

export async function fetchBankAccount() {
  try {
    return await prisma.payment.findMany()
  } catch (error) {
    console.log('🚀 ~ fetchProperties ~ error:', error)
    throw new Error('Failed to fetch properties')
  }
}
export async function fetchBankTransaction(id : string) {
  try {
    return await prisma.bank_transaction.findMany({
      where: {
        OR: [
          {
            from_bank_id: id,
          },
          {
            to_bank_id: id,
          },
        ],
      },
      select: {
        id: true,
        description: true,
        balance: true,
        from_bank_id: true,
        to_bank_id: true,
        transaction_type: true,
        payment: true,
        payment_bank_transaction_from_bank_idTopayment :true,
      },
    })
  } catch (error) {
    console.log('🚀 ~ fetchProperties ~ error:', error)
    throw new Error('Failed to fetch properties')
  }
}
// * THIS WILL CREATE A BANK ACCOUNT
export async function createBankAccount(inputItem: BankAccountInput) {
  if (!inputItem || typeof inputItem !== 'object') {
    throw new Error('Invalid input: Product data is required')
  }
  try {
    console.log('🚀 ~ createProduct ~ inputItem:', inputItem)
    return await prisma.payment.create({
      data: {
        id: inputItem.id,
        account_name: inputItem.account_name,
        balance: inputItem.balance,
        account_number: inputItem.account_number ?? 0,
        IFSC_code: inputItem.IFSC_code,
        upi_number: inputItem.upi_number,
        account_holder_name: inputItem.account_holder_name,
      },
    })
  } catch (error) {
    console.error('🚀 ~ createProduct ~ error:', error)
    throw new Error('Failed to create product')
  }
}
// * THIS WILL CREATE A BANK TRANSACTION
export async function createBankAccountTransaction(inputItem: BankTransaction) {
  if (!inputItem || typeof inputItem !== 'object') {
    throw new Error('Invalid input: Product data is required')
  }
  try {
    console.log('🚀 ~ createProduct ~ inputItem:', inputItem)
    return await prisma.bank_transaction.create({
      data: {
        id: inputItem.id,
        from_bank_id:inputItem.from_bank_id,
        to_bank_id: inputItem.to_bank_id,
        transaction_type: inputItem.transaction_type,
        description: inputItem.description,
        // date: inputItem.date,
        balance: Number(inputItem.balance),
      },
    })
  } catch (error) {
    console.error('🚀 ~ createProduct ~ error:', error)
    throw new Error('Failed to create product')
  }
}
