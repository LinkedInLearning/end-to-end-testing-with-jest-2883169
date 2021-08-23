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
        it ('do not sign him in, password field can not be empty',
        async ()=>{
            // DATA YOU WANT TO SAVE TO DB
            const user = {
                username : 'admin'
            };
            const res = await request(app)
            .post('/login')
            .send(user);
            expect(res.statusCode).toEqual(400);
            expect(res.body).toEqual(
                expect.objectContaining({
                    success : false,
                    message : 'username or password can not be empty'
                }),
            );
        });
        it ('do not sign him in, username field can not be empty',
        async ()=>{
            // DATA YOU WANT TO SAVE TO DB
            const user ={
                password : 'okay'
            };
            const res = await request(app)
            .post('/login')
            .send(user);
            expect(res.statusCode).toEqual(400);
            expect(res.body).toEqual(
                expect.objectContaining({
                    success : false,
                    message : 'username or password can not be empty'
                }),
            );
        });
        it ('do not sign him in, username does not exist',async ()=>{
            // DATA YOU WANT TO SAVE TO DB
            const user ={
                username : 'chii',
                password :'okay'
            };
            const res = await request(app)
            .post('/login')
            .send(user);
            expect(res.statusCode).toEqual(400);
            expect(res.body).toEqual(
                expect.objectContaining({
                    success : false,
                    message : 'Incorrect username or password'
                }),
            );
        });
        it ('do not sign him in, incorrect password',async ()=>{
            // DATA YOU WANT TO SAVE TO DB
            const user ={
                username : 'admin',
                password : 'okay1'
            };
            const res = await request(app)
            .post('/login')
            .send(user);
            expect(res.statusCode).toEqual(400);
            expect(res.body).toEqual(
                expect.objectContaining({
                    success : false,
                    message : 'Incorrect username or password'
                }),
            );
        });
    });
    //test create recipes
    describe('POST/recipes',()=>{
        it ('it should save new  recipe to db', async ()=>{
            // DATA YOU WANT TO SAVE TO DB
            const recipes = {
                name : 'chicken nuggets',
                difficulty : 2,
                vegetarian : true
            };
            const res = await request(app)
            .post('/recipes')
            .send(recipes)
            .set('Authorization', `Bearer ${token}`);
            expect(res.statusCode).toEqual(201);
            expect(res.body).toEqual(
                expect.objectContaining({
                    success : true,
                    data : expect.any(Object)
                }),
            );
            id = res.body.data._id;
        });
        it ('it should not save new recipe to db, invalid vegetarian value',
        async ()=>{
            // DATA YOU WANT TO SAVE TO DB
            const recipe ={
                name : 'chicken nuggets',
                difficulty : 3,
                vegetarian : 'true'
            };
            const res = await request(app)
            .post('/recipes')
            .send(recipe)
            .set('Authorization', `Bearer ${token}`);
            expect(res.statusCode).toEqual(400)
            expect(res.body).toEqual(
                expect.objectContaining({
                    success : false,
                    message : 'vegetarian field should be boolean'
                }),
            );
        });
    });
});