/*
  Warnings:

  - Changed the type of `idAlunos` on the `turma` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE `turma` DROP COLUMN `idAlunos`,
    ADD COLUMN `idAlunos` JSON NOT NULL;
