import { PrismaClient } from '@prisma/client';
import { fetchAlunos } from '../services/alunoService';

const prisma = new PrismaClient();

export interface CreateTurmaDTO {
  nome: string;
  descricao: string;
  disciplinas: string[];
  idAlunos: number;
}

export interface Aluno {
  id: number;
  nome: string;
  email: string;
  dataNasc: string;
  turmaId: number;
}

export const turmaRepository = {
  async create(data: CreateTurmaDTO) {
    return prisma.turma.create({
      data: {
        nome: data.nome,
        descricao: data.descricao,
        disciplinas: data.disciplinas,
        idAlunos: data.idAlunos,
      },
    });
  },

  async findAll() {
    return prisma.turma.findMany();
  },

  async findById(id: number) {
    return prisma.turma.findUnique({
      where: { id },
    });
  },

  async update(id: number, data: Partial<CreateTurmaDTO>) {
    return prisma.turma.update({
      where: { id },
      data: {
        ...data,
        disciplinas: data.disciplinas,
        idAlunos: data.idAlunos,
      },
    });
  },

  async delete(id: number) {
    return prisma.turma.delete({
      where: { id },
    });
  },

  async vincularAlunosNaTurma(turmaId: number) {
    try {
      const alunos: Aluno[] = await fetchAlunos(); // Agora o TypeScript reconhece o tipo Aluno[]

      for (const aluno of alunos) {
        if (aluno.turmaId === turmaId) {
          console.log(`Aluno ${aluno.nome} já está vinculado à turma ${turmaId}`);
          continue;
        }

        await prisma.turma.create({
          data: {
            nome: aluno.nome,
            descricao: `Aluno vinculado à turma ${turmaId}`,
            disciplinas: [], // Ajuste conforme necessário
            idAlunos: aluno.id,
          },
        });

        console.log(`Aluno ${aluno.nome} vinculado à turma ${turmaId}`);
      }

      console.log(`Todos os alunos foram processados para a turma ${turmaId}`);
    } catch (error) {
      console.error(`Erro ao vincular alunos à turma ${turmaId}:`, error);
      throw new Error('Erro ao vincular alunos à turma');
    }
  },
};
