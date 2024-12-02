import axios from 'axios';

export interface Aluno {
  id: number;
  nome: string;
  email: string;
  dataNasc: string;
  turmaId: number;
}

const BASE_URL = 'https://gestaoaluno-production.up.railway.app/api/alunos';

export const alunoService = {
  async fetchAlunos(): Promise<Aluno[]> {
    try {
      const response = await axios.get(BASE_URL, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return response.data as Aluno[]; 
    } catch (error) {
      console.error('Erro ao buscar alunos:', error);
      throw new Error('Erro ao buscar alunos do microserviço');
    }
  },

  async fetchAlunoById(alunoId: number): Promise<Aluno> {
    try {
      const response = await axios.get(`${BASE_URL}/${alunoId}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.data) {
        throw new Error(`Aluno com ID ${alunoId} não encontrado`);
      }

      return response.data as Aluno;
    } catch (error) {
      console.error(`Erro ao buscar o aluno com ID ${alunoId}:`, error);
      throw new Error('Erro ao buscar o aluno do microserviço');
    }
  },
};

