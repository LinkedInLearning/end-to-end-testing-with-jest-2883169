# Learning End to End Testing with Jest
This is the repository for the LinkedIn Learning course `Learning End to End Testing with Jest`. The full course is available from [LinkedIn Learning][ LinkedInLearning/end-to-end-testing-with-jest-2883169].

![course-name-alt-text][lil-thumbnail-url] 

_See the readme file in the main branch for updated instructions and information._
## Instructions
This repository has branches for each of the videos in the course. You can use the branch pop up menu in github to switch to a specific branch and take a look at the course at that stage, or you can add `/tree/BRANCH_NAME` to the URL to go to the branch you want to access.

## Branches
The branches are structured to correspond to the videos in the course. The naming convention is `CHAPTER#_MOVIE#`. As an example, the branch named `02_03` corresponds to the second chapter and the third video in that chapter. 
Some branches will have a beginning and an end state. These are marked with the letters `b` for "beginning" and `e` for "end". The `b` branch contains the code as it is at the beginning of the movie. The `e` branch contains the code as it is at the end of the movie. The `main` branch holds the final state of the code when in the course.

## Installing
1. To use these exercise files, you must have the following installed:
	- Git
	- Node.js
	- MongoDB
2. Clone this repository into your local machine using the terminal (Mac), CMD (Windows), or a GUI tool like SourceTree.
3. Navigate to the location of the folder
4. Run `npm install` to install dependencies
5. Rename `.env.example` to `.env` and update the variables accordingly
6. Run `npm run start` to get the app started on your development environment
### Seed Data to Database
To seed data to database run the command `npm run seed`, and to rollback run `npm run seed:rollback`. After seeding, you can login with the following details: `username: admin, password: okay`
### Running the tests
To run the tests, run the commannd `npm run test`
_The tests, test the api endpoints to ensure that they work as expected and return the required response. The output of the test also shows the code coverage_


[0]: # (Replace these placeholder URLs with actual course URLs)

[lil-course-url]: https://www.linkedin.com/learning/end-to-end-testing-with-jest-2883169
[lil-thumbnail-url]: http://

