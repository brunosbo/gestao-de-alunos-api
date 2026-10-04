import { expect } from 'chai';
import { api, loginAsAdmin } from '../helpers/auth.js';

describe('Cadastro', () => {
    let token;

    beforeEach(async () => {
        token = await loginAsAdmin();
    });

    it('deve cadastrar um aluno quando informa dados válidos', async () => {
        const cadastroAlunoResposta = await api
            .post('/api/admin/alunos')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({
                nome: 'Bruno Borges',
                email: 'bruno.borges@escola.com',
                matricula: '2026001',
                senha: '654321'
            });

        expect(cadastroAlunoResposta.status).to.equal(201);
        expect(cadastroAlunoResposta.body.nome).to.equal('Bruno Borges');
        expect(cadastroAlunoResposta.body.email).to.equal('bruno.borges@escola.com');
        expect(cadastroAlunoResposta.body.matricula).to.equal('2026001');
    });

    it('deve barrar o cadastro de aluno quando os dados já existem', async () => {
        const cadastroAlunoResposta = await api
            .post('/api/admin/alunos')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({
                nome: 'Bruno Borges',
                email: 'bruno.borges@escola.com',
                matricula: '2026001',
                senha: '654321'
            });

        expect(cadastroAlunoResposta.status).to.equal(409);
        expect(cadastroAlunoResposta.body.error).to.equal('Já existe um aluno cadastrado com essa matrícula ou e-mail.');
    });
});