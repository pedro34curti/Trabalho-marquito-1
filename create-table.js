import { sql } from './db.js'

sql`
  CREATE TABLE livros (
      id text PRIMARY KEY,
      titulo character varying(255),
      resumo character varying(255),
       genero character varying(255)
  );
`.then(() => {
  console.log('tabela criada');
})