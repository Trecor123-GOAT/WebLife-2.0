// Main Game Engine - controls game logic and flow

class Game {
    constructor() {
        this.character = null;
        this.gameState = 'menu'; // menu, characterCreation, playing, gameOver
        this.currentYear = 0;
    }
    
    // Initialize a new game
    startNewGame(name, gender) {
        this.character = new Character(name, gender, 0);
        this.gameState = 'playing';
        this.currentYear = 0;
        return this.character;
    }
    
    // Load a saved game
    loadGame() {
        const savedData = loadGame();
        if (savedData) {
            this.character = Character.fromJSON(savedData);
            this.gameState = 'playing';
            this.currentYear = this.character.year;
            return true;
        }
        return false;
    }
    
    // Save the current game
    saveGame() {
        if (this.character) {
            const gameData = this.character.toJSON();
            saveGame(gameData);
            showNotification('Game saved!', 'success');
            return true;
        }
        return false;
    }
    
    // Pass one year of life
    passYear() {
        if (!this.character || !this.character.alive) return false;
        
        // Age up
        this.character.ageUp();
        this.currentYear++;
        
        // Check if still alive
        if (!this.character.alive) {
            this.gameState = 'gameOver';
            return false;
        }
        
        // Natural stat degradation
        this.character.addEnergy(-10);
        this.character.addHappiness(-5); // Entropy of life
        
        // Job income
        if (this.character.currentJob) {
            const salary = careerSystem.getYearlySalary(this.character);
            this.character.addMoney(salary);
        }
        
        // Random event
        const event = eventSystem.triggerRandomEvent(this.character);
        
        // Relationship maintenance
        for (let relationship of this.character.relationships) {
            // Relationships degrade if not maintained
            if (Math.random() < 0.3) {
                relationship.affection = clamp(relationship.affection - 2, 0, 100);
            }
        }
        
        // Career advancement chance
        if (this.character.currentJob && Math.random() < 0.15) {
            careerSystem.advanceCareer(this.character);
        }
        
        // Random opportunity
        this.checkForOpportunities();
        
        return true;
    }
    
    // Check for random opportunities
    checkForOpportunities() {
        const rand = Math.random();
        
        // Job opportunity
        if (rand < 0.1 && this.character.intelligence > 50) {
            this.character.addHappiness(5);
            this.character.addLifeEvent('Got a great job opportunity!', 'positive');
        }
        
        // Money opportunity
        if (rand < 0.05) {
            const found = randomInt(100, 1000);
            this.character.addMoney(found);
            this.character.addLifeEvent(`Found $${found} on the street!`, 'positive');
        }
        
        // Health issue
        if (rand > 0.92 && this.character.age > 50) {
            this.character.addHealth(-15);
            this.character.addLifeEvent('Your health has declined!', 'negative');
        }
        
        // Skill improvement (from living)
        if (rand < 0.2) {
            const skills = ['intelligence', 'charisma'];
            const skillName = getRandomItem(skills);
            if (skillName === 'intelligence') {
                this.character.intelligence = clamp(this.character.intelligence + 1, 0, 100);
            } else {
                this.character.charisma = clamp(this.character.charisma + 1, 0, 100);
            }
        }
    }
    
