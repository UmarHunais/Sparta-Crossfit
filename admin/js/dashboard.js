// Dashboard Logic
async function loadDashboardStats() {
    try {
        // Fetch active members count
        const { count: activeCount, error: activeError } = await supabaseClient
            .from('members')
            .select('*', { count: 'exact', head: true })
            .gt('expiry_date', new Date().toISOString());
            
        if (!activeError) {
            document.getElementById('activeMembersCount').textContent = activeCount || 0;
        }

        // Fetch expiring soon count (next 7 days)
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        
        const { count: expiringCount, error: expiringError } = await supabaseClient
            .from('members')
            .select('*', { count: 'exact', head: true })
            .gt('expiry_date', new Date().toISOString())
            .lt('expiry_date', nextWeek.toISOString());

        if (!expiringError) {
            document.getElementById('expiringSoonCount').textContent = expiringCount || 0;
        }

        // Fetch total revenue
        const { data: payments, error: revenueError } = await supabaseClient
            .from('payments')
            .select('amount');

        if (!revenueError && payments) {
            const total = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
            document.getElementById('totalRevenueCount').textContent = total.toLocaleString();
        }

        // Load recent payments
        loadRecentPayments();

    } catch (error) {
        console.error('Error loading dashboard stats:', error);
    }
}

async function loadRecentPayments() {
    const { data, error } = await supabaseClient
        .from('payments')
        .select(`
            *,
            members (name)
        `)
        .order('created_at', { ascending: false })
        .limit(5);

    if (!error && data) {
        const body = document.getElementById('recentPaymentsBody');
        if (data.length > 0) {
            body.innerHTML = '';
            data.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item.members ? item.members.name : 'Unknown'}</td>
                    <td>LKR ${item.amount}</td>
                    <td>${item.method}</td>
                    <td>${new Date(item.created_at).toLocaleDateString()}</td>
                `;
                body.appendChild(row);
            });
        }
    }
}

// Initial load
if (typeof supabaseClient !== 'undefined') {
    loadDashboardStats();
}
