/* const fs = require('fs');
const PDFDocument=require('pdfkit')
module.exports=function createInvoice(invoice, path) {
	let doc = new PDFDocument({ margin: 50 });

	generateHeader(doc,invoice);
	generateCustomerInformation(doc, invoice);
	generateInvoiceTable(doc, invoice);
	generateFooter(doc);
    	console.log(path)
	doc.end();
	doc.pipe(fs.createWriteStream(path));
}
var data1=0
function generateHeader(doc,invoice) {
	// const shipping = invoice.shipping;

	doc.image(`${invoice.logo}`, 50, 45, { width: 50 })
		.fillColor('#444444')
		.fontSize(20)
		.text(`${invoice.cname}`, 110, 57)
		.fontSize(10)
		.text(`${invoice.senderName}`, 200, 50, { align: 'right' })
		.text(`${invoice.senderEmail}`, 200, 65, { align: 'right' })
		.text(`${invoice.caddress}`, 200, 80, { align: 'right' })
		.moveDown();
}

function generateCustomerInformation(doc, invoice) {


	doc.text(`Invoice Number: ${invoice.invoiceNumber}`, 50, 200)
		// .text(`Invoice Date: ${invoice.invoicedate}`, 50, 215)
		.text(`TO : `, 50, 130)

		.text(`Name: ${invoice.receiverName}`)
		.text(`Address: ${invoice.receiverAddress}`)
		.text(`STATUS: ${invoice.paymentStatus}`, 200, 130, { align: 'right' })
		.text(`Invoice Date: ${invoice.invoiceDate}`, 200, 142, { align: 'right' })
		.text(`Due Date: ${invoice.dueDate}`, 200, 154, { align: 'right' })
		.text(`TOTAL AMOUNT:  ${invoice.invoiceAmount}`, 200, 200, { align: 'right' })
		.fontSize(6)
		.moveDown();
}
function generateTableRow(doc, y, c1, c2, c3, c4, c5) {
	data1=y
	doc.fontSize(10)
		.text(c1, 50, y)
		.text(c2, 150, y)
		.text(c3, 280, y, { width: 90, align: 'right' })
		.text(c4, 370, y, { width: 90, align: 'right' })
		.text(c5, 0, y, { align: 'right' });
}
function generateInvoiceTable(doc, invoice) {
	let i,
		invoiceTableTop = 230;
        generateTableRow(
			doc,
			invoiceTableTop,
			"Product Name",
			"Product Price",
			"Quantity",
			"Discount %",
            "Total",
		);
	for (i = 0; i < invoice.products.length; i++) {
		const item = invoice.products[i];
		const position = invoiceTableTop + (i + 1) * 30;
		generateTableRow(
			doc,
			position,
			item.item,
			item.price,
			item.quantity,
			item.discount,
            item.total
		);
	}
}
function generateFooter(doc) {
	doc.fontSize(
		10,
	).text(
		'Payment is due within 15 days. Thank you for your business.',
		50,
		data1+80,
		{ align: 'center', width: 500 },
	);
} */