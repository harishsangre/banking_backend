document.addEventListener('DOMContentLoaded', () => {
    const createAccountForm = document.getElementById('create-account-form');
    const loginForm = document.getElementById('login-form');
    const depositForm = document.getElementById('deposit-form');
    const withdrawForm = document.getElementById('withdraw-form');
    const transferForm = document.getElementById('transfer-form');


    const isProduction = window.location.hostname !== 'localhost';
    const apiUrl = isProduction ? 'https://banking-backend-l3zl.onrender.com/api' : 'http://localhost:3000/api';
    const landingPageURL = isProduction ? 'https://banking-backend-l3zl.onrender.com/landing' : 'http://localhost:3000/landing';
    const currentURL = window.location.href;
    const handleLinkClick = (event) => {
        event.preventDefault();

        if ((currentURL != landingPageURL) || currentURL == null) {
            window.location.href = landingPageURL;
        } else {
            const href = event.target.getAttribute('href');
            window.location.href = href;
        }
    };

    setTimeout(() => {
        document.getElementById('navv').addEventListener('click', handleLinkClick);

    }, 100);

    // Handle account creation
    if (createAccountForm) {
        createAccountForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('create-name').value;
            const email = document.getElementById('create-email').value;
            const password = document.getElementById('create-password').value;
            const initialAmount = document.getElementById('create-balance').value;
            const form = e.target;
            try {
                const response = await fetch(`${apiUrl}/createaccounts`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, password, initialAmount })
                });
                const data = await response.json();
                document.getElementById('create-account-message').innerText = `Account created: ${data.accountNumber}`;
                form.reset()
            } catch (error) {
                document.getElementById('create-account-message').innerText = `Error: ${error.message}`;
            }
        });
    }
    // Handle login
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            try {
                const response = await fetch(`${apiUrl}/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const data = await response.json();
                if (response.ok) {
                    localStorage.setItem('token', data.token);
                    document.getElementById('login-message').innerText = 'Login successful!';
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                } else {
                    document.getElementById('login-message').innerText = `Error: ${data.error}`;
                }
            } catch (error) {
                document.getElementById('login-message').innerText = `Error: ${error.message}`;
            }
        });
    }
    // Handle deposit
    if (depositForm) {
        depositForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const amount = document.getElementById('deposit-amount').value;
            const token = localStorage.getItem('token');
            const form = e.target

            try {
                const response = await fetch(`${apiUrl}/accounts/deposit`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ amount })
                });
                const data = await response.json();
                document.getElementById('deposit-message').innerText = `Deposit successful: ${data.message}`;
                form.reset()
            } catch (error) {
                document.getElementById('deposit-message').innerText = `Error: ${error.message}`;
            }
        });
    }
    // Handle withdraw
    if (withdrawForm) {
        withdrawForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const amount = document.getElementById('withdraw-amount').value;
            const token = localStorage.getItem('token');
            const form = e.target
            try {
                const response = await fetch(`${apiUrl}/accounts/withdraw`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ amount })
                });
                const data = await response.json();
                document.getElementById('withdraw-message').innerText = `Withdraw successful: ${data.message}`;
                form.reset()

            } catch (error) {
                document.getElementById('withdraw-message').innerText = `Error: ${error.message}`;
            }
        });
    }

    // Handle transfer
    if (transferForm) {
        transferForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const toAccountNumber = document.getElementById('transfer-to').value;
            const amount = document.getElementById('transfer-amount').value;
            const token = localStorage.getItem('token');
            const form = e.target

            try {
                const response = await fetch(`${apiUrl}/accounts/transfer`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ toAccountNumber, amount })
                });
                const data = await response.json();
                document.getElementById('transfer-message').innerText = `${data.message}`;
                form.reset()
            } catch (error) {
                document.getElementById('transfer-message').innerText = `Error: ${error.message}`;
            }
        });
    }
});

function checkAuth() {
    const token = localStorage.getItem('token');
    // Get references to the divs
    const createDiv = document.getElementById('create-card');
    const loginDiv = document.getElementById('login-card');
    const onlogin = document.getElementById('on-login')
    const logout = document.getElementById('hidelogout')
    const transefercard = document.getElementById('transfer-card')

    if (token) {
        if (createDiv) {
            createDiv.classList.add('hidden');
        }
        if (loginDiv) {
            loginDiv.classList.add('hidden');
        }
    } else {
        if (onlogin) {
            onlogin.classList.add('hidden')
            logout.classList.add('hidden')
            transefercard.classList.add('hidden')
        }
    }
}

document.addEventListener('DOMContentLoaded', checkAuth);

function clearLocalStorage() {
    localStorage.clear();
}

function setUpAutoClear() {
    setInterval(clearLocalStorage, 3600000);
}

function handleLogout() {
    clearLocalStorage();
    window.location.href = '/'; // Example redirect to login page
}

document.addEventListener('DOMContentLoaded', setUpAutoClear);

const logoutButton = document.getElementById('logout-button');
if (logoutButton) {
    logoutButton.addEventListener('click', handleLogout);
}

document.addEventListener('DOMContentLoaded', () => {
    // Function to fetch HTML content and insert it
    const loadHTML = (url, selector) => {
        fetch(url)
            .then(response => response.text())
            .then(data => {
                const element = document.querySelector(selector);
                if (element) {
                    element.innerHTML = data;
                } else {
                    console.error(`Element with selector "${selector}" not found.`);
                }
            })
            .catch(error => console.error('Error loading HTML:', error));
    };

    // Load header and footer
    loadHTML('header.html', '#header');
    loadHTML('footer.html', '#footer');
});