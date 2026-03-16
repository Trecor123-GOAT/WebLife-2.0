// Character class - represents a player character in the game

class Character {
    constructor(name, gender, age = 0) {
        this.id = generateId();
        this.name = name;
        this.gender = gender;
        this.age = age;
        this.year = 0; // Year counter in the game
        
        // Main Stats (0-100)
        this.happiness = 50;
        this.health = 70;
        this.energy = 70;
        this.intelligence = randomInt(40, 60);
        this.attractiveness = randomInt(40, 60);
        this.charisma = randomInt(40, 60);
        
        // Life Stats
        this.money = 1000;
        this.fame = 0;
        this.skills = {};
        
        // Relationships
        this.relationships = []; // Array of relationship objects
        this.currentJob = null;
        this.education = 'High School';
        
        // History
        this.lifeEvents = [];
        this.achievements = [];
        
        // Status
        this.alive = true;
        this.retired = false;
    }
    
    // Age up by one year
    ageUp() {
        this.age++;
        this.year++;
        
        // Decrease some stats when aging
        if (this.age > 40) {
            this.health = clamp(this.health - 2, 0, 100);
            this.energy = clamp(this.energy - 1, 0, 100);
        }
        
        // Health issues when old
        if (this.age > 80 && Math.random() < 0.3) {
            this.health = clamp(this.health - 5, 0, 100);
        }
        
        // Death check
        if (this.age > 100 || this.health <= 0) {
            this.alive = false;
        }
    }
    
    // Modify stats
    addHappiness(amount) {
        this.happiness = clamp(this.happiness + amount, 0, 100);
    }
    
    addHealth(amount) {
        this.health = clamp(this.health + amount, 0, 100);
    }
    
    addEnergy(amount) {
        this.energy = clamp(this.energy + amount, 0, 100);
    }
    
    addMoney(amount) {
        this.money += amount;
        if (this.money < 0) this.money = 0;
    }
    
    addFame(amount) {
        this.fame = clamp(this.fame + amount, 0, 100);
    }
    
    // Skill system
    addSkill(skillName, level = 1) {
        if (!this.skills[skillName]) {
            this.skills[skillName] = 0;
        }
        this.skills[skillName] = clamp(this.skills[skillName] + level, 0, 100);
    }
    
    getSkill(skillName) {
        return this.skills[skillName] || 0;
    }
    
    // Job system
    setJob(jobName, salary) {
        this.currentJob = {
            name: jobName,
            salary: salary,
            yearsWorked: 0
        };
    }
    
    // Relationship system
    addRelationship(person) {
        this.relationships.push({
            id: generateId(),
            name: person.name,
            type: 'friend', // 'friend', 'romantic', 'family', 'enemy'
            affection: 50,
            trust: 50
        });
    }
    
    updateRelationship(personName, affectionChange, trustChange) {
        const relationship = this.relationships.find(r => r.name === personName);
        if (relationship) {
            relationship.affection = clamp(relationship.affection + affectionChange, 0, 100);
            relationship.trust = clamp(relationship.trust + trustChange, 0, 100);
        }
    }
    
    // Add an event to history
    addLifeEvent(eventText, eventType = 'neutral') {
        this.lifeEvents.push({
            year: this.year,
            age: this.age,
            text: eventText,
            type: eventType // 'positive', 'negative', 'neutral'
        });
    }
    
    // Add achievement
    addAchievement(achievement) {
        if (!this.achievements.includes(achievement)) {
            this.achievements.push(achievement);
        }
    }
    
    // Get character summary
    getSummary() {
        return {
            name: this.name,
            age: this.age,
            gender: this.gender,
            happiness: this.happiness,
            health: this.health,
            energy: this.energy,
            money: formatMoney(this.money),
            fame: this.fame,
            job: this.currentJob ? this.currentJob.name : 'Unemployed',
            education: this.education,
            alive: this.alive
        };
    }
    
    // Export for saving
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            gender: this.gender,
            age: this.age,
            year: this.year,
            happiness: this.happiness,
            health: this.health,
            energy: this.energy,
            intelligence: this.intelligence,
            attractiveness: this.attractiveness,
            charisma: this.charisma,
            money: this.money,
            fame: this.fame,
            skills: this.skills,
            relationships: this.relationships,
            currentJob: this.currentJob,
            education: this.education,
            lifeEvents: this.lifeEvents,
            achievements: this.achievements,
            alive: this.alive,
            retired: this.retired
        };
    }
    
    // Import from saved data
    static fromJSON(data) {
        const char = new Character(data.name, data.gender, data.age);
        char.id = data.id;
        char.year = data.year;
        char.happiness = data.happiness;
        char.health = data.health;
        char.energy = data.energy;
        char.intelligence = data.intelligence;
        char.attractiveness = data.attractiveness;
        char.charisma = data.charisma;
        char.money = data.money;
        char.fame = data.fame;
        char.skills = data.skills;
        char.relationships = data.relationships;
        char.currentJob = data.currentJob;
        char.education = data.education;
        char.lifeEvents = data.lifeEvents;
        char.achievements = data.achievements;
        char.alive = data.alive;
        char.retired = data.retired;
        return char;
    }
}
