'use client'

import { formatCurrencyINR, getDateRange } from '@/hooks/hook'
import {
  ArrowDown,
  ArrowUp,
  ReceiptIndianRupee,
  ShoppingCart,
  Wallet,
} from 'lucide-react'
// import { TrendingUp } from 'lucide-react'
// import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
// import {
//   ChartConfig,
//   ChartContainer,
//   ChartTooltip,
//   ChartTooltipContent,
// } from '@/components/ui/chart'
import { useQuery } from '@tanstack/react-query'
import { fetchBankAccount } from '@/lib/paymentAction'
import { Switch } from '@/components/ui/switch'
import { fetchExpenses } from '@/lib/ExpenseAction'

import { useState } from 'react'
// import { format } from 'date-fns'
import { fetchInvoicesByDate } from '@/lib/invoiceAction'
import DateRangeSelect from '@/components/DateRangeSelect'
import { format } from 'date-fns'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { CartesianGrid, XAxis, YAxis, Line, LineChart } from 'recharts'

const HomePage = () => {
  const [expenseRange, setExpenseRange] = useState('today')
  const [invoiceRange, setInvoiceRange] = useState('today')

  const { startDate: expenseStart, endDate: expenseEnd } =
    getDateRange(expenseRange)
  console.log('🚀 ~ HomePage ~ expenseEnd:', expenseEnd)
  console.log('🚀 ~ HomePage ~ expenseStart:', expenseStart)
  const { startDate: invoiceStart, endDate: invoiceEnd } =
    getDateRange(invoiceRange)

  // Query for Expenses
  const { data: expenses } = useQuery({
    queryKey: ['Expense', expenseStart, expenseEnd],
    queryFn: () => fetchExpenses(expenseStart, expenseEnd),
    enabled: !!expenseStart && !!expenseEnd,
  })
  console.log('🚀 ~ HomePage ~ expenses:', expenses)

  // Query for Invoices
  const { data: invoice } = useQuery({
    queryKey: ['Invoice', invoiceStart, invoiceEnd],
    queryFn: () => fetchInvoicesByDate(invoiceStart, invoiceEnd),
    enabled: !!invoiceStart && !!invoiceEnd,
  })
  const invoiceChart = (invoice ?? [])
    .filter(
      (item) => item.invoice_type === 'cash' || item.invoice_type === 'credit'
    )
    .map((item) => {
      return {
        month: item.invoice_date
          ? format(new Date(item.invoice_date), 'dd-MMM-yyyy')
          : 'N/A',
        Amount: item.bill_amount,
      }
    })
  const chartConfig = {
    desktop: {
      label: 'Amount',
      color: 'hsl(var(--chart-1))',
    },
    month: {
      label: 'Date',
      color: 'hsl(var(--chart-2))',
    },
  } satisfies ChartConfig

  // Fetch Payment Types
  const { data: paymentType } = useQuery({
    queryKey: ['Payment'],
    queryFn: fetchBankAccount,
  })

  const totalExpenses = expenses
    ? expenses.reduce(
        (total, item) => total + (parseFloat(item.bill_amount) || 0),
        0
      )
    : 0

  const totalSale = invoice
    ? invoice
        .filter(
          (item) =>
            item.invoice_type?.toLowerCase().includes('cash') ||
            item.invoice_type?.toLowerCase().includes('credit')
        )
        .reduce((total, item) => total + (parseFloat(item.bill_amount) || 0), 0)
    : 0
  const totalSaleData = invoice
    ? invoice
        .filter(
          (item) =>
            item.invoice_type?.toLowerCase().includes('cash') ||
            item.invoice_type?.toLowerCase().includes('credit')
        )
        .map((item) => ({
          month: item.invoice_date
            ? format(new Date(item.invoice_date), 'MMM')
            : 'N/A',
          amount: item.bill_amount,
        }))
    : []
  console.log('🚀 ~ HomePage ~ totalSaleData:', totalSaleData)

  return (
    <main className="flex gap-4 p-4 pt-3 w-full">
      <section className="gap-2 w-3/4 flex flex-col">
        <div className="w-full flex gap-2">
          <Card className="w-3/4 ">
            <CardHeader>
              <CardTitle className="flex gap-2 text-xl  w-full items-center">
                <div className="flex justify-between w-full">
                  <p className="flex gap-2 text-xl  items-center">
                    <ReceiptIndianRupee color="#cb8c20" />
                    Sale
                  </p>
                  <DateRangeSelect
                    className="w-28"
                    onChange={setInvoiceRange}
                    initialValue="today"
                  />
                </div>
              </CardTitle>
              <CardDescription>
                <div>
                  <p className="text-2xl font-bold text-black">
                    {formatCurrencyINR(totalSale)}
                  </p>
                  <p className="text-gray-500 font-semibold">
                    {invoiceRange === 'today'
                      ? format(new Date(invoiceEnd), 'dd MMM yyyy')
                      : `${format(new Date(invoiceStart), 'dd MMM')} - ${format(
                          new Date(invoiceEnd),
                          'dd MMM yyyy'
                        )}`}
                  </p>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent className="h-full w-full">
              <ChartContainer config={chartConfig}>
                <LineChart
                  data={invoiceChart}
                  margin={{
                    left: 2,
                    right: 2,
                  }}
                  height={200}
                  accessibilityLayer
                >
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={1}
                    tickFormatter={(value) => value.slice(0, 0)}
                  />

                  <YAxis
                    range={[0, 10000]}
                    tickLine={false}
                    axisLine={false}
                    width={40}
                    height={200} // ✅ Reduce Y-axis width
                    domain={['auto', 'auto']} // ✅ Auto-scale Y values
                    allowDecimals={false} // ✅ No decimals
                    tickFormatter={(value) => `${value}`} // ✅ Format values
                  />

                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dashed" />}
                  />
                  <Line
                    className="border-2  bg-red-400"
                    dataKey="Amount"
                    type=""
                    stroke="var(--color-desktop)"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
          <Card className="w-1/4 ">
            <CardHeader>
              <CardTitle className="flex gap-2 text-xl  w-full items-center">
                <div className="flex justify-between w-full">
                  <p className="flex gap-2 text-xl  items-center">
                    <Wallet color="#9c71e8" strokeWidth={3} />
                    Expense
                  </p>
                  <DateRangeSelect
                    className="w-28"
                    onChange={setExpenseRange}
                    initialValue="today"
                  />
                </div>
              </CardTitle>
              <CardDescription>
                {' '}
                <div>
                  <p className="text-2xl font-bold text-black">
                    {formatCurrencyINR(totalExpenses)}
                  </p>
                  <p className="text-gray-500 font-semibold">
                    {expenseRange === 'today'
                      ? format(new Date(expenseEnd), 'dd MMM yyyy')
                      : `${format(new Date(expenseStart), 'dd MMM')} - ${format(
                          new Date(expenseEnd),
                          'dd MMM yyyy'
                        )}`}
                  </p>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* <ChartContainer
              config={chartConfig}
              className="border-red-500 border h-[]"
            >
              <LineChart
                className="border-2 h-[300px] "
                accessibilityLayer
                data={chartData}
                margin={{
                  left: 2,
                  right: 2,
                }}
              >
                <CartesianGrid accentHeight={300} vertical={true} horizontal={true} alignmentBaseline='central' amplitude={30}  />
                <XAxis
                  version='o'
                  dataKey="month"
                  tickLine={false}
                  axisLine={true}
                  tickMargin={5}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
               
                <YAxis
                  tickLine={false}
                  axisLine={true}
                  tickMargin={5}
                  // tickFormatter={(value) => value.slice(0, 3)}
                />

                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Line
                  className="border-2  bg-red-400"
                  height={300}
                  dataKey="desktop"
                  type="bump"
                  stroke="var(--color-desktop)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ChartContainer> */}
            </CardContent>
          </Card>
        </div>
        <div className="w-full flex gap-2">
          <Card className="w-1/3 ">
            <CardHeader>
              <CardTitle className="flex gap-2 text-xl  w-full items-center">
                <ArrowDown color="#08bd7c" strokeWidth={3} />
                You`ll Receive
              </CardTitle>
              <CardDescription>
                {' '}
                <div>
                  <p className="text-2xl font-bold text-black">
                    {formatCurrencyINR('00')}
                  </p>
                  <p className="text-gray-500 font-semibold">
                    January - June 2024
                  </p>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent></CardContent>
          </Card>
          <Card className="w-1/3 ">
            <CardHeader>
              <CardTitle className="flex gap-2 text-xl  w-full items-center">
                <ArrowUp color="#f26546" strokeWidth={3} />
                You`ll Pay
              </CardTitle>
              <CardDescription>
                {' '}
                <div>
                  <p className="text-2xl font-bold text-black">
                    {formatCurrencyINR('00')}
                  </p>
                  <p className="text-gray-500 font-semibold">
                    January - June 2024
                  </p>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent></CardContent>
          </Card>
          <Card className="w-1/3 ">
            <CardHeader>
              <CardTitle className="flex gap-2 text-xl  w-full items-center">
                <div className="flex justify-between w-full">
                  <p className="flex gap-2 text-xl  items-center">
                    <ShoppingCart color="#14a8f1" strokeWidth={3} />
                    Purchase
                  </p>
                </div>
              </CardTitle>
              <CardDescription>
                {' '}
                <div>
                  <p className="text-2xl font-bold text-black">
                    {formatCurrencyINR('00')}
                  </p>
                  <p className="text-gray-500 font-semibold">
                    January - June 2024
                  </p>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent></CardContent>
          </Card>
        </div>
      </section>
      <section className="w-1/4 flex flex-col gap-2 p-2">
        <Card className="p-2 flex justify-between items-center">
          <CardTitle>Privacy </CardTitle>
          <Switch />
        </Card>
        <p>Stock Inventory</p>
        <Card className="p-2 flex justify-between items-center">
          <CardTitle>Stock Value</CardTitle>
          <p>00.00</p>
        </Card>
        <Card className="py-2 px-4 min-h-80  ">
          <CardTitle>Low Stock </CardTitle>
          <CardContent></CardContent>
        </Card>
        <p>Cash & Bank</p>
        <Card className="py-2 px-4 min-h-20 flex flex-col gap-3">
          <CardTitle>Cash In Hand</CardTitle>
          <p className="text-green-600 font-semibold text-xl">
            {formatCurrencyINR('2323423')}
          </p>
        </Card>
        <Card className="py-2 px-4 flex flex-col gap-3 min-h-80 ">
          <CardTitle> Bank Account </CardTitle>

          {paymentType
            ?.filter((item) => item.account_name?.toLowerCase() !== 'cash')
            .map((item) => (
              <div key={item.id} className="flex justify-between items-center ">
                <p>{item.account_name}</p>
                <p className="text-green-600 font-semibold">
                  {formatCurrencyINR(item.balance ?? 0)}
                </p>
              </div>
            ))}
        </Card>

        <div className="aspect-video rounded-xl bg-muted/50"></div>
      </section>
    </main>
  )
}
export default HomePage

