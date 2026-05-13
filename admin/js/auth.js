// Auth Logic
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        loginError.style.display = 'none';
        
        try {
            const { data, error } = await supabaseClient.auth.signInWithPassword({
                email,
                password
            });
            
            if (error) throw error;
            
            // Redirect to dashboard on success
            window.location.href = 'index.html';
        } catch (error) {
            loginError.textContent = error.message;
            loginError.style.display = 'block';
        }
    });
}

// Session check
async function checkSession() {
    const { data: { session } } = await supabaseClient.auth.getSession();
    const isLoginPage = window.location.pathname.includes('login.html');
    
    if (!session && !isLoginPage) {
        window.location.href = 'login.html';
    } else if (session && isLoginPage) {
        window.location.href = 'index.html';
    }
}

// Run session check on all admin pages
checkSession();

// Logout function
async function logout() {
    await supabaseClient.auth.signOut();
    window.location.href = 'login.html';
}
