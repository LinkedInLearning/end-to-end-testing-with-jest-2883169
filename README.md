# Learning End-to-End Testing with Jest
This is the repository for the LinkedIn Learning course Learning End-to-End Testing with Jest. The full course is available from [LinkedIn Learning][lil-course-url].

![Learning End-to-End Testing with Jest][lil-thumbnail-url] 

Testing small parts of an application is fairly easy, but as you assemble systems, the test complexity often grows with the number of interconnected systems. Sometimes, rather than testing just the parts, you want to test the whole process, as one large set. In this course, Chinyelu Ibute shows you how the JavaScript testing framework, Jest, lets you create comprehensive tests so you can verify the functionality of your entire application. Chinyelu starts with the basics of the test-driven development, including the different types. She then shows how to write an end-to-end test for a RESTful web-service application built with Node.js and MongoDB using Jest. Finally, she explains how to test the application workflow from beginning to end, with a high code coverage.

## Instructions
This repository has branches for each of the videos in the course. You can use the branch pop up menu in github to switch to a specific branch and take a look at the course at that stage, or you can add `/tree/BRANCH_NAME` to the URL to go to the branch you want to access.

## Branches
The branches are structured to correspond to the videos in the course. The naming convention is `CHAPTER#_MOVIE#`. As an example, the branch named `02_03` corresponds to the second chapter and the third video in that chapter. 
Some branches will have a beginning and an end state. These are marked with the letters `b` for "beginning" and `e` for "end". The `b` branch contains the code as it is at the beginning of the movie. The `e` branch contains the code as it is at the end of the movie. The `main` branch holds the final state of the code when in the course.

When switching from one exercise files branch to the next after making changes to the files, you may get a message like this:

    error: Your local changes to the following files would be overwritten by checkout:        [files]
    Please commit your changes or stash them before you switch branches.
    Aborting

To resolve this issue:
	
    Add changes to git using this command: git add .
	Commit changes using this command: git commit -m "some message"

## Installing
1. To use these exercise files, you must have the following installed:
	- [list of requirements for course]
2. Clone this repository into your local machine using the terminal (Mac), CMD (Windows), or a GUI tool like SourceTree.
3. [Course-specific instructions]


### Instructor

Chinyelu Ibute 
                            


                            

Check out my other courses on [LinkedIn Learning](https://www.linkedin.com/learning/instructors/chinyelu-ibute).

[lil-course-url]: https://www.linkedin.com/learning/learning-end-to-end-testing-with-jest
[lil-thumbnail-url]: https://cdn.lynda.com/course/2883169/2883169-1634846529237-16x9.jpg