    // Get available actions for current year
    getAvailableActions() {
        if (!this.character) return [];
        
        const actions = [];
        
        // Social actions
        actions.push({
            name: 'Make a Friend',
            action: 'makeFriend',
            description: 'Try to make a new friend'
        });
        
        if (this.character.relationships.length > 0) {
            actions.push({
                name: 'Hang Out',
                action: 'hangOut',
                description: 'Spend time with a friend'
            });
            
            actions.push({
                name: 'Ask on a Date',
                action: 'askDate',
                description: 'Ask someone on a romantic date'
            });
        }
        
        // Career actions
        const availableCareers = careerSystem.getAvailableCareers(this.character);
        if (availableCareers.length > 0 && !this.character.currentJob) {
            actions.push({
                name: 'Get a Job',
                action: 'getJob',
                description: `Available careers: ${availableCareers.join(', ')}`
            });
        }
        
        if (this.character.currentJob) {
            actions.push({
                name: 'Work Harder',
                action: 'workHarder',
                description: 'Put in extra effort at work'
            });
            
            actions.push({
                name: 'Quit Job',
                action: 'quitJob',
                description: 'Leave your current job'
            });
        }
        
        // Education
        if (this.character.education === 'High School' && this.character.age >= 18) {
            actions.push({
                name: 'Go to College',
                action: 'goCollege',
                description: 'Pursue higher education'
            });
        }
        
        // Health
        if (this.character.health < 60) {
            actions.push({
                name: 'See a Doctor',
                action: 'seeDoctor',
                description: 'Improve your health'
            });
        }
        
        // Self care
        actions.push({
            name: 'Relax',
            action: 'relax',
            description: 'Recover energy and happiness'
        });
        
        // Marriage/Family
        if (this.character.gender === 'female') {
            const spouse = this.character.relationships.find(r => r.type === 'spouse');
            if (spouse && this.character.age >= 18 && this.character.age <= 50) {
                actions.push({
                    name: 'Have a Baby',
                    action: 'haveBaby',
                    description: 'Start a family'
                });
            }
        }
        
        // Advance to next year
        actions.push({
            name: 'Next Year',
            action: 'nextYear',
            description: 'Pass time to the next year'
        });
        
        return actions;
    }
    
    // Execute an action
    executeAction(actionName, targetName = null) {
        let result = { success: true, message: '' };
        
        switch(actionName) {
            case 'makeFriend':
                result = relationshipSystem.makeNewFriend(this.character);
                break;
                
            case 'hangOut':
                if (!targetName) return { success: false, message: 'Select a person!' };
                result = relationshipSystem.hangOut(this.character, targetName);
                break;
                
            case 'askDate':
                if (!targetName) return { success: false, message: 'Select a person!' };
                result = relationshipSystem.askOnDate(this.character, targetName);
                break;
                
            case 'getJob':
                if (!targetName) return { success: false, message: 'Select a job!' };
                const hired = careerSystem.hireCharacter(this.character, targetName);
                result = { 
                    success: hired, 
                    message: hired ? `Got hired as a ${targetName}!` : 'Could not get this job.'
                };
                break;
                
            case 'workHarder':
                this.character.addMoney(500);
                this.character.addEnergy(-20);
                this.character.addHappiness(-5);
                result = { 
                    success: true, 
                    message: 'Worked hard and earned extra money!' 
                };
                break;
                
            case 'quitJob':
                this.character.currentJob = null;
                this.character.addHappiness(10);
                result = { 
                    success: true, 
                    message: 'You quit your job.' 
                };
                break;
                
            case 'goCollege':
                this.character.education = 'Bachelor';
                this.character.intelligence = clamp(this.character.intelligence + 10, 0, 100);
                this.character.addMoney(-30000);
                this.character.addLifeEvent('Got a Bachelor degree!', 'positive');
                result = { 
                    success: true, 
                    message: 'Completed college! You now have a Bachelor degree.' 
                };
                break;
                
            case 'seeDoctor':
                this.character.addHealth(20);
                this.character.addMoney(-500);
                result = { 
                    success: true, 
                    message: 'Doctor visit improved your health!' 
                };
                break;
                
            case 'relax':
                this.character.addEnergy(30);
                this.character.addHappiness(15);
                this.character.addHealth(5);
                this.character.addMoney(-20);
                result = { 
                    success: true, 
                    message: 'You relaxed and feel much better!' 
                };
                break;
                
            case 'haveBaby':
                result = relationshipSystem.haveBaby(this.character);
                break;
                
            case 'nextYear':
                this.passYear();
                result = { 
                    success: true, 
                    message: `Year ${this.character.year} completed!` 
                };
                break;
                
            default:
                result = { success: false, message: 'Unknown action!' };
        }
        
        return result;
    }
    
    // Get game status
    getGameStatus() {
        if (!this.character) return null;
        
        return {
            character: this.character.getSummary(),
            year: this.character.year,
            age: this.character.age,
            alive: this.character.alive,
            gameState: this.gameState
        };
    }
}

// Create global game instance
const game = new Game();
