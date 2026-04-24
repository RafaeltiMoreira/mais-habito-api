import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  // Check if templates already exist
  const existing = await knex.raw(`SELECT COUNT(*) FROM challenge_templates`);
  if (parseInt(existing.rows[0].count) > 0) return;

  await knex.raw(`
    INSERT INTO challenge_templates (title, description, duration_days) VALUES
    ('7 Dias de Foco Total', 'Complete todas as suas tarefas diárias por 7 dias consecutivos. Mantenha o foco e a disciplina!', 7),
    ('21 Dias de Hábitos', 'Dizem que 21 dias formam um hábito. Aceite este desafio e prove para si mesmo!', 21),
    ('Maratona de 30 Dias', 'Um mês inteiro de dedicação. Complete suas tarefas todos os dias por 30 dias.', 30),
    ('Sprint de 3 Dias', 'Um desafio rápido para começar. Mantenha sua rotina por 3 dias seguidos.', 3),
    ('Quinzena Produtiva', 'Duas semanas de produtividade máxima. 14 dias para transformar sua rotina.', 14),
    ('Desafio Relâmpago', 'Apenas 1 dia! Complete todas as suas tarefas hoje e ganhe o selo de conclusão.', 1),
    ('Semestre de Disciplina', 'O desafio supremo: 60 dias de consistência. Apenas para os mais dedicados!', 60)
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`DELETE FROM challenge_templates`);
}
