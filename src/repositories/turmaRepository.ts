import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

export interface CreateTurmaDTO {
  nome: string;
  descricao: string;
  disciplinas: string[];
  idAlunos: number[];
  nomesAlunos?: string[];
  idFuncionarios?: number[];
  nomesFuncionarios?: string[];
  cargosFuncionarios?: string[];
}

export const turmaRepository = {
  async create(data: CreateTurmaDTO) {
    return prisma.turma.create({
      data: {
        nome: data.nome,
        descricao: data.descricao,
        disciplinas: JSON.stringify(data.disciplinas),
        idAlunos: JSON.stringify(data.idAlunos),
        nomesAlunos: JSON.stringify(data.nomesAlunos || []),
        idFuncionarios: JSON.stringify(data.idFuncionarios || []),
        nomesFuncionarios: JSON.stringify(data.nomesFuncionarios || []),
        cargosFuncionarios: JSON.stringify(data.cargosFuncionarios || []),
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
        disciplinas: data.disciplinas ? JSON.stringify(data.disciplinas) : undefined,
        idAlunos: data.idAlunos ? JSON.stringify(data.idAlunos) : undefined,
        nomesAlunos: data.nomesAlunos ? JSON.stringify(data.nomesAlunos) : undefined,
        idFuncionarios: data.idFuncionarios ? JSON.stringify(data.idFuncionarios) : undefined,
        nomesFuncionarios: data.nomesFuncionarios ? JSON.stringify(data.nomesFuncionarios) : undefined,
        cargosFuncionarios: data.cargosFuncionarios ? JSON.stringify(data.cargosFuncionarios) : undefined,
      },
    });
  },

  async delete(id: number) {
    return prisma.turma.delete({
      where: { id },
    });
  },

  async vincularAlunoNaTurma(turmaId: number, alunoId: number) {
    try {
      const turma = await this.findById(turmaId);

      if (!turma) {
        throw new Error('Turma não encontrada');
      }

      const alunoResponse = await axios.get<{ id: number; nome: string }>(
        `https://gestaoaluno-production.up.railway.app/api/alunos/${alunoId}`
      );
      const aluno = alunoResponse.data;

      if (!aluno) {
        throw new Error('Aluno não encontrado no serviço externo');
      }

      const idAlunos: number[] = turma.idAlunos ? JSON.parse(turma.idAlunos as string) : [];
      const nomesAlunos: string[] = turma.nomesAlunos ? JSON.parse(turma.nomesAlunos as string) : [];

      if (idAlunos.includes(aluno.id)) {
        throw new Error('Aluno já vinculado a esta turma');
      }

      idAlunos.push(aluno.id);
      nomesAlunos.push(aluno.nome);

      return this.update(turmaId, {
        idAlunos,
        nomesAlunos,
      });
    } catch (error) {
      console.error(`Erro ao vincular aluno à turma ${turmaId}:`, error);
      throw new Error('Erro ao vincular aluno à turma');
    }
  },

  async vincularFuncionarioNaTurma(turmaId: number, funcionarioId: number) {
    try {
      const turma = await this.findById(turmaId);

      if (!turma) {
        throw new Error('Turma não encontrada');
      }

      const funcionarioResponse = await axios.get<{ id: number; nome: string; profissao: string }>(
        `https://micronode-production.up.railway.app/api/funcionario/${funcionarioId}`
      );
      const funcionario = funcionarioResponse.data;

      if (!funcionario) {
        throw new Error('Funcionário não encontrado no serviço remoto');
      }

      const idFuncionarios: number[] = turma.idFuncionarios ? JSON.parse(turma.idFuncionarios as string) : [];
      const nomesFuncionarios: string[] = turma.nomesFuncionarios ? JSON.parse(turma.nomesFuncionarios as string) : [];
      const cargosFuncionarios: string[] = turma.cargosFuncionarios ? JSON.parse(turma.cargosFuncionarios as string) : [];

      if (idFuncionarios.includes(funcionarioId)) {
        throw new Error('Funcionário já vinculado a esta turma');
      }

      idFuncionarios.push(funcionarioId);
      nomesFuncionarios.push(funcionario.nome);
      cargosFuncionarios.push(funcionario.profissao || 'Não especificado');

      return this.update(turmaId, {
        idFuncionarios,
        nomesFuncionarios,
        cargosFuncionarios,
      });
    } catch (error) {
      console.error(`Erro ao vincular funcionário à turma ${turmaId}:`, error);
      throw new Error('Erro ao vincular funcionário à turma');
    }
  },
};
