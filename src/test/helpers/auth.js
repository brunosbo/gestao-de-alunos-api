import 'dotenv/config';
import request from 'supertest';
import app from '../../app.js';

export const api = request(app);

async function login(email, senha) {
    const resposta = await api
        .post('/api/auth/login')
        .send({ email, senha });

    if (resposta.status !== 200 || !resposta.body.token) {
        throw new Error(`Falha no login de teste: ${resposta.status}`);
    }

    return resposta.body.token;
}

export async function loginAsAdmin() {
    return login(
        process.env.TEST_ADMIN_EMAIL || 'admin@escola.com',
        process.env.TEST_ADMIN_PASSWORD || 'admin123'
    );
}

export async function loginAsUser({ email, senha }) {
    return login(email, senha);
}

export async function getToken(emailUser, passUser) {
    return login(emailUser, passUser);
}