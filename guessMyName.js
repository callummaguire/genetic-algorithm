const target = 'my name is callum';

const getRandomLetter = () => {
  const characters = "abcdefghijklmnopqrstuvwxyz ";
  return characters.charAt(Math.floor(Math.random() * characters.length))
}

const getRandomNumber = (limit) => Math.floor(Math.random() * (limit - 0 + 1) + 0);

const generateDNA = () => [...target].map(getRandomLetter);

const calcFitness = (word) => {
  const targetName = [...target]; 
  const weight = 100 / targetName.length;

  return [...word].reduce((acc, letter, index) =>
     letter === targetName[index] ? acc + 1 : acc
  , 0) 
   * weight;
}

const mutation = (word, mutationRate) => word.map(letter => Math.random() < mutationRate ? getRandomLetter() : letter);

const generatePopulation = (numberOfPopulation) => Array.from(Array(numberOfPopulation)).map(() => generateDNA());

const calFitnessForPopulation = (population) => population.map(word => ({word, fitnessScore: calcFitness(word)}))

const getSortedPopulation = (population) => population.sort((wordA, wordB) => wordB.fitnessScore - wordA.fitnessScore)

const generateMattingPool = (population) =>  {
  console.log(population);
  const sortedPopulation = getSortedPopulation(population);
  const topParents = sortedPopulation.slice(0, 5);

  return topParents
}

const bestWordOfGeneration = (population) => {
  const sortedPopulation = getSortedPopulation(population);

  return {bestWord: sortedPopulation[0], population: population};
}

const generateChildPopulation = (population) => (mattingPool) => Array.from(Array(population.length)).map(() => {
  const parentA = mattingPool[getRandomNumber(mattingPool.length -1)];
  const parentB = mattingPool[getRandomNumber(mattingPool.length -1)];

  const newWord = generateDNA();
  let toggle = true;

  const breadWord = newWord.map((letter, index) => {
    if (toggle) {
      toggle = false;
      return parentA.word[index];
    } 
    toggle = true;
    return parentB.word[index];
  });
  const mutatedBreadWord = mutation(breadWord, 0.1);
  return mutatedBreadWord.join("");
});

const firstGeneration = generatePopulation(200);
const firstGenerationWithFitnessScore = calFitnessForPopulation(firstGeneration);

const compose = (f1, f2, f3, f4, initalValue) => f4(f3(f2(f1(initalValue))));  

const recursiveFunction = ({bestWord, population}) => {
  if (bestWord.word === target) {
    return bestWord
  }
  return recursiveFunction(compose(generateMattingPool, generateChildPopulation(population), calFitnessForPopulation, bestWordOfGeneration, population))
}

console.log(recursiveFunction({
  bestWord: {word: ''}, population: firstGenerationWithFitnessScore
}));