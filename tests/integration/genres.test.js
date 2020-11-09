const request = require('supertest');
let server;
const { Genre } = require('../../models/genre');
const { User } = require('../../models/user');



describe('/api/genres', () => {

    beforeEach(() => { server = require('../../index'); });
    afterEach(async () => { 
        server.close();
        await Genre.remove({});
    });

    describe('GET /', () => {
        it('should return all genres', async () => {
            await Genre.collection.insertMany([
               { name: 'genre1' },
               { name: 'genre2' }, 
            ]);
            const res = await request(server).get('/api/genres');

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(g => g.name === 'genre1')).toBeTruthy();
            expect(res.body.some(g => g.name === 'genre2')).toBeTruthy();
        })
    })

    describe('GET /:id', () => {
        it('should return genre if valid id is passed', async () => {
            const genre = new Genre({ name: 'genre1' });
            await genre.save();

            const res = await request(server).get(`/api/genres/${genre._id}`);
            
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', genre.name);
        })

        it('should return 404 if invalid id is passes', async () => {
            const res = await request(server).get('/api/genres/123');
            expect(res.status).toBe(404);
        })
    })
    describe('POST /', () => {

        // Defining the happy path as a function, then in each test I 
        // modify one parameter that aligns with the name of the test. 
        let token;
        let name; 

        const execute = async () => {
            return await request(server)
             .post('/api/genres')
             .set('x-authentication-token', token)
             .send({ name: name });
        }

        beforeEach(() => {
            token = new User().generateAuthToken();
            name = 'genre1';
        })

        // checking authorization.
        it('should return 401 if client is not logged in', async () => {
            token = '';

            const res = await execute();

            expect(res.status).toBe(401);
        })

        it('should return 400 if genre is less than 2 characters', async () => {
            name = '1';
            const res = await execute();
 
            expect(res.status).toBe(400);
         })

         it('should return 400 if genre is more than 50 characters', async () => {
            name = new Array(52).join('a');

            const res = await execute();
 
             expect(res.status).toBe(400);
         })

         it('should save the genre if it\'s valid', async () => {

            await execute();
            
            const genre = await Genre.find({ name: 'genre1' });
            expect(genre).not.toBeNull();
         })

         it('should return the genre if it\'s valid', async () => {
            const res = await execute();
            
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', 'genre1');
         })
    })

    // describe('PUT /', () => {
    //     it('should return updated genre', () => {
            
    //     })
    // })

    // describe('DELETE /', () => {
    //     it('should return the deleteds genre', () => {
            
    //     })
    // })
})