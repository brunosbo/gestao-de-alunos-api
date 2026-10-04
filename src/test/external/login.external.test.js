import { expect } from 'chai';
import { api } from '../helpers/auth.js';

describe('Login externo', () => {
    it('deve autenticar um administrador com credenciais válidas', async () => {
        const resposta = await api
            .post('/api/auth/login')
            .send({ email: 'admin@escola.com', senha: 'admin123' });

        expect(resposta.status).to.equal(200);
    });

    it('deve autenticar um aluno com credenciais válidas', async () => {
        const resposta = await api
            .post('/api/auth/login')
            .send({ email: 'ana.souza@example.com', senha: '123456' });

        expect(resposta.status).to.equal(200);
    });

    it('deve retornar 400 quando a senha não for informada', async () => {
        const resposta = await api
            .post('/api/auth/login')
            .send({ email: 'admin@escola.com', senha: '' });

        expect(resposta.status).to.equal(400);
    });

    it('deve retornar 401 quando a senha estiver errada', async () => {
        const resposta = await api
            .post('/api/auth/login')
            .send({ email: 'admin@escola.com', senha: '123' });

        expect(resposta.status).to.equal(401);
    });
});
