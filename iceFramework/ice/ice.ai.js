if(typeof ice === "undefined") ice = {modules: []};
(function() {
	if(!ice.modules.includes("ai")) ice.modules.push("ai");
	ice.ai = {};
	ice.ai.version = "v1.0.1"; // This version of the ice.ai module
	console.log("%cice.ai " + ice.ai.version + " imported successfully.", "color: #008000");

	/*
	 *	================ Artificial Intelligence/Machine Learning Module ================
	 */

	// Private variables/functions

	function DNA(size, genes = [...Array(size)].map(Math.random)) {
		this.size = size
		this.genes = genes;
	}
	DNA.prototype.crossover = function(mate) {
		let newGenes = [];
		let mateInfluence = Math.random();
		for(let i = 0; i < this.size; i++) {
			newGenes.push(Math.random() < mateInfluence ? mate.genes[i] : this.genes[i])
		}
		return new DNA(this.size, newGenes);
	}
	DNA.prototype.mutate = function(mutationRate) {
		for(let i = 0; i < this.size; i++) {
			if(Math.random() < mutationRate) {
				this.genes[i] = Math.min(
					Math.max(
						this.genes[i] + (Math.random() * 2 - 1) * mutationRate, 0
					), 1
				);
			}
		}
	}
	function Creature(geneCount, myDNA = new DNA(geneCount)) {
		this.geneCount = geneCount;
		this.DNA = myDNA;
		this.fitness;

		this.breed = function(mate, mutationRate) {
			let offspring = new Creature(this.geneCount, this.DNA.crossover(mate.DNA));
			offspring.DNA.mutate(mutationRate);
			return offspring;
		}
	}

	// Constructors

	ice.ai.GeneticAlgorithm = function(geneCount = 2, population = 100, mutationRate = 0.01) {
		this.geneCount = geneCount;
		this.population = population;
		this.mutationRate = mutationRate;
		this.creatures = [...Array(this.population)].map(() => new Creature(this.geneCount));
		this.generation = 0;

		let minFitness = Infinity;
		let maxFitness = -Infinity;
		let averageFitness = 0;
		let updateFitness = fitnessFunction => {
			totalFitness = 0;
			minFitness = Infinity;
			maxFitness = -Infinity;
			for(let creature of this.creatures) {
				fitness = fitnessFunction(creature.DNA.genes);
				creature.fitness = fitness;
				totalFitness += fitness;
				if(fitness > maxFitness) maxFitness = fitness;
				if(fitness < minFitness) minFitness = fitness;
			}
			averageFitness = 1 / this.population;
			for(let creature of this.creatures) {
				fitness = ((creature.fitness - minFitness) / (totalFitness - minFitness * this.population)) || averageFitness;
				creature.fitness = fitness;
			}
			totalFitness = 1;
			this.creatures.sort((a, b) => b.fitness - a.fitness);
		}
		let getParent = () => {
			let currentTotal = 0;
			let targetTotal = Math.random() * totalFitness;
			for(let creature of this.creatures) {
				currentTotal += creature.fitness;
				if(currentTotal >= targetTotal) return creature;
			}
		}

		this.evolve = function(fitnessFunction) {
			updateFitness(fitnessFunction);

			let theNextGeneration = [];
			while(theNextGeneration.length < this.population) {
				let parent = getParent();
				let mate = getParent();
				let offspring = parent.breed(mate, this.mutationRate);
				theNextGeneration.push(offspring);
			}

			this.creatures = theNextGeneration;
			this.generation++;
		}

		this.guess = function() {
			let total = [...Array(this.geneCount)].fill(0);
			for(let creature of this.creatures) {
				for(let i = 0; i < total.length; i++) {
					total[i] += creature.DNA.genes[i];
				}
			}
			for(let i = 0; i < total.length; i++) {
				total[i] = total[i] / this.population;
			}
			return total;
		}
	}
})();
