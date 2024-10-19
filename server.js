import { fastify } from 'fastify';
import cors from '@fastify/cors';
import { DatabasePostgres } from './database-postgres.js';

const server = fastify();
const databasePostgres = new DatabasePostgres;

// CORS
server.register(cors, {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
})

// ENDPOINTS (CRUD):

// CREATE
server.post('/livros', async (request, reply) => {
    const body = request.body;
    let error = {};

    if (!body.titulo) {
        error.titulo = 'O titulo não foi Informado'
    } 
    
    if (!body.resumo) {
        error.resumo = 'O resumo não foi Informado'
    } 

    if (!body.genero) {
        error.genero = 'O genero não foi Informado'
    } 

    if(body.titulo && body.resumo && body.genero) {
        await databasePostgres.createlivro(body);
        return reply.status(201).send();
    } else {
        return reply.status(400).send(error);
    }

    // await databasePostgres.createlivro(body);
    // return reply.status(201).send();
})

// READ
server.get('/livros', async () => {
    const livros = await databasePostgres.listlivros();
    return livros;
});

// // UPDATE
// server.put('/livros/:id', async (request, reply) => {
//     const livroID = request.params.id;
//     const body = request.body;
//     await databasePostgres.updatelivro(livroID, body);

//     let error = {};

//     if(!livroID) {
//         error.id = 'O valor não foi informado'
//     }

//     if (!body.titulo) {
//         error.titulo = 'O titulo não foi Informado'
//     } 
    
//     if (!body.resumo) {
//         error.resumo = 'O resumo não foi Informad'
//     } 

//     if(body.titulo && body.resumo && livroID) {
//         await databasePostgres.updatelivro(livroID, body);
//         return reply.status(204).send('Alterado com sucesso');
//     } else {
//         return reply.status(400).send(error);
//     }

// })

// UPDATE
server.put('/livros/:id', async (request, reply) => {
    const livroID = request.params.id;
    const body = request.body;
    let error = {};

    // Validação do ID
    if (!livroID) {
        error.id = 'O ID do livro não foi informado';
    }

    // Validação dos campos
    if (!body.titulo) {
        error.titulo = 'O titulo não foi Informado';
    }
    
    if (!body.resumo) {
        error.resumo = 'A resumo não foi Informada';
    }

    if  (!body.genero) {
        error.genero= 'O genero não foi encontrado';
    }  
        
    // Se houver erros, retornar 400 com as mensagens
    if (Object.keys(error).length > 0) {
        return reply.status(400).send(error);
    }

    // Se todos os dados forem válidos, atualiza o livro
    try {
        const updatedlivro = await databasePostgres.updatelivro(livroID, body);
        
        if (updatedlivro) {
            return reply.status(204).send('Alterado com sucesso');
        } else {
            return reply.status(404).send({ error: 'livro não encontrado' });
        }
    } catch (err) {
        return reply.status(500).send({ error: 'Erro ao atualizar o livro' });
    }
});

// DELETE
server.delete('/livros/:id', async (request, reply) => {
    const livroID = request.params.id;
    await databasePostgres.deletelivro(livroID);

    return reply.status(204).send();
})

server.listen({
    port: 3333
});
