const request = require('supertest');
let server;
const { Genre } = require('../../models/genre');
const { User } = require('../../models/user');

describe('authorization middleware', () => {
    
    let token;

    beforeEach(() => { 
        server = require('../../index');
        token = new User().generateAuthToken();
    });
    afterEach(async () => { 
        server.close();
        await Genre.remove({});
    });

    const exec = async () => {
        return await request(server)
        .post('/api/genres')
        .set('x-authentication-token', token)
        .send({ name: 'genre1' });
    };
    
    it('should return 401 if no token is provided', async () => {
        token = '';

        const res = await exec();
        expect(res.status).toBe(401);
    })

    it('should return 400 if token is invalid', async () => {
        token = 'a';

        const res = await exec();
        expect(res.status).toBe(400);
    })

    it('should return 200 if token is valid', async () => {
        const res = await exec();
        expect(res.status).toBe(200);
    })
})