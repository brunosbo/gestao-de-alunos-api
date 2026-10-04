import request from 'supertest';
import app from '../../app.js';
import { expect } from 'chai';

describe('Login', () => {
    it('deve retornar 200 quando administrador informa credenciais corretas', async () => {
        const loginResposta = await request(app)
            .post('/api/auth/login')
            .send({ email: 'admin@escola.com', senha: 'admin123' });

        expect(loginResposta.status).to.equal(200);
    });

    it('deve retornar 400 quando a senha não for informada', async () => {
        const loginResposta = await request(app)
            .post('/api/auth/login')
            .send({ email: 'admin@escola.com', senha: '' });

        expect(loginResposta.status).to.equal(400);
    });

    it('deve retornar 401 quando a senha estiver errada', async () => {
        const loginResposta = await request(app)
            .post('/api/auth/login')
            .send({ email: 'admin@escola.com', senha: '123' });

        expect(loginResposta.status).to.equal(401);
    });
});
