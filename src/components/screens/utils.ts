import { MenuItem, OrderCheck } from "../../types/types";

export const printOrderCheck = (order: OrderCheck, reprint?:Boolean) => {
  const printWindow = window.open('', '_blank', 'width=600,height=600');
  if (!printWindow) return;

  let serviceChargeHtml = '';
  if (order.isServiceChargeApplied) { 

    serviceChargeHtml = `
      <div style="display:flex; justify-content:space-between; font-style: italic;">
        <span>Service Charge (10%):</span>
        <span>£${order.serviceCharge.toFixed(2)}</span>
      </div>`;
  }

 let reprintHtml = '';
  if ( reprint) {
    reprintHtml = `
      <div style="font-weight: bold; text-align: center; margin:5px 0;">
        <span>****** Reprinted *******</span>
      </div>`;
  }

  const itemListHtml = order.items.map(item => {
    return `
      <div style="display:flex; justify-content:space-between; margin-bottom: 2px;">
        <span>${item.quantity}x ${item.dishName.toUpperCase()}</span>
        <span>£${(item.price * item.quantity).toFixed(2)}</span>
      </div>`;
  }).join('');

  printWindow.document.write(`
    <html>
      <head>
        <title>Receipt</title>
        <style>
          body { 
            font-family: monospace; 
            width: 80mm; 
            padding: 10px; 
            font-size: 12px; 
            line-height: 1.2; 
            color: #000;
          }
          .header { text-align: center; margin-bottom: 20px; }
          .divider { border-bottom: 1px dashed black; margin: 8px 0; }
          .totals { margin-top: 10px; border-top: 1px solid black; padding-top: 5px; }
          .total-line { display: flex; justify-content: space-between; font-weight: bold; font-size: 14px; margin-top: 4px; }
          .footer { font-size: 10px; margin-top: 20px; text-align: center; text-transform: uppercase; }
        </style>
      </head>
      <body>
        <div class="header">
          <h2 style="margin:5px 0">Kande-Pohe</h2>
          <p style="margin:0">123 Business Street, London</p>
          <p style="margin:5px 0;">VAT NO: GB123456789</p> <div class="divider"></div>
          ${reprintHtml}
          <p style="margin:0">Table: ${order.tableNumber} | Date: ${new Date().toLocaleDateString()}</p>
        </div>
        
        ${itemListHtml}

        <div class="divider"></div>
        
        <div class="totals-section">
          <div style="display:flex; justify-content:space-between;">
            <span>Subtotal:</span>
            <span>£${order.subTotal.toFixed(2)}</span>
          </div>
          
          ${serviceChargeHtml}
          
          <div class="total-line">
            <span>TOTAL:</span>
            <span>£${order.grandTotal.toFixed(2)}</span>
          </div>
        </div>

        <div class="divider"></div>

        <div class="footer">
          <p>Thank you for your visit!</p>
        </div>
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.focus();
  
  // setTimeout(() => {
  //   printWindow.print();
  //   printWindow.close();
  // }, 250);
};


export const printKitchenCopy = (items: MenuItem[], table: number) => {
  const printWindow = window.open('', '_blank', 'width=600,height=600');
  if (!printWindow) return;

  // Generate Item List with Large Text for Chefs
  const itemListHtml = items.map(item => {
    // Handle Course Breaks (e.g., dishId -1)
    if (item.dishId === -1) {
      return `
        <div style="text-align:center; padding: 10px 0; font-weight:bold; margin: 10px 0; font-size: 18px;">
          *** ${item.dishName} ***
        </div>`;
    }

    // Standard Food Item
    return `
      <div style="margin-bottom: 8px; font-size: 20px; font-weight: bold; padding-bottom: 4px;">
        <span>${item.quantity}x ${item.dishName.toUpperCase()}</span>
      </div>`;
  }).join('');

  printWindow.document.write(`
    <html>
      <head>
        <title>Kitchen Order</title>
        <style>
          body { 
            font-family: monospace; 
            width: 80mm; 
            padding: 10px; 
            color: #000; 
            line-height: 1.1;
          }
          .header { text-align: center; margin-bottom: 15px; }
          .divider { border-bottom: 3px solid black; margin: 5px 0; }
          .footer { text-align: center; margin-top: 30px; font-weight: bold; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 style="margin:0; font-size: 24px;">KITCHEN ORDER</h1>
          <div class="divider"></div>
          <p style="font-size: 22px; font-weight: 900; margin: 5px 0;">TABLE: ${table}</p>
          <p style="margin:0; font-size: 14px;">
            ${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} | 
            ${new Date().toLocaleDateString()}
          </p>
        </div>
        
        <div class="items">
          ${itemListHtml}
        </div>

        <div class="footer">
          --- END OF ORDER ---
        </div>
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.focus();
  
  // setTimeout(() => {
  //   printWindow.print();
  //   printWindow.close();
  // }, 250);
};

 