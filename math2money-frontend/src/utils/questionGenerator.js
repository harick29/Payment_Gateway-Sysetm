const randomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export function generateQuestion(difficulty) {
  let a;
  let b;
  let question;
  let answer;

  if (difficulty === "easy") {
    const type = randomNumber(1, 3);

    if (type === 1) {
      a = randomNumber(1, 30);
      b = randomNumber(1, 30);

      question = `${a} + ${b}`;
      answer = a + b;
    } else if (type === 2) {
      a = randomNumber(10, 50);
      b = randomNumber(1, a);

      question = `${a} - ${b}`;
      answer = a - b;
    } else {
      a = randomNumber(2, 12);
      b = randomNumber(2, 12);

      question = `${a} × ${b}`;
      answer = a * b;
    }

    return {
      question,
      answer,
      difficulty: "easy",
      reward: 1,
    };
  }

  if (difficulty === "medium") {
    const type = randomNumber(1, 3);

    if (type === 1) {
      a = randomNumber(10, 50);
      b = randomNumber(10, 30);

      question = `${a} × ${b}`;
      answer = a * b;
    } else if (type === 2) {
      b = randomNumber(2, 15);
      answer = randomNumber(5, 30);
      a = b * answer;

      question = `${a} ÷ ${b}`;
    } else {
      a = randomNumber(20, 100);
      b = randomNumber(10, 50);

      question = `${a} + ${b} × 2`;
      answer = a + b * 2;
    }

    return {
      question,
      answer,
      difficulty: "medium",
      reward: 2,
    };
  }

  // Hard

  const type = randomNumber(1, 3);

  if (type === 1) {
    a = randomNumber(20, 100);
    b = randomNumber(10, 50);
    const c = randomNumber(5, 20);

    question = `(${a} × ${b}) - ${c}`;
    answer = a * b - c;
  } else if (type === 2) {
    a = randomNumber(10, 50);
    b = randomNumber(10, 50);
    const c = randomNumber(2, 10);

    question = `(${a} + ${b}) × ${c}`;
    answer = (a + b) * c;
  } else {
    a = randomNumber(10, 40);
    b = randomNumber(5, 20);
    const c = randomNumber(2, 10);

    question = `${a} × ${b} + ${c}`;
    answer = a * b + c;
  }

  return {
    question,
    answer,
    difficulty: "hard",
    reward: 5,
  };
}

export function generateQuestionOfTheDay() {
  const question = generateQuestion("hard");

  return {
    ...question,
    reward: 10,
    difficulty: "daily",
  };
}