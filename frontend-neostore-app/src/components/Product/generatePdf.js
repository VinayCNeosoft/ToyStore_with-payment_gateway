import { jsPDF } from "jspdf";

export const downloadPdf = (user, address, cart, total, orderId) => {
  console.log({
    user: user,
    address: address,
    cart: cart,
    total: total,
    orderId: orderId,
  });
  var doc = new jsPDF();

  const date = new Date();
  const setDate =
    date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
  console.log(setDate);

  //top
  doc.setFontSize(30);
  doc.text("Neo", 15, 25);
  doc.setTextColor(255, 0, 0);
  doc.text("STORE", 35, 25);
  doc.setFontSize(20);
  doc.setTextColor(0, 0, 0);
  doc.text(`${setDate}`, 165, 25);
  doc.text("Order Detail", 90, 40);
  doc.text("Order No :", 150, 40);
  doc.text("123456", 180, 40);

  //sender
  doc.setFontSize(12);
  doc.text("From :", 15, 55);
  doc.text("Name :", 15, 65);
  doc.text("Neostore", 40, 65);
  doc.text("Email :", 15, 75);
  doc.text("contact@neosoftmail.com", 40, 75);
  doc.text("Address:", 15, 85);
  doc.text("Mumbai,India", 40, 85);
  doc.text("Phone :", 15, 95);
  doc.text("+91-9876543210", 40, 95);

  //receiver
  doc.setFontSize(12);
  doc.text("Bill To :", 125, 55);
  doc.text("Name", 125, 65);
  doc.text(user.fname, 150, 65);
  doc.text("Email :", 125, 75);
  doc.text(user.email, 150, 75);
  doc.text("Address:", 125, 85);
  doc.text(address.street, 150, 85);
  doc.text(address.city, 175, 85);
  doc.text(address.state, 150, 95);
  doc.text(address.country, 180, 95);
  doc.text("Phone :", 125, 105);
  doc.text(user.mobile.toString(), 150, 105);

  doc.setLineWidth(0.5);
  doc.line(20, 25, 60, 25);

  doc.setFontSize(12);
  let spacing = 130;
  cart.forEach((item, id) => {
    spacing += 20;
    doc.text((id + 1).toString(), 10, spacing + 3);
    doc.text(item.product_name, 25, spacing + 5);
    doc.text(item.product_producer, 25, spacing);
    doc.text(item.quantity.toString(), 120, spacing + 7);
    doc.text(item.product_cost.toString(), 155, spacing + 7);
    doc.text((item.quantity * item.product_cost).toString(), 180, spacing + 7);
  });

  doc.setLineWidth(0.5);
  doc.line(100, spacing + 20, 200, spacing + 20);

  doc.text("total:", 140, spacing + 30);

  doc.text("total:", 140, spacing + 30);
  doc.text(total.toString(), 180, spacing + 30);
  doc.text("GST-5%:", 140, spacing + 37);
  doc.text(Math.round(total * (5 / 100)).toString(), 180, spacing + 37);
  doc.text("SubTotal:", 140, spacing + 44);
  doc.text(Math.round(total + total * (5 / 100)).toString(), 180, spacing + 44);

  doc.save(`${user.fname}`);
};
