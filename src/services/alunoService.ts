import fetch from 'node-fetch';
import { Aluno } from '../repositories/turmaRepository'; // Certifique-se de importar o tipo Aluno

export async function fetchAlunos(): Promise<Aluno[]> {
  const response = await fetch('https://gestaoaluno-production.up.railway.app/alunos', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Erro ao buscar alunos: ${response.statusText}`);
  }

  // Use a conversão explícita de tipo no response.json()
  const alunos = (await response.json()) as Aluno[]; // Converte explicitamente o retorno para o tipo Aluno[]
  return alunos;
}
