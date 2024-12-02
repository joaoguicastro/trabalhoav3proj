import { FastifyInstance } from 'fastify';
import { turmaRepository } from '../../repositories/turmaRepository';

export default async function turmaRoutes(server: FastifyInstance) {
  server.post('/turmas', async (request, reply) => {
    const { nome, descricao, disciplinas, idAlunos } = request.body as {
      nome: string;
      descricao: string;
      disciplinas: string[];
      idAlunos: number; // Recebido como número
    };
  
    try {
      const turma = await turmaRepository.create({
        nome,
        descricao,
        disciplinas,
        idAlunos: [idAlunos], // Converta para um array
      });
      return reply.status(201).send(turma);
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ error: 'Erro ao criar a turma' });
    }
  });
  

  server.get('/turmas/:id', async (request, reply) => {
    const { id } = request.params as { id: string };

    try {
      const turma = await turmaRepository.findById(Number(id));
      return turma
        ? reply.send(turma)
        : reply.status(404).send({ error: 'Turma não encontrada' });
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ error: 'Erro ao buscar a turma' });
    }
  });

  server.get('/turmas', async (request, reply) => {
    try {
      const turmas = await turmaRepository.findAll();
      return reply.send(turmas);
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ error: 'Erro ao listar turmas' });
    }
  });

  server.put('/turmas/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const { nome, descricao, disciplinas, idAlunos } = request.body as {
      nome: string;
      descricao: string;
      disciplinas: string[];
      idAlunos: number; // Recebido como número
    };
  
    try {
      const turma = await turmaRepository.update(Number(id), {
        nome,
        descricao,
        disciplinas,
        idAlunos: [idAlunos], // Converta para um array
      });
      return reply.send(turma);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        return reply.status(500).send({ error: error.message });
      }
      console.error(error);
      return reply.status(500).send({ error: 'Erro desconhecido ao atualizar a turma' });
    }
  });
  

  server.delete('/turmas/:id', async (request, reply) => {
    const { id } = request.params as { id: string };

    try {
      await turmaRepository.delete(Number(id));
      return reply.status(204).send();
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ error: 'Erro ao excluir a turma' });
    }
  });

  // Nova rota para vincular alunos a uma turma
  server.post('/turmas/:id/vincular-aluno', async (request, reply) => {
    const { id } = request.params as { id: string };
    const { alunoId } = request.body as { alunoId: number };
  
    try {
      const turma = await turmaRepository.vincularAlunoNaTurma(Number(id), alunoId);
      return reply.status(200).send({
        message: `Aluno ${alunoId} vinculado à turma ${id} com sucesso!`,
        turma,
      });
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        return reply.status(500).send({ error: error.message });
      }
      console.error(error);
      return reply.status(500).send({ error: 'Erro desconhecido ao vincular aluno à turma' });
    }
  });
  
  
}
