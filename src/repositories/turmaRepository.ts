import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateTurmaDTO {
  nome: string;
  descricao: string;
  disciplinas: string[];
  idAlunos: number; // Corrigido para refletir o modelo Prisma
}

export const turmaRepository = {
  async create(data: CreateTurmaDTO) {
    return prisma.turma.create({
      data: {
        nome: data.nome,
        descricao: data.descricao,
        disciplinas: data.disciplinas, // Salvo como JSON automaticamente
        idAlunos: data.idAlunos, // Campo obrigatório do Prisma
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
        disciplinas: data.disciplinas, // Certifique-se de que os dados sejam válidos
        idAlunos: data.idAlunos, // Não omitir se for obrigatório
      },
    });
  },

  async delete(id: number) {
    return prisma.turma.delete({
      where: { id },
    });
  },
};
