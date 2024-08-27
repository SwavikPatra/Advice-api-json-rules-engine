const { Engine } = require("json-rules-engine");
const axios = require("axios");

// Create a new rule engine
let engine = new Engine();

// Define a rule to check if the length of the advice is more than 50 characters
let adviceLengthRule = {
  conditions: {
    all: [
      {
        // All conditions need to be true for the rule to trigger
        fact: "advice-length", // Fact to evaluate
        operator: "greaterThan", // Operator for comparison
        value: 50, // The threshold value (advice length must be greater than 50 characters)
      },
    ],
  },
  event: {
    type: "long-advice", // Event type if conditions are met
    params: {
      message: "Advice is longer than 50 characters.", // Message to log or handle
    },
  },
};

// Add the rule to the engine
engine.addRule(adviceLengthRule);

// Define a fact named 'advice-length' to fetch the length of the advice
engine.addFact("advice-length", async (params, almanac) => {
  console.log("Fetching advice from Advice Slip API...");

  // Fetch a random piece of advice from the Advice Slip API
  const response = await axios.get("https://api.adviceslip.com/advice");

  // Extract the advice text from the response
  const adviceText = response.data.slip.advice;
  console.log("Advice:", adviceText);

  // Return the length of the advice text
  return adviceText.length;
});

let facts = {};

// Run the engine with the provided facts
engine
  .run(facts)
  .then(({ events }) => {
    if (events.length > 0) {
      // If the rule was triggered, print the message
      events.forEach((event) => console.log(event.params.message));
    } else {
      // If no rules were triggered, print a different message
      console.log("Advice is less than or equal to 50 characters.");
    }
  })
  .catch(console.error);
