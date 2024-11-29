import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateTurmaDTO {
  nome: string;
  descricao: string;
  disciplinas: string[];
}

export const turmaRepository = {
  // Criar uma nova turma
  async create(data: CreateTurmaDTO) {
    return prisma.turma.create({
      data,
    });
  },

  // Listar todas as turmas
  async findAll() {
    return prisma.turma.findMany();
  },

  // Buscar uma turma por ID
  async findById(id: number) {
    return prisma.turma.findUnique({
      where: { id },
    });
  },

  // Atualizar uma turma
  async update(id: number, data: Partial<CreateTurmaDTO>) {
    return prisma.turma.update({
      where: { id },
      data,
    });
  },

  // Excluir uma turma
  async delete(id: number) {
    return prisma.turma.delete({
      where: { id },
    });
  },
};
