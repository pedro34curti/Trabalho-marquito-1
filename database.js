import { sql } from './db.js'
import { randomUUID } from 'crypto'

export class DatabaseLivros {
    async createLivro(livro) {
        const id = randomUUID();
        const titulo = livro.titulo;
        const resumo = livro.resumo;
        const genero = livro.genero;

        await sql`insert into livros (id, titulo, resumo, genero)
        values (${id}, ${titulo}, ${resumo}, ${genero})` 
    }
}