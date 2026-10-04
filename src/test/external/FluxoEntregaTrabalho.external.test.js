import { expect } from 'chai';
import { readFileSync } from 'node:fs';
import { api, loginAsAdmin, loginAsUser } from '../helpers/auth.js';

// Os dados dos cenários ficam separados do teste para aplicar Data-Driven Testing.
const cenarios = JSON.parse(
    readFileSync(new URL('../data/fluxo-entrega-trabalho.json', import.meta.url), 'utf8')
);

describe('Fluxo de entrega de trabalho por aluno', () => {
    cenarios.forEach((cenario, indice) => {
        it(`deve cadastrar, autenticar e registrar entrega: ${cenario.descricao}`, async () => {
            // 1. Gera identificadores únicos para não colidir com outras execuções.
            const runId = `${Date.now()}-${indice}`;
            const aluno = {
                ...cenario.aluno,
                email: cenario.aluno.email.replaceAll('{runId}', runId),
                matricula: cenario.aluno.matricula.replaceAll('{runId}', runId),
            };
            const trabalho = {
                ...cenario.trabalho,
                titulo: cenario.trabalho.titulo.replaceAll('{runId}', runId),
            };

            // 2. Autentica como administrador para realizar o cadastro e a matrícula.
            const tokenAdmin = await loginAsAdmin();

            // 3. Cadastra o aluno usando os dados do cenário.
            const cadastroResposta = await api
                .post('/api/admin/alunos')
                .set('Authorization', `Bearer ${tokenAdmin}`)
                .send(aluno);

            expect(cadastroResposta.status).to.equal(201);
            expect(cadastroResposta.body.email).to.equal(aluno.email);
            expect(cadastroResposta.body).not.to.have.property('senha');

            // 4. Matricula o aluno na disciplina necessária para entregar o trabalho.
            const matriculaResposta = await api
                .post(`/api/admin/disciplinas/${trabalho.disciplinaId}/matriculas`)
                .set('Authorization', `Bearer ${tokenAdmin}`)
                .send({ alunoId: cadastroResposta.body.id });

            expect(matriculaResposta.status).to.equal(201);
            expect(matriculaResposta.body.alunoId).to.equal(cadastroResposta.body.id);

            // 5. Autentica com as credenciais do aluno recém-cadastrado.
            const tokenAluno = await loginAsUser(aluno);

            // 6. Registra a entrega autenticado como o próprio aluno.
            const entregaResposta = await api
                .post(`/api/alunos/${cadastroResposta.body.id}/trabalhos`)
                .set('Authorization', `Bearer ${tokenAluno}`)
                .send(trabalho);

            // 7. Confirma que a API criou a entrega para o aluno e disciplina esperados.
            expect(entregaResposta.status).to.equal(201);
            expect(entregaResposta.body.alunoId).to.equal(cadastroResposta.body.id);
            expect(entregaResposta.body.disciplinaId).to.equal(trabalho.disciplinaId);
            expect(entregaResposta.body.titulo).to.equal(trabalho.titulo);
            expect(entregaResposta.body.status).to.equal('entregue');
        });
    });
});