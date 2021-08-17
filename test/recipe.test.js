const request = require ('supertest');
const bcrypt = require('bcrypt');
const app = require ('../index');
const User = require('../database/models/users');
const mongoose = require('../database/dbConection');
const UserService = require ('../database/services/users');
const RecipeService = require('../database/services/recipes');
let id;
let token;
describe ('test the recipes API', ()=>{
    beforeAll (async ()=>{
        //create a test user
        const password = bcrypt.hashSync('okay', 10);
        await User.create({
            username : 'admin',
            password
        });
    });
    afterAll (async ()=>{
        await User.deleteMany();
        mongoose.disconnect();
    });
    //test login
    describe('POST/login',()=>{
        it ('authenticate user and sign him in', async ()=>{
            //DATA YOU WANT TO SAVE TO DB
            const user = {
                username : 'admin',
                password : 'okay'
            };
            const res = await request (app)
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
                        username: res.body.data.username
                    }),
                }),
            );
        });
        it ('do not sign him in, password can not be empty',
        async ()=>{
            //DATA YOU WANT TO SAVE TO DB
            const user ={
                username : 'admin'
            };
            const res = await request (app)
            .post('/login')
            .send (user);
            expect(res.statusCode).toEqual(400);
            expect(res.body).toEqual(
                expect.objectContaining({
                    success : false,
                    message : 'username or password can not be empty'
                }),
            );
        });
        it ('do not sign him in,username field can not be empty',
        async()=>{
            //DATA YOU WANT TO SAVE TO DB
            const user ={
                password : 'okay'
            };
            const res = await request (app)
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
        it ('do not sign him in, username does not exist',
        async ()=>{
            //DATA YOU WANT TO SAVE TO DB
            const user = {
                username : 'chii',
                password : 'okay'
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
        it ('do not sign him in, incorrect password', async()=>{
            //DATA YOU WANT TO SAVE TO DB
            const user = {
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
        it ('do not sign him in, internal server error',
        async ()=>{
            //DATA YOU WANT TO SAVE TO DB
            const user ={
                username : 'admin',
                password : 'okay'
            };
            jest.spyOn(UserService, 'findByUsername')
            .mockRejectedValueOnce(new Error());
            const res = await request (app)
            .post('/login')
            .send(user);
            expect(res.statusCode).toEqual(500);
            expect(res.body).toEqual(
                expect.objectContaining({
                    success : false,
                    message : 'login failed.'
                }),
            );
        });
    });
    //test create recipes
    describe('POST/recipes',()=>{
        it ('it should save new recipe to db',
        async()=>{
            //DATA YOU WANT TO SAVE TO DB
            const recipe = {
                name : 'chicken nuggets',
                difficulty : 2,
                vegetarian : true
            };
            const res = await request(app)
            .post('/recipes')
            .send(recipe)
            .set('Authorization',`Bearer ${token}`);
            expect (res.statusCode).toEqual(201);
            expect(res.body).toEqual(
                expect.objectContaining({
                    success : true,
                    data : expect.any(Object)
                }),
            );
            id = res.body.data._id;
        });
        it('it should not save new recipe to db,incalid vegetarian value',
        async ()=>{
            //DATA YOU WANT TO SAVE TO DB
            const recipe = {
                name : 'chicken nuggets',
                difficulty : 3,
                vegetarian : 'true'
            };
            const res = await request(app)
            .post('/recipes')
            .send(recipe)
            .set('Authorization',`Bearer ${token}`);
            expect(res.statusCode).toEqual(400);
            expect(res.body).toEqual(
                expect.objectContaining({
                    success: false,
                    message : 'vegetarian field should be boolean'
                }),
            );
        });
        it ('it should not save new user to db,empty name field',
        async ()=>{
            //DATA YOU WANT TO SAVE TO DB
            const recipe ={
                difficulty: 2,
                vegetarian : true
            };
            const res = await request (app)
            .post('/recipes')
            .send(recipe)
            .set('Authorization',`Bearer ${token}`);
            expect(res.statusCode).toEqual(400);
            expect(res.body).toEqual(
                expect.objectContaining({
                    success : false,
                    message : 'name field can not be empty'
                }),
            );
        });
        it ('it should not save new recipe to db,invalid difficulty field',
        async()=>{
            //DATA YOU WANT TO SAVE TO DB
            const recipe = {
                name : 'jollof rice',
                difficulty : '2',
                vegetarian : true
            };
            const res = await request(app)
            .post('/recipes')
            .send(recipe)
            .set('Authorization',`Bearer ${token}`);
            expect (res.statusCode).toEqual(400);
            expect(res.body).toEqual(
                expect.objectContaining({
                    success : false,
                    message : 'difficulty field should be a number'
                }),
            );
        });
        it('it should not save new recipe to db,invalid token',
        async()=>{
            //DATA YOU WANT TO SAVE TO DB
            const recipe = {
                name : 'chicken nuggets',
                difficulty : 2,
                vegetarian : true
            };
            const res  = await request (app)
            .post('/recipes')
            .send(recipe)
            .set('Authorization',`Bearer siuogusire7893034pt4`);
            expect(res.statusCode).toEqual(403);
            expect(res.body).toEqual(
                expect.objectContaining({
                    message : 'Unauthorized'
                }),
            );
        });
        it ('it should not save new recipe to db, internal server error',
        async ()=>{
            //DATA YOU WANT TO SAVE TO DB
            const recipes = {
                name : 'chicken nuggets',
                difficulty : 2,
                vegetarian : true
            };
            jest.spyOn(RecipeService, 'saveRecipes')
            .mockRejectedValueOnce(new Error());
            const res  = await request (app)
            .post('/recipes')
            .send(recipes)
            .set('Authorization', `Bearer ${token}`);
            expect(res.statusCode).toEqual(500);
            expect(res.body).toEqual(
                expect.objectContaining({
                    success : false,
                    message : 'Failed to save recipes!'
                }),
            );
        });
    });
    //test get all recipe
    describe('GET/recipes',()=>{
        it('it should retrieve all the recipes in db',
        async()=>{
            const res = await request(app)
            .get('/recipes');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(
                expect.objectContaining({
                    success : true,
                    data : expect.any(Object),
                }),
            );
        });
        it ('it should not retrieve any recipe from db, internal server error',
        async ()=>{
            jest.spyOn(RecipeService, 'allRecipes')
            .mockRejectedValueOnce(new Error());
            const res = await request (app)
            .get('/recipes')
            .send();
            expect(res.statusCode).toEqual(500);
            expect(res.body).toEqual(
                expect.objectContaining({
                    success : false,
                    message : 'Some error occurred while retrieving recipes.'
                }),
            );
        });
    });
    //test get a particular recipe
    describe('GET/recipes/:id',()=>{
        it('Retrieve a specified recipes in db',
        async()=>{
            const res = await request (app)
            .get(`/recipes/${id}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(
                expect.objectContaining({
                    success : true,
                    data : expect.any(Object)
                }),
            );
        });
        it ('it should not retrieve any recipe from the db,invalid id passed',
        async ()=>{
            const res = await request(app)
            .get('/recipes/282hsowj8byewiuewgfg6732i2');
            expect(res.statusCode).toEqual(400);
            expect(res.body).toEqual(
                expect.objectContaining({
                    success : false,
                    message : 'Recipe with id 282hsowj8byewiuewgfg6732i2 does not exist'
                }),
            );
        });
        it ('it should not retrieve any recipe from db, internal server error',
        async ()=>{
            //DATA YOU WANT TO SAVE TO DB
            jest.spyOn(RecipeService, 'fetchById')
            .mockRejectedValueOnce(new Error());
            const res = await request(app)
            .get(`/recipes/${id}`);
            expect(res.statusCode).toEqual(500);
            expect(res.body).toEqual(
                expect.objectContaining({
                    success : false,
                    message : 'Some error occurred while retrieving recipe details.'
                }),
            );
        });
    });
    //test update recipe
    describe('PATCH/recipes/:id',()=>{
        it ('update the recipe record in db',
        async()=>{
            //DATA YOU WANT TO UPDATE IN DB
            const recipes = {
                name : 'chicken nuggets'
            };
            const res = await request(app)
            .patch(`/recipes/${id}`)
            .send (recipes)
            .set('Authorization',`Bearer ${token}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(
                expect.objectContaining({
                    success : true,
                    data : expect.any(Object)
                }),
            );
        });
        it('it should not update recipe in db,invalid difficulty value',
        async()=>{
            // DATA YOU WANT TO UPDATE IN DB
            const recipe = {
                name : 'jollof rice',
                difficulty : '2'
            };
            const res = await request (app)
            .patch(`/recipes/${id}`)
            .send (recipe)
            .set('Authorization',`Bearer ${token}`);
            expect(res.statusCode).toEqual(400);
            expect(res.body).toEqual(
                expect.objectContaining({
                    success : false,
                    message : 'difficulty field should be a number'
                }),
            );
        });
        it ('it should not update recipe in db, invalid vegetarian value',
        async ()=>{
            // DATA YOU WANT TO UPDATE IN DB
            const recipe = {
                difficulty: 3,
                vegetarian : 'true'
            };
            const res = await request (app)
            .patch(`/recipes/${id}`)
            .send (recipe)
            .set('Authorization', `Bearer ${token}`);
            expect(res.statusCode).toEqual(400);
            expect(res.body).toEqual(
                expect.objectContaining({
                    success : false,
                    message : 'vegetarian field should be boolean'
                }),
            );
        });
        it ('it should not update recipe in db, invalid id passed',
        async()=>{
            //DATA YOU WANT TO UPDATE IN DB
            const recipe = {
                difficulty: 3
            };
            const res = await request(app)
            .patch ('/recipes/uowe8ww78wowfonfwh27823t67200')
            .send(recipe)
            .set('Authorization',`Bearer ${token}`);
            expect(res.statusCode).toEqual(400);
            expect(res.body).toEqual(
                expect.objectContaining({
                    success : false,
                    message : 'Recipe with id uowe8ww78wowfonfwh27823t67200 does not exist'
                }),
            );
        });
        it ('it should not update recipe in db, invalid token',
        async()=>{
            // DATA YOU WANT TO UPDATE IN DB
            const recipes = {
                name : 'chicken nuggets'
            };
            const res = await request(app)
            .patch (`/recipes/${id}`)
            .send (recipes)
            .set('Authorization', 'Bearer 0qhiwfhnfnwwn098h3w8e');
            expect(res.statusCode).toEqual(403);
            expect(res.body).toEqual(
                expect.objectContaining({
                    message : 'Unauthorized'
                }),
            );
        });
        it ('it should not update recipe in db, no update passed',
        async ()=>{
            // DATA YOU WANT UPDATE IN DB
            const recipes = {};
            const res = await request(app)
            .patch (`/recipes/${id}`)
            .send (recipes)
            .set('Authorization', `Bearer ${token}`);
            expect(res.statusCode).toEqual(400);
            expect(res.body).toEqual(
                expect.objectContaining({
                    success : false,
                    message : 'field should not be empty'
                }),
            );
        });
        it ('it should not update recipe in db,internal server error',
        async ()=>{
            //DATA YOU WANT TO UPDATE IN DB
            const recipes = {
                name : 'chicken nuggets'
            };
            jest.spyOn(RecipeService, 'fetchByIdAndUpdate')
            .mockRejectedValueOnce(new Error());
            const res = await request(app)
            .patch(`/recipes/${id}`)
            .send(recipes)
            .set('Authorization',` Bearer ${token}`);
            expect(res.statusCode).toEqual(500);
            expect(res.body).toEqual(
                expect.objectContaining({
                    success : false,
                    message : 'An error occured while updating recipe'
                }),
            );
        });
    });
    //test delete recipe
    describe('DELETE /recipes/:id',()=>{
        it ('Delete the specified recipe', async ()=>{
            const res = await request (app)
            .delete(`/recipes/${id}`)
            .set('Authorization', `Bearer ${token}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(
                expect.objectContaining({
                    success : true,
                    message : 'Recipe successfully deleted'
                }),
            );
        });
        it ('Fail to delete the specified recipe, invalid token',
        async ()=>{
            const res = await request(app)
            .delete (`/recipes/${id}`)
            .set('Authorization',`Bearer dnsosuew8w9e729203332`);
            expect(res.statusCode).toEqual(403);
            expect(res.body).toEqual(
                expect.objectContaining({
                    message : 'Unauthorized'
                }),
            );
        });
        it('Fail to delete the specified recipe, internal server error',
        async ()=>{
            jest.spyOn(RecipeService, 'fetchByIdAndDelete')
            .mockRejectedValueOnce(new Error());
            const res = await request(app)
            .delete(`/recipes/${id}`)
            .set('Authorization',`Bearer ${token}`);
            expect(res.statusCode).toEqual(500);
            expect(res.body).toEqual(
                expect.objectContaining({
                    success : false,
                    message : 'An error occured while deleting recipe'
                }),
            );
        });      
    });
});