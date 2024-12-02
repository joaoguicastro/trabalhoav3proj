import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

export interface CreateTurmaDTO {
  nome: string;
  descricao: string;
  disciplinas: string[];
  idAlunos: number[];
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
        disciplinas: JSON.stringify(data.disciplinas), // Salva como JSON
        idAlunos: JSON.stringify(data.idAlunos), // Salva como JSON
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
      // Busca a turma existente
      const turma = await this.findById(turmaId);
  
      if (!turma) {
        throw new Error('Turma não encontrada');
      }
  
      // Busca os dados do aluno no microserviço
      const alunoResponse = await axios.get<Aluno>(`https://gestaoaluno-production.up.railway.app/api/alunos/${alunoId}`);
      const aluno = alunoResponse.data;
  
      // Valida se o aluno foi encontrado
      if (!aluno || !aluno.id || aluno.id !== alunoId) {
        throw new Error(`Aluno com ID ${alunoId} não encontrado no microserviço`);
      }
  
      // Converte idAlunos e disciplinas para arrays
      const idAlunos: number[] = turma.idAlunos ? JSON.parse(turma.idAlunos as unknown as string) : [];
      const disciplinas: string[] = turma.disciplinas ? JSON.parse(turma.disciplinas as unknown as string) : [];
  
      // Verifica se o aluno já está vinculado
      if (idAlunos.includes(alunoId)) {
        throw new Error(`Aluno ${alunoId} já vinculado à turma ${turmaId}`);
      }
  
      // Adiciona o aluno ao array
      idAlunos.push(alunoId);
      disciplinas.push(aluno.nome); // Usa o nome do aluno do microserviço
  
      // Atualiza a turma no banco de dados
      return this.update(turmaId, {
        idAlunos,
        disciplinas,
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(`Erro no microserviço de alunos: ${error.message}`);
        throw new Error('Erro ao acessar o microserviço de alunos');
      }
  
      console.error(`Erro ao vincular aluno à turma ${turmaId}:`, error);
      throw new Error('Erro ao vincular aluno à turma');
    }
  }  
};
