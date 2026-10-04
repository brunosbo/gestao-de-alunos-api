import { expect } from 'chai';
import { api, loginAsAdmin } from '../helpers/auth.js';

describe('Matricula de Aluno em Disciplina', () => {
    let token;

    beforeEach(async () => {
        token = await loginAsAdmin();
    });

    it('deve matricular um aluno em uma disciplina quando informa dados válidos', async () => {
        const alunoId = 'aluno-carla-mendes';
        const disciplinaId = 'disciplina-matematica';
        const cadastroAlunoDisciplinaResposta = await api
            .post(`/api/admin/disciplinas/${disciplinaId}/matriculas`)
            .set('Authorization', `Bearer ${token}`)
            .send({ alunoId });

        expect(cadastroAlunoDisciplinaResposta.status).to.equal(201);
        expect(cadastroAlunoDisciplinaResposta.body.alunoId).to.equal(alunoId);
        expect(cadastroAlunoDisciplinaResposta.body.disciplinaId).to.equal(disciplinaId);
    });
});