{
  /* <div className=" w-4/6 rounded-xl bg-white p-3">
          <div className="flex justify-between">
            <p className="flex gap-2 text-xl  items-center">
              <ReceiptIndianRupee color="#cb8c20" />
              Sale
            </p>
            <Button variant={'outline'}>Last month</Button>
          </div>
          <div className=" ">
            <div>
              <p className="text-2xl font-bold">{formatCurrencyINR('00')}</p>
              <p className="text-gray-500 font-semibold">Total Sale (Mar)</p>
            </div>
            <Card>
              <CardHeader>
                <CardTitle className="flex gap-2 text-xl  w-full items-center">
                  <div className="flex justify-between w-full">
                    <p className="flex gap-2 text-xl  items-center">
                      <ReceiptIndianRupee color="#cb8c20" />
                      Sale
                    </p>
                    <Button variant={'outline'}>Last month</Button>
                  </div>
                </CardTitle>
                <CardDescription>
                  {' '}
                  <div>
                    <p className="text-2xl font-bold text-black">
                      {formatCurrencyINR('00')}
                    </p>
                    <p className="text-gray-500 font-semibold">
                  January - June 2024
                    </p>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig}>
                  <LineChart
                    accessibilityLayer
                    data={chartData}
                    margin={{
                      left: 12,
                      right: 12,
                    }}
                  >
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      tickFormatter={(value) => value.slice(0, 3)}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Line
                      dataKey="desktop"
                      type="natural"
                      stroke="var(--color-desktop)"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </div> */
}
{
  /* <div className="w-2/6 rounded-xl bg-white">k</div> */
}
