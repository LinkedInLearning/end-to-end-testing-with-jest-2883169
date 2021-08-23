const request = require('supertest');
const bcrypt = require('bcrypt');
const app = require ('../index');
const User = require('../database/models/users');
const mongoose = require('../database/dbConection');
let id;
let token;
describe('test the recipes API', ()=>{
    beforeAll(async ()=>{
        //create a test user
        const password = bcrypt.hashSync('okay', 10);
        await User.create({
            username :'admin',
            password
        });
    });
    afterAll(async ()=>{
        await User.deleteMany();
        mongoose.disconnect();
    });
    //test login
    describe ('POST/login',()=>{
        it('authenticate user and sign him in',async ()=>{
            //DATA YOU WANT TO SAVE TO DB
            const user ={
                username : 'admin',
                password : 'okay'
            };
            const res = await request(app)
            .post('/login')
            .send(user);
            token = res.body.accessToken;
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(
                expect.objectContaining({
                    accessToken : res.body.accessToken,
                    success : true,
                    data : expect.objectContaining({
                        id : res.body.data.id,
                        username : res.body.data.username
                    }),
                }),
            );
        });
    });
});