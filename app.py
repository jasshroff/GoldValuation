from flask import Flask, render_template, request, jsonify
import pdfkit

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/generate_invoice', methods=['POST'])
def generate_invoice():
    data = request.json
    customer_name = data['customerName']
    phone_number = data['phoneNumber']
    address = data['address']
    date_time = data['dateTime']
    items = data['items']

    invoice_html = f"""
    <html>
    <head><title>Invoice</title></head>
    <body>
        <div style="font-family: Arial, sans-serif; width: 700px; margin: auto; padding: 20px; border: 2px solid #333;">
            <h2 style="text-align: center; margin-bottom: 20px;">Gold Valuation Invoice</h2>
            <hr>
            <p><strong>Date & Time:</strong> {date_time}</p>
            <p><strong>Customer Name:</strong> {customer_name}</p>
            <p><strong>Phone Number:</strong> {phone_number}</p>
            <p><strong>Address:</strong> {address}</p>

            <table border="1" width="100%" style="text-align: center; margin-top: 20px;">
                <tr>
                    <th>#</th>
                    <th>Jewelry Type</th>
                    <th>Gold Carat</th>
                    <th>24K Rate</th>
                    <th>Adjusted Rate</th>
                    <th>Weight (g)</th>
                    <th>Total Price</th>
                </tr>"""

    grand_total = 0
    for index, item in enumerate(items):
        grand_total += float(item['totalPrice'])
        invoice_html += f"""
                <tr>
                    <td>{index + 1}</td>
                    <td>{item['jewelryType']}</td>
                    <td>{item['goldCarat']}K</td>
                    <td>{item['baseRate']} per gram</td>
                    <td>{item['adjustedRate']} per gram</td>
                    <td>{item['weight']} g</td>
                    <td>{item['totalPrice']}</td>
                </tr>"""

    invoice_html += f"""
            </table>
            <h3 style="text-align: right; margin-top: 20px;">Grand Total: ₹{grand_total:.2f}</h3>
            <p style="text-align: center; margin-top: 20px; font-weight: bold;">Thank you for choosing our services!</p>
        </div>
    </body>
    </html>
    """

    pdfkit.from_string(invoice_html, "invoice.pdf")
    return jsonify({"message": "Invoice generated successfully", "invoice_url": "invoice.pdf"})

if __name__ == '__main__':
    app.run(debug=True)
