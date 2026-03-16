// Careers system - defines jobs and career progression

class CareerSystem {
    constructor() {
        this.careers = {
            // Entry-level jobs
            'Fast Food Worker': {
                tier: 1,
                salary: 20000,
                happiness: -5,
                health: -10,
                education: 'High School',
                requiredSkills: {},
                description: 'Work at a fast food restaurant'
            },
            'Retail Worker': {
                tier: 1,
                salary: 22000,
                happiness: 0,
                health: -5,
                education: 'High School',
                requiredSkills: { charisma: 30 },
                description: 'Work in retail sales'
            },
            'Construction Worker': {
                tier: 1,
                salary: 28000,
                happiness: 5,
                health: -15,
                education: 'High School',
                requiredSkills: {},
                description: 'Work in construction'
            },
            
            // Mid-level jobs
            'Teacher': {
                tier: 2,
                salary: 45000,
                happiness: 10,
                health: 5,
                education: 'Bachelor',
                requiredSkills: { intelligence: 60, charisma: 50 },
                description: 'Teach students at a school'
            },
            'Nurse': {
                tier: 2,
                salary: 50000,
                happiness: 5,
                health: -10,
                education: 'Associate',
                requiredSkills: { intelligence: 55 },
                description: 'Work as a healthcare professional'
            },
            'Software Developer': {
                tier: 2,
                salary: 70000,
                happiness: 0,
                health: -5,
                education: 'Bachelor',
                requiredSkills: { intelligence: 70 },
                description: 'Develop software and applications'
            },
            'Police Officer': {
                tier: 2,
                salary: 48000,
                happiness: 0,
                health: -20,
                education: 'High School',
                requiredSkills: {},
                description: 'Serve as a police officer'
            },
            'Accountant': {
                tier: 2,
                salary: 55000,
                happiness: -5,
                health: 5,
                education: 'Bachelor',
                requiredSkills: { intelligence: 70 },
                description: 'Work as a financial accountant'
            },
            
            // High-level jobs
            'Doctor': {
                tier: 3,
                salary: 120000,
                happiness: 15,
                health: -10,
                education: 'Doctorate',
                requiredSkills: { intelligence: 85 },
                description: 'Practice medicine as a doctor'
            },
            'Lawyer': {
                tier: 3,
                salary: 100000,
                happiness: 10,
                health: 0,
                education: 'Doctorate',
                requiredSkills: { intelligence: 80, charisma: 70 },
                description: 'Practice law'
            },
            'CEO': {
                tier: 3,
                salary: 150000,
                happiness: 20,
                health: -15,
                education: 'Bachelor',
                requiredSkills: { intelligence: 75, charisma: 80 },
                description: 'Lead a company as CEO'
            },
            'Engineer': {
                tier: 3,
                salary: 90000,
                happiness: 5,
                health: 5,
                education: 'Bachelor',
                requiredSkills: { intelligence: 80 },
                description: 'Work as an engineer'
            },
            'Architect': {
                tier: 3,
                salary: 95000,
                happiness: 15,
                health: 5,
                education: 'Bachelor',
                requiredSkills: { intelligence: 75, charisma: 60 },
                description: 'Design buildings as an architect'
            },
            
            // Special/Creative jobs
            'Artist': {
                tier: 2,
                salary: 40000,
                happiness: 25,
                health: 5,
                education: 'Bachelor',
                requiredSkills: { intelligence: 50, charisma: 60 },
                description: 'Create art and express yourself'
            },
            'Musician': {
                tier: 2,
                salary: 35000,
                happiness: 30,
                health: 5,
                education: 'High School',
                requiredSkills: { charisma: 70, intelligence: 50 },
                description: 'Perform music professionally'
            },
            'Actor': {
                tier: 3,
                salary: 80000,
                happiness: 25,
                health: 0,
                education: 'Bachelor',
                requiredSkills: { charisma: 85, attractiveness: 70 },
                description: 'Perform in movies and TV shows'
            },
            'Athlete': {
                tier: 3,
                salary: 100000,
                happiness: 20,
                health: 20,
                education: 'High School',
                requiredSkills: {},
                description: 'Play sports professionally'
            },
        };
    }
    
    // Get all available careers
    getAllCareers() {
        return Object.keys(this.careers);
    }
    
    // Get career details
    getCareer(careerName) {
        return this.careers[careerName];
    }
    
    // Check if character can get a job
    canGetJob(character, careerName) {
        const career = this.getCareer(careerName);
        if (!career) return false;
        
        // Check education requirement
        const educationLevel = this.getEducationLevel(character.education);
        const requiredLevel = this.getEducationLevel(career.education);
        
        if (educationLevel < requiredLevel) {
            return false;
        }
        
        // Check skill requirements
        for (let skill in career.requiredSkills) {
            const requiredLevel = career.requiredSkills[skill];
            const characterLevel = character[skill] !== undefined ? character[skill] : character.getSkill(skill);
            
            if (characterLevel < requiredLevel) {
                return false;
            }
        }
        
        return true;
    }
    
    // Get available careers for a character
    getAvailableCareers(character) {
        return this.getAllCareers().filter(career => this.canGetJob(character, career));
    }
    
    // Convert education string to numeric level
    getEducationLevel(education) {
        const levels = {
            'High School': 1,
            'Associate': 2,
            'Bachelor': 3,
            'Master': 4,
            'Doctorate': 5
        };
        return levels[education] || 0;
    }
    
    // Hire a character for a job
    hireCharacter(character, careerName) {
        if (!this.canGetJob(character, careerName)) {
            return false;
        }
        
        const career = this.getCareer(careerName);
        character.setJob(careerName, career.salary);
        
        // Apply career effects
        if (career.happiness) character.addHappiness(career.happiness);
        if (career.health) character.addHealth(career.health);
        
        character.addLifeEvent(`Got a job as a ${careerName}!`, 'positive');
        
        return true;
    }
    
    // Advance career (get a raise/promotion)
    advanceCareer(character) {
        if (!character.currentJob) return false;
        
        const currentCareer = this.getCareer(character.currentJob.name);
        
        // Find higher tier careers
        const higherCareers = Object.keys(this.careers).filter(name => {
            return this.careers[name].tier > currentCareer.tier && this.canGetJob(character, name);
        });
        
        if (higherCareers.length > 0) {
            const newCareer = getRandomItem(higherCareers);
            const newCareerObj = this.getCareer(newCareer);
            
            character.currentJob.name = newCareer;
            character.currentJob.salary = newCareerObj.salary;
            character.addMoney(newCareerObj.salary * 0.5); // Bonus for promotion
            character.addHappiness(15);
            character.addLifeEvent(`Got promoted to ${newCareer}!`, 'positive');
            
            return true;
        }
        
        return false;
    }
    
    // Get yearly salary (with some variation)
    getYearlySalary(character) {
        if (!character.currentJob) return 0;
        
        const career = this.getCareer(character.currentJob.name);
        const variation = randomInt(-500, 500);
        
        return career.salary + variation;
    }
}

// Create global career system
const careerSystem = new CareerSystem();
