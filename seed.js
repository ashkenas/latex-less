import { ObjectId } from 'mongodb';
import { users } from 'server/src/mongo/collections.js';

await (await users()).insertOne({
  "_id": ObjectId("645a96124185a7252f689741"),
  "firebaseId": "EuKKu7d7GAYiblfb5iEfk0IiAFw1",
  "projects": [
    {
      "_id": ObjectId("645a96914185a7252f689745"),
      "name": "Algebra Homework",
      "left": "Beep Boop",
      "right": "Ms. Mathwiz",
      "lastEdited": 1683659215359,
      "equations": [
        { "_id": ObjectId("645a96154185a7252f689742"), "name": "Problem Equation", "text": "y=x^2+5x+6" },
        { "_id": ObjectId("645a96404185a7252f689744"), "name": "Quadratic Roots", "text": "x=\\frac{-b\\pm\\sqrt{b^2-4ac}}{2a}" },
        { "_id": ObjectId("645a97094185a7252f689747"), "name": "Step 1", "text": "x=\\frac{-5\\pm\\sqrt{5^2-4\\left(1\\right)\\left(6\\right)}}{2\\left(1\\right)}" },
        { "_id": ObjectId("645a97244185a7252f689748"), "name": "Step 2", "text": "x=\\frac{-5\\pm\\sqrt{25-24}}{2}" },
        { "_id": ObjectId("645a97364185a7252f689749"), "name": "Step 3", "text": "x=\\frac{-5\\pm\\sqrt{1}}{2}" },
        { "_id": ObjectId("645a97434185a7252f68974a"), "name": "Step 4", "text": "x=\\frac{-5}{2}\\pm\\frac{1}{2}" },
        { "_id": ObjectId("645a975f4185a7252f68974b"), "name": "Step 5", "text": "x=-3,-2" },
        { "_id": ObjectId("645a98464185a7252f68974d"), "name": "P2 Work", "text": "7-3=4" }
      ],
      "responses": [
        {
          "_id": ObjectId("645a96ad4185a7252f689746"),
          "name": "Problem 1",
          "text": "Equation: {{problem equation}}\nRoots:\n{{{quadratic roots}}}\n{{{step 1}}}\n{{{step 2}}}\n{{{step 3}}}\n{{{step 4}}}\n{{{step 5}}}"
        },
        {
          "_id": ObjectId("645a97b64185a7252f68974c"),
          "name": "Problem 2",
          "text": "If Johnny has 7 apples, and Billy stole 3, then Johnny must have just 4 apples left.\n{{{p2 work}}}"
        }
      ]
    },
    {
      "_id": ObjectId("645a99e44185a7252f68974e"), "name": "Calculus Homework",
      "left": "Beep Boop",
      "right": "Mr. Newton",
      "lastEdited": 1683660840455,
      "equations": [
        { "_id": ObjectId("645a96404185a7252f689744"), "name": "Problem", "text": "\\int_3^5x^2dx" },
        { "_id": ObjectId("645a9eb96aa5feb5de8e9920"), "name": "Step 1", "text": "\\left[\\frac{x^3}{3}\\right]_3^5" },
        { "_id": ObjectId("645a9f426aa5feb5de8e9921"), "name": "Step 2", "text": "\\frac{5^3}{3}-\\frac{3^3}{3}" },
        { "_id": ObjectId("645a9f556aa5feb5de8e9922"), "name": "Step 3", "text": "\\frac{125}{3}-9" },
        { "_id": ObjectId("645a9f6e6aa5feb5de8e9923"), "name": "Answer", "text": "32\\frac{2}{3}" },
        { "_id": ObjectId("645a9f6f6aa5feb5de8e9924"), "name": "Funny Fraction", "text": "\\frac{\\text{I take up space}}{\\frac{\\text{Woo}}{\\frac{\\text{Woo}}{\\frac{\\text{Woo}}{\\frac{\\text{Woo}}{\\frac{\\text{Woo}}{\\frac{\\text{Woo}}{\\frac{\\text{Woo}}{\\frac{\\text{Woo}}{\\text{Woo}}}}}}}}}}" },
        { "_id": ObjectId("645a9f6f6aa5feb5de8e9925"), "name": "Other Funny Equation", "text": "\\int_{\\int_{\\int_{\\int_{\\int_{ }^{ }}^{ }}^{ }}^{ }}^{\\int_{\\int_{\\int_{\\int_{\\int_{ }^{ }}^{ }}^{ }}^{ }}^{ }}" }
      ],
      "responses": [
        {
          "_id": ObjectId("645a9df06aa5feb5de8e991c"),
          "name": "Problem 1",
          "text": "{{{problem}}}\n{{{step 1}}}\n{{{step 2}}}\n{{{step 3}}}\nThe answer is {{answer}}."
        },
        {
          "_id": ObjectId("645a9e626aa5feb5de8e991d"),
          "name": "Problem 2",
          "text": "Demo problem 2 sorry I really just ran out of ideas at this point but like you get the gist."
        },
        {
          "_id": ObjectId("645a9e776aa5feb5de8e991e"),
          "name": "Problem 3",
          "text": "You really can just keep creating these responses and it will just output all of them nicely for you."
        },
        {
          "_id": ObjectId("645a9e956aa5feb5de8e991f"),
          "name": "Problem Long",
          "text": "Here's an attempt at making it onto the next page.\n{{{funny fraction}}}\n{{{other funny equation}}}"
        }
      ]
    }
  ],
  "equations": [
    {
      "_id": ObjectId("645a96154185a7252f689742"),
      "name": "Linear Equation",
      "text": "y=mx+b"
    },
    {
      "_id": ObjectId("645a96314185a7252f689743"),
      "name": "Quadratic Equation",
      "text": "y=ax^2+bx+c"
    },
    {
      "_id": ObjectId("645a96404185a7252f689744"),
      "name": "Quadratic Roots",
      "text": "x=\\frac{-b\\pm\\sqrt{b^2-4ac}}{2a}"
    }
  ]
});

console.log('Seeded user "latexless.tester@gmail.com".');