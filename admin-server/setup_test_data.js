const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

const API_URL = 'http://localhost:5000/api';
const ADMIN_EMAIL = 'admin1@example.com';
const ADMIN_PASSWORD = 'Admin1@123';

async function setup() {
    try {
        // 1. Login
        console.log('Logging in...');
        const loginRes = await axios.post(`${API_URL}/admin-auth/login`, {
            email: ADMIN_EMAIL,
            password: ADMIN_PASSWORD
        });
        const token = loginRes.data.token;
        console.log('Logged in successfully.');

        let userId;
        try {
            console.log('Creating user Rani...');
            const userRes = await axios.post(`${API_URL}/users`, {
                firstName: 'Rani',
                lastName: 'Test',
                email: 'rani@example.com',
                phone: '1234567890',
                password: 'password123'
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            userId = userRes.data._id;
            console.log('User created:', userId);
        } catch (err) {
            if (err.response && err.response.data.message === 'Email already exists') {
                console.log('User Rani already exists. Fetching ID...');
                const usersRes = await axios.get(`${API_URL}/users`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const user = usersRes.data.find(u => u.email === 'rani@example.com');
                if (user) {
                    userId = user._id;
                    console.log('Found existing user:', userId);
                } else {
                    throw new Error('User exists but not found in list');
                }
            } else {
                throw err;
            }
        }

        // 3. Enable Billing
        console.log('Enabling billing...');
        await axios.post(`${API_URL}/users/${userId}/enable-billing`, {
            adminEmail: ADMIN_EMAIL
        }, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        console.log('Billing enabled.');

        // 4. Create Dummy PDF
        const pdfContent = '%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << >> /Contents 4 0 R >>\nendobj\n4 0 obj\n<< /Length 21 >>\nstream\nBT /F1 24 Tf 100 700 Td (Hello World) Tj ET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f \n0000000010 00000 n \n0000000060 00000 n \n0000000117 00000 n \n0000000224 00000 n \ntrailer\n<< /Size 5 /Root 1 0 R >>\nstartxref\n294\n%%EOF';
        fs.writeFileSync('test_invoice.pdf', pdfContent);

        // 5. Upload Invoice
        console.log('Uploading invoice...');
        const formData = new FormData();
        formData.append('invoice', fs.createReadStream('test_invoice.pdf'));

        await axios.post(`${API_URL}/users/${userId}/invoices`, formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                ...formData.getHeaders()
            }
        });
        console.log('Invoice uploaded.');

    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
    }
}

setup();
