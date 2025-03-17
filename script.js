let items = [];

function addItem() {
    let jewelryType = document.getElementById('jewelryType').value;
    let goldCarat = document.getElementById('goldCarat').value;
    let baseRate = parseFloat(document.getElementById('baseRate').value) || 0;
    let adjustedRate = (baseRate * goldCarat) / 24;
    let weight = parseFloat(document.getElementById('weight').value) || 0;
    let totalPrice = Math.round(adjustedRate * weight);

    if (weight > 0 && baseRate > 0) {
        items.push({
            jewelryType,
            goldCarat,
            baseRate,
            adjustedRate: adjustedRate.toFixed(2),
            weight,
            totalPrice
        });

        updateItemsTable();
        resetItemFields();
    } else {
        alert("Please enter a valid weight and 24K gold rate.");
    }
}

function updateItemsTable() {
    let tableBody = document.getElementById('itemsTableBody');
    tableBody.innerHTML = "";

    items.forEach((item, index) => {
        let row = `<tr>
            <td>${index + 1}</td>
            <td>${item.jewelryType}</td>
            <td>${item.goldCarat}K</td>
            <td>${item.baseRate} per gram</td>
            <td>${item.adjustedRate} per gram</td>
            <td>${item.weight} g</td>
            <td>${item.totalPrice.toLocaleString('en-IN')}</td>
            <td><button class="btn btn-danger btn-sm" onclick="removeItem(${index})">Remove</button></td>
        </tr>`;
        tableBody.innerHTML += row;
    });
}

function removeItem(index) {
    items.splice(index, 1);
    updateItemsTable();
}

function resetItemFields() {
    document.getElementById('weight').value = "";
}

function numberToWords(num) {
    const a = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
    const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
    
    function convertLessThanThousand(num) {
        if (num === 0) return "";
        if (num < 20) return a[num];
        if (num < 100) return b[Math.floor(num / 10)] + " " + a[num % 10];
        return a[Math.floor(num / 100)] + " Hundred " + convertLessThanThousand(num % 100);
    }
    
    function convert(num) {
        if (num === 0) return "Zero";
        let result = "";
        if (num >= 10000000) {
            result += convertLessThanThousand(Math.floor(num / 10000000)) + " Crore ";
            num %= 10000000;
        }
        if (num >= 100000) {
            result += convertLessThanThousand(Math.floor(num / 100000)) + " Lakh ";
            num %= 100000;
        }
        if (num >= 1000) {
            result += convertLessThanThousand(Math.floor(num / 1000)) + " Thousand ";
            num %= 1000;
        }
        if (num > 0) {
            result += convertLessThanThousand(num);
        }
        return result.trim();
    }
    
    return convert(num);
}

function printInvoice() {
    let customerName = document.getElementById('customerName').value;
    let phoneNumber = document.getElementById('phoneNumber').value;
    let address = document.getElementById('address').value;
    let dateTime = document.getElementById('dateTime').value;

    if (items.length === 0) {
        alert("Please add at least one item for valuation.");
        return;
    }

    let grandTotal = 0;
    items.forEach(item => grandTotal += item.totalPrice);
    let grandTotalWords = numberToWords(grandTotal).toLowerCase() + " only!";

    let invoiceContent = `
        <div style="font-family: Arial, sans-serif; width: 700px; margin: auto; padding: 20px; border: 2px solid #333; position: relative;">
            <img src='sgv.png' alt='Watermark' style='position: absolute; opacity: 0.1; width: 80%; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: -1;'>
            <h2 style="text-align: center; margin-bottom: 20px;">Gold Valuation Invoice</h2>
            <hr>
            <p><strong>Date & Time:</strong> ${dateTime}</p>
            <p><strong>Customer Name:</strong> ${customerName}</p>
            <p><strong>Phone Number:</strong> ${phoneNumber}</p>
            <p><strong>Address:</strong> ${address}</p>

            <table border="1" width="100%" style="text-align: center; margin-top: 20px;">
                <tr>
                    <th>#</th>
                    <th>Jewelry Type</th>
                    <th>Gold Carat</th>
                    <th>24K Rate</th>
                    <th>Adjusted Rate</th>
                    <th>Weight (g)</th>
                    <th>Total Price</th>
                </tr>`;

    items.forEach((item, index) => {
        invoiceContent += `
            <tr>
                <td>${index + 1}</td>
                <td>${item.jewelryType}</td>
                <td>${item.goldCarat}K</td>
                <td>${item.baseRate} per gram</td>
                <td>${item.adjustedRate} per gram</td>
                <td>${item.weight} g</td>
                <td>${item.totalPrice.toLocaleString('en-IN')}</td>
            </tr>`;
    });

    invoiceContent += `
            </table>
            <div style="display: flex; justify-content: space-between; margin-top: 20px;">
                <h4 style="text-align: left; font-size: 14px;">Grand Total (in words): ${grandTotalWords}</h4>
                <h4 style="text-align: right; font-size: 14px;">Grand Total: ₹${grandTotal.toLocaleString('en-IN')}</h4>
            </div>
            <p style="text-align: center; margin-top: 20px; font-weight: bold;">Thank you for choosing our services!</p>
        </div>`;

    let invoiceWindow = window.open('', '', 'width=800,height=600');
    invoiceWindow.document.write(invoiceContent);
    invoiceWindow.document.close();
    invoiceWindow.print();
}
