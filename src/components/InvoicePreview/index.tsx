import React from 'react'

const InvoicePreview = () => {
  const invoiceData = {
    seller: {
      name: 'Agrawal Paints & Sanitary',
      gstin: '23FQLPA0041G1ZI',
      state: 'Madhya Pradesh',
      code: '23',
    },
    buyer: {
      name: 'SMC GOV. PRIMERI SCHOOL DEVRIDAG',
      state: 'Madhya Pradesh',
      code: '23',
    },
    invoiceNo: 'AST/2503/0001',
    date: '20-Mar-2025',
    items: [
      {
        description: 'TE3 20LIT',
        hsn: '320910',
        qty: 1,
        rate: 2966.1,
        amount: 2966.1,
      },
      {
        description: 'TE3 10LIT',
        hsn: '320910',
        qty: 1,
        rate: 1271.19,
        amount: 1271.19,
      },
      {
        description: 'G BROWN 4LIT',
        hsn: '320890',
        qty: 1,
        rate: 1864.4,
        amount: 1864.4,
      },
      {
        description: 'XT WHT 20KG',
        hsn: '320910',
        qty: 1,
        rate: 932.2,
        amount: 932.2,
      },
    ],
    subtotal: 7033.89,
    cgst: 633.06,
    sgst: 633.06,
    roundOff: -0.01,
    total: 8300.0,
    amountInWords: 'INR Eight Thousand Three Hundred Only',
    taxBreakup: [
      {
        hsn: '320910',
        taxableValue: 5169.49,
        centralTax: 465.26,
        stateTax: 465.26,
        totalTax: 930.52,
      },
      {
        hsn: '320890',
        taxableValue: 1864.4,
        centralTax: 167.8,
        stateTax: 167.8,
        totalTax: 335.6,
      },
    ],
    taxAmountInWords:
      'INR One Thousand Two Hundred Sixty Six and Twelve paise Only',
  }

  return (
    <div className="max-w-4xl mx-auto border p-6 shadow-md bg-white print:bg-transparent text-sm">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold">Tax Invoice</h2>
        <p className="font-semibold">{invoiceData.seller.name}</p>
        <p>
          GSTIN: {invoiceData.seller.gstin} | State Name:{' '}
          {invoiceData.seller.state}, Code: {invoiceData.seller.code}
        </p>
      </div>

      {/* Buyer Details */}
      <div className="border-b pb-3 flex justify-between">
        <div className="">
          <p>
            <strong>Party:</strong> {invoiceData.buyer.name}
          </p>
          <p>
            <strong>State Name:</strong> {invoiceData.buyer.state}, Code:{' '}
            {invoiceData.buyer.code}
          </p>
        </div>
        <div className="w-1/3 ">
          <p>
            <strong>Invoice No:</strong> {invoiceData.invoiceNo}
          </p>
          <p>
            <strong>Date:</strong> {invoiceData.date}
          </p>
        </div>
      </div>

      {/* Invoice Details */}

      {/* Items Table */}
      <table className="w-full mt-3 border text-sm ">
        <thead>
          <tr className="bg-gray-100 border">
            <th className="p-2 border">S No.</th>
            <th className="p-2 border">Description</th>
            <th className="p-2 border">HSN/SAC</th>
            <th className="p-2 border">Quantity</th>
            <th className="p-2 border">Rate</th>
            <th className="p-2 border">Rate /ps</th>
            <th className="p-2 border">Amount</th>
          </tr>
        </thead>
        <tbody>
          {invoiceData.items.map((item, index) => (
            <tr key={index} className="border-r">
              <td className="p-2 text-center border-r">{index + 1}</td>
              <td className="p-2 flex flex-col border-r">
                <span>{item.description}</span>{' '}
                <span className="text-xs">0529</span>
              </td>
              <td className="p-2 border-r text-center">{item.hsn}</td>
              <td className="p-2 border-r text-center">{item.qty}</td>
              <td className="p-2 border-r text-right">
                ₹{item.rate.toFixed(2)}
              </td>
              <td className="p-2 border-r text-right">
                ₹{item.rate.toFixed(2)}
              </td>
              <td className="p-2 border-r text-right">
                ₹{item.amount.toFixed(2)}
              </td>
            </tr>
          ))}
          <tr>
            <td className="p-1  border-r  text-center"> </td>
            <td className="p-1  border-r  text-right">SubTotal</td>
            <td className="p-1  border-r  text-right"></td>
            <td className="p-1  border-r  text-right"></td>
            <td className="p-1  border-r  text-right"></td>
            <td className="p-1  border-r  text-right"></td>
            <td className="p-1  border-t  text-right">
              {' '}
              ₹{invoiceData.subtotal.toFixed(2)}
            </td>
          </tr>
          <tr>
            <td className="p-1  border-r  text-center"> </td>
            <td className="p-1  border-r  text-right">Output Cgst</td>
            <td className="p-1  border-r  text-right"></td>
            <td className="p-1  border-r  text-right"></td>
            <td className="p-1  border-r  text-right"></td>
            <td className="p-1  border-r  text-right"></td>
            <td className="p-1  border-r  text-right">
              {' '}
              ₹{invoiceData.cgst.toFixed(2)}
            </td>
          </tr>
          <tr>
            <td className="p-1  border-r  text-center"> </td>
            <td className="p-1  border-r  text-right">Output Sgst</td>
            <td className="p-1  border-r  text-right"></td>
            <td className="p-1  border-r  text-right"></td>
            <td className="p-1  border-r  text-right"></td>
            <td className="p-1  border-r  text-right"></td>
            <td className="p-1  border-r  text-right">
              ₹{invoiceData.sgst.toFixed(2)}
            </td>
          </tr>
          <tr>
            <td className="p-1  border-r  text-center"> </td>
            <td className="p-1  border-r  text-right">Round Off</td>
            <td className="p-1  border-r  text-right"></td>
            <td className="p-1  border-r  text-right"></td>
            <td className="p-1  border-r  text-right"></td>
            <td className="p-1  border-r  text-right"></td>
            <td className="p-1  border-r  text-right">
              {' '}
              ₹{invoiceData.roundOff.toFixed(2)}
            </td>
          </tr>
          <tr>
            <td className="p-1  border  text-center"> </td>
            <td className="p-1  border  text-right">Total</td>
            <td className="p-1  border  text-right"></td>
            <td className="p-1  border  text-right"></td>
            <td className="p-1  border  text-right"></td>
            <td className="p-1  border  text-right"></td>
            <td className="p-1  border  text-right">
              {' '}
              ₹{invoiceData.total.toFixed(2)}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Tax Summary */}
      <div className="mt-3  text-sm">
        <p>Amount Chargeable (in words):</p>
        <p className="font-bold uppercase">{invoiceData.amountInWords}</p>
        {/* <p className="mt-4">
          Tax Amount (in words): {invoiceData.taxAmountInWords}
        </p> */}
        {/* <p className="mt-4 text-xs">This is a computer-generated invoice.</p> */}
      </div>

      {/* Tax Details Table */}
      <table className="w-full mt-3 border text-sm">
        <thead>
          <tr className="bg-gray-100 border">
            <th className="p-2">HSN/SAC</th>
            <th className="p-2">Taxable Value</th>
            <th className="  w-48  border" colSpan={2}>
              Central Tax
              <span className="w-full border-t">
                <td className="border-r w-16">Rate</td>{' '}
                <td className=" w-32">Amount</td>
              </span>
            </th>
            <th className="  w-48  border" colSpan={2}>
              State Tax
              <span className="w-full border-t">
                <td className="border-r w-16">Rate</td>{' '}
                <td className=" w-32">Amount</td>
              </span>
            </th>
            <th className="p-2 border">Total Tax</th>
          </tr>
        </thead>
        <tbody>
          {invoiceData.taxBreakup.map((tax, index) => (
            <tr key={index} className="">
              <td className="p-2 border-r text-left">{tax.hsn}</td>
              <td className="p-2 border-r text-right">
                ₹{tax.taxableValue.toFixed(2)}
              </td>
              <td className="p-2 border-r text-right w-16">₹{9}</td>
              <td className="p-2 border-r text-right w-32">
                ₹{tax.centralTax.toFixed(2)}
              </td>
              <td className="p-2 border-r text-right w-16">₹{9}</td>
              <td className="p-2 border-r text-right w-32">
                ₹{tax.stateTax.toFixed(2)}
              </td>
              <td className="p-2 border-r text-right">
                ₹{tax.totalTax.toFixed(2)}
              </td>
            </tr>
          ))}
          <tr className="border">
            <td className="p-2 border-r text-right">Total</td>
            <td className="p-2 border-r text-right">₹35249</td>
            <td className="p-2 border-r text-right w-16"></td>
            <td className="p-2 border-r text-right w-32">₹35342</td>
            <td className="p-2 border-r text-right w-16"></td>
            <td className="p-2 border-r text-right w-32">₹2524</td>
            <td className="p-2 border-r text-right">₹56343</td>
          </tr>
        </tbody>
      </table>

      {/* Footer */}
      <div className="mt-2 text-left text-sm">
        <p className=" ">
          Tax Amount (in words):{' '}
          <span className="font-semibold">{invoiceData.taxAmountInWords}</span>
        </p>
        <div className="flex justify-between mt-4">
          <div className="w-1/2">
            <span className="underline">Declaration</span>
            <p>
              We declare that this invoice shows the actual price of the goods
              described and that all particulars are true and correct.
            </p>
          </div>
          <div className="text-right space-y-10">
            <p className="font-semibold">for Agrawal Paints & Sanitary</p>
            <p>Authorized Signatory</p>
          </div>
        </div>

        <p className="mt-4 text-xs text-center">
          This is a computer-generated invoice.
        </p>
      </div>
    </div>
  )
}

export default InvoicePreview
