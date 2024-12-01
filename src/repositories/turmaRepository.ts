import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateTurmaDTO {
  nome: string;
  descricao: string;
  disciplinas: string[];
  idAluno: number;
}

export const turmaRepository = {
  async create(data: CreateTurmaDTO) {
    return prisma.turma.create({
      data,
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
      data,
    });
  },

  async delete(id: number) {
    return prisma.turma.delete({
      where: { id },
    });
  },
};
