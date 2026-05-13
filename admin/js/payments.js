// Payment Management Logic
const paymentForm = document.getElementById('paymentForm');
const paymentsTableBody = document.getElementById('paymentsTableBody');
const addPaymentBtn = document.getElementById('addPaymentBtn');
const paymentFormSection = document.getElementById('paymentFormSection');

addPaymentBtn.onclick = () => paymentFormSection.style.display = 'block';

// Load Payments
async function loadPayments() {
    const { data, error } = await supabaseClient
        .from('payments')
        .select(`
            *,
            members (name)
        `)
        .order('created_at', { ascending: false });

    if (!error && data) {
        paymentsTableBody.innerHTML = '';
        data.forEach(pay => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${new Date(pay.created_at).toLocaleDateString()}</td>
                <td>${pay.members.name}</td>
                <td>LKR ${pay.amount}</td>
                <td>${pay.method}</td>
                <td>${pay.reference || '-'}</td>
            `;
            paymentsTableBody.appendChild(row);
        });
    }
}

// PayHere Integration
function startPayHere(amount, memberId, orderId) {
    // PayHere Sandbox Configuration
    const payment = {
        "sandbox": true,
        "merchant_id": "1235407", // Updated with user's Merchant ID
        "return_url": window.location.href,
        "cancel_url": window.location.href,
        "notify_url": "https://your-backend.com/notify", // Replace with actual notify URL
        "order_id": orderId,
        "items": "Gym Membership",
        "amount": amount,
        "currency": "LKR",
        "first_name": "Member",
        "last_name": memberId,
        "email": "member@example.com",
        "phone": "0771234567",
        "address": "Gym Address",
        "city": "Colombo",
        "country": "Sri Lanka",
        "delivery_address": "Gym Address",
        "delivery_city": "Colombo",
        "delivery_country": "Sri Lanka",
        "custom_1": memberId,
        "custom_2": ""
    };

    payhere.onCompleted = function onCompleted(orderId) {
        console.log("Payment completed. OrderID:" + orderId);
        savePaymentToDb(memberId, amount, 'PayHere', orderId);
    };

    payhere.onDismissed = function onDismissed() {
        console.log("Payment dismissed");
    };

    payhere.onError = function onError(error) {
        console.log("Error:" + error);
    };

    payhere.startPayment(payment);
}

async function savePaymentToDb(member_id, amount, method, reference) {
    const { error } = await supabaseClient
        .from('payments')
        .insert([{ member_id, amount, method, reference, status: 'Completed' }]);

    if (!error) {
        alert('Payment recorded successfully!');
        paymentFormSection.style.display = 'none';
        loadPayments();
    } else {
        alert('Error saving payment: ' + error.message);
    }
}

paymentForm.onsubmit = async (e) => {
    e.preventDefault();
    const memberId = document.getElementById('payMemberId').value;
    const amount = document.getElementById('payAmount').value;
    const method = document.getElementById('payMethod').value;
    const ref = document.getElementById('payRef').value;

    if (method === 'PayHere') {
        const orderId = 'GYM-' + Date.now();
        startPayHere(amount, memberId, orderId);
    } else {
        savePaymentToDb(memberId, amount, method, ref);
    }
};

// Initial load
if (typeof supabaseClient !== 'undefined') {
    loadPayments();
    
    // Check for member ID in URL
    const urlParams = new URLSearchParams(window.location.search);
    const memberId = urlParams.get('id');
    if (memberId) {
        paymentFormSection.style.display = 'block';
        document.getElementById('payMemberId').value = memberId;
    }
}
