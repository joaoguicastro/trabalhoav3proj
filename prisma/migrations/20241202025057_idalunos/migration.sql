/*
  Warnings:

  - Added the required column `idAlunos` to the `Turma` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `turma` ADD COLUMN `idAlunos` INTEGER NOT NULL;
