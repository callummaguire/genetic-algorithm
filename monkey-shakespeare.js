var target = "to be or not to be";

class RandomWord {
  static GetRandomWord() {
    this.characters = "abcdefghijklmnopqrstuvwxyz ";
    return this.characters.charAt(
      Math.floor(Math.random() * this.characters.length)
    );
  }
}

function getRandomNumber(limit) {
  return Math.floor(Math.random() * (limit - 0 + 1) + 0);
}

class Word {
  constructor(targetLength) {
    this.data = [];
    this.targetLength = targetLength;
    this.fitnessScore = 0;
  }

  generateDNA() {
    for (let i = 0; i < this.targetLength; i++) {
      this.data.push(RandomWord.GetRandomWord());
    }
  }
  calcFitness(target) {
    let { length } = target;

    let weight = 100 / length;

    let count = 0;
    for (let i = 0; i < length; i++) {
      if (this.data[i] === target[i]) {
        count++;
      }
    }

    this.fitnessScore = count * weight;
  }

  mutate(mutationRate) {
    for (let i = 0; i < this.data.length; i++) {
      if (Math.random() < mutationRate) {
        this.data[i] = RandomWord.GetRandomWord();
      }
    }
  }
}

class Population {
  constructor(numbOfPopulation) {
    this.numbOfPopulation = numbOfPopulation;
    this.population = [];
    this.mattingPool = [];
  }

  generatePopulation() {
    for (let i = 0; i < this.numbOfPopulation; i++) {
      const newWord = new Word(target.length);
      newWord.generateDNA();
      this.population.push(newWord);
    }
  }

  showPopulation() {
    for (let i = 0; i < this.numbOfPopulation; i++) {
      console.log(this.population[i].data, this.population[i].fitnessScore);
    }
  }

  generateChildPopulation() {
    let toggle = true;
    this.population = [];
    for (let i = 0; i < this.numbOfPopulation; i++) {
      let parentA = this.mattingPool[
        getRandomNumber(this.mattingPool.length - 1)
      ];
      let parentB = this.mattingPool[
        getRandomNumber(this.mattingPool.length - 1)
      ];
      const newWord = new Word(target.length);
      for (let j = 0; j < target.length; j++) {
        if (toggle) {
          newWord.data.push(parentA.data[j]);
          toggle = false;
        } else {
          newWord.data.push(parentB.data[j]);
          toggle = true;
        }
      }
      newWord.mutate(0.1);
      this.population.push(newWord);
    }
  }

  getPureBreed() {
    let highestFitScore = { fitnessScore: 0 };
    for (let i = 0; i < this.numbOfPopulation; i++) {
      if (highestFitScore.fitnessScore < this.population[i].fitnessScore) {
        highestFitScore = this.population[i];
      }
    }
    return highestFitScore;
  }

  calFitnessForPopulation() {
    for (let i = 0; i < this.numbOfPopulation; i++) {
      this.population[i].calcFitness(target);
    }
    // this.showPopulation();
  }

  generateMatingPool() {
    const sortedPopulation = this.population.sort(function(a, b) {
      return b.fitnessScore - a.fitnessScore;
    });

    const topParents = [
      sortedPopulation[0],
      sortedPopulation[1],
      sortedPopulation[2],
      sortedPopulation[3],
      sortedPopulation[4]
    ];
    let totalWeight = 0;
    for (let i = 0; i < topParents.length; i++) {
      totalWeight += topParents[i].fitnessScore;
    }

    totalWeight = 100 / totalWeight;
    for (let j = 0; j < topParents.length; j++) {
      let weight = totalWeight * topParents[j].fitnessScore;
      topParents[j].weight = weight;
    }

    for (let x = 0; x < topParents.length; x++) {
      let number = Math.round(topParents[x].weight).toString()[0];
      for (let y = 0; y < number; y++) {
        this.mattingPool.push(topParents[x]);
      }
    }
  }
}

let myPopulation = new Population(2000);
myPopulation.generatePopulation();
myPopulation.calFitnessForPopulation();

var chosenOne = myPopulation.getPureBreed();
let count = 1;
while (chosenOne.data.join("") != target) {
  myPopulation.generateMatingPool();
  myPopulation.generateChildPopulation();
  myPopulation.calFitnessForPopulation();

  chosenOne = myPopulation.getPureBreed();
  count++;
}

console.log(chosenOne);
console.log(count);
