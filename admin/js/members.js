// Members Management Logic
const registrationSection = document.getElementById('registrationSection');
const addMemberBtn = document.getElementById('addMemberBtn');
const closeFormBtn = document.getElementById('closeFormBtn');
const cancelBtn = document.getElementById('cancelBtn');
const memberForm = document.getElementById('memberForm');
const photoDropzone = document.getElementById('photoDropzone');
const memberPhoto = document.getElementById('memberPhoto');
const photoPreview = document.getElementById('photoPreview');

// UI Toggles
addMemberBtn.onclick = () => registrationSection.style.display = 'block';
closeFormBtn.onclick = cancelBtn.onclick = () => {
    registrationSection.style.display = 'none';
    memberForm.reset();
    photoPreview.style.display = 'none';
};

// Photo Upload Preview
photoDropzone.onclick = () => memberPhoto.click();
memberPhoto.onchange = (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (re) => {
            photoPreview.src = re.target.result;
            photoPreview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
};

// Load Members
async function loadMembers() {
    // Fetch members with their latest payment
    const { data, error } = await supabaseClient
        .from('members')
        .select(`
            *,
            payments (created_at)
        `)
        .order('created_at', { ascending: false });

    if (!error && data) {
        const body = document.getElementById('membersTableBody');
        body.innerHTML = '';
        data.forEach(member => {
            const isExpired = new Date(member.expiry_date) < new Date();
            const hasPayments = member.payments && member.payments.length > 0;
            const lastPaymentDate = hasPayments 
                ? new Date(member.payments[0].created_at).toLocaleDateString()
                : 'No Payment';

            const row = document.createElement('tr');
            row.innerHTML = `
                <td><img src="${member.photo_url || 'https://via.placeholder.com/40'}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;"></td>
                <td>${member.name}</td>
                <td>${member.membership_type}</td>
                <td>${new Date(member.expiry_date).toLocaleDateString()}</td>
                <td>
                    <span class="status-badge ${isExpired ? 'status-expired' : 'status-active'}">${isExpired ? 'Expired' : 'Active'}</span>
                    <div style="font-size: 10px; color: var(--text-gray); margin-top: 5px;">Last: ${lastPaymentDate}</div>
                </td>
                <td>
                    <div style="display: flex; gap: 8px;">
                        <button class="login-btn" style="padding: 5px 10px; margin-top:0; font-size: 12px;" onclick="window.location.href='payments.html?id=${member.id}'">
                            ${hasPayments ? 'Log New Pay' : 'Log Payment'}
                        </button>
                        <button class="logout-btn" style="padding: 5px 10px; border: 1px solid #ff4444; color: #ff4444; background: transparent;" onclick="deleteMember('${member.id}', '${member.name}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            body.appendChild(row);
        });
    }
}

// Save Member + Initial Payment
memberForm.onsubmit = async (e) => {
    e.preventDefault();
    const name = document.getElementById('memberName').value;
    const phone = document.getElementById('memberPhone').value;
    const membership_type = document.getElementById('membershipType').value;
    const start_date = document.getElementById('startDate').value;
    const expiry_date = document.getElementById('expiryDate').value;
    const amount = document.getElementById('paymentAmount').value;
    const method = document.getElementById('paymentMethod').value;
    const photoFile = memberPhoto.files[0];

    let photo_url = null;

    try {
        // 1. Upload photo if exists
        if (photoFile) {
            const fileExt = photoFile.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `member-photos/${fileName}`;

            const { error: uploadError } = await supabaseClient.storage
                .from('gym-assets')
                .upload(filePath, photoFile);

            if (!uploadError) {
                const { data: urlData } = supabaseClient.storage
                    .from('gym-assets')
                    .getPublicUrl(filePath);
                photo_url = urlData.publicUrl;
            }
        }

        // 2. Insert Member
        const { data: memberData, error: memberError } = await supabaseClient
            .from('members')
            .insert([{ name, phone, membership_type, start_date, expiry_date, photo_url }])
            .select();

        if (memberError) throw memberError;

        const memberId = memberData[0].id;

        // 3. Insert Initial Payment
        const { error: paymentError } = await supabaseClient
            .from('payments')
            .insert([{
                member_id: memberId,
                amount: parseFloat(amount),
                method: method
            }]);

        if (paymentError) throw paymentError;

        alert('Member registered and payment logged successfully!');
        registrationSection.style.display = 'none';
        memberForm.reset();
        photoPreview.style.display = 'none';
        loadMembers();
    } catch (error) {
        alert('Error: ' + error.message);
    }
};

// Delete Member
async function deleteMember(id, name) {
    if (confirm(`Are you sure you want to delete ${name}? This will also delete all their payment records.`)) {
        try {
            // 1. Delete payments first (to handle foreign key constraint)
            const { error: payError } = await supabaseClient
                .from('payments')
                .delete()
                .eq('member_id', id);
            
            if (payError) throw payError;

            // 2. Delete member
            const { error: memError } = await supabaseClient
                .from('members')
                .delete()
                .eq('id', id);

            if (memError) throw memError;

            alert('Member and their payments deleted successfully.');
            loadMembers();
        } catch (error) {
            alert('Error deleting member: ' + error.message);
        }
    }
}

// Initial load
if (typeof supabaseClient !== 'undefined') {
    loadMembers();
}
