// Events system - generates random life events

class EventSystem {
    constructor() {
        this.events = [];
        this.initializeEvents();
    }
    
    initializeEvents() {
        // Childhood events (ages 5-12)
        this.childEvents = [
            { text: "You made a new best friend at school!", happiness: 10, health: 5 },
            { text: "You got bullied at school today.", happiness: -15, health: -5 },
            { text: "You won first place in a school competition!", happiness: 15, intelligence: 3 },
            { text: "You broke your arm playing sports.", health: -20, energy: -10 },
            { text: "Your parents took you on an amazing vacation!", happiness: 20, money: -500 },
            { text: "You learned to play an instrument.", intelligence: 5 },
            { text: "You had a terrible day at school.", happiness: -10 },
            { text: "You won the spelling bee!", intelligence: 10, happiness: 15 },
        ];
        
        // Teenage events (ages 13-19)
        this.teenEvents = [
            { text: "You got your first crush!", happiness: 15 },
            { text: "You got dumped by your crush.", happiness: -20 },
            { text: "You went to prom - it was amazing!", happiness: 20 },
            { text: "You started dating someone!", happiness: 15, charisma: 5 },
            { text: "You got caught sneaking out.", happiness: -15 },
            { text: "You aced your exams!", intelligence: 10, happiness: 10 },
            { text: "You flunked a major test.", intelligence: -5, happiness: -15 },
            { text: "You got a summer job and earned money!", money: 2000, happiness: 10 },
            { text: "You made the sports team!", health: 10, happiness: 15 },
            { text: "You had your first kiss!", happiness: 20, charisma: 5 },
            { text: "You got in trouble with the law (minor)", happiness: -25, money: -500 },
            { text: "You volunteered and felt good about it!", happiness: 15, charisma: 5 },
        ];
        
        // Young Adult events (ages 20-35)
        this.youngAdultEvents = [
            { text: "You got a promotion at work!", money: 5000, happiness: 15 },
            { text: "You got fired from your job.", happiness: -25, money: -2000 },
            { text: "You went on an amazing date!", happiness: 15 },
            { text: "You got married!", happiness: 25, charisma: 10 },
            { text: "You got divorced.", happiness: -30 },
            { text: "You had a baby!", happiness: 20 },
            { text: "You started a business!", money: -10000, intelligence: 10 },
            { text: "You got a big bonus at work!", money: 10000, happiness: 20 },
            { text: "You went to college and got a degree!", intelligence: 15, money: -20000 },
            { text: "You had a one-night stand.", happiness: 10 },
            { text: "You traveled the world!", happiness: 25, money: -5000 },
            { text: "You got diagnosed with an illness.", health: -20, happiness: -15 },
            { text: "You became famous on social media!", fame: 15, happiness: 15 },
        ];
        
        // Middle-aged events (ages 36-60)
        this.middleAgedEvents = [
            { text: "You got a major promotion!", money: 15000, happiness: 15 },
            { text: "You achieved your dream career goal!", happiness: 30, intelligence: 5 },
            { text: "Your child graduated from college!", happiness: 20 },
            { text: "You went through a mid-life crisis.", happiness: -25, health: -10 },
            { text: "You had an affair.", happiness: -30, charisma: -10 },
            { text: "You invested in stocks - they paid off!", money: 20000, happiness: 15 },
            { text: "You lost a lot of money in a bad investment.", money: -15000, happiness: -20 },
            { text: "You became a mentor to younger people.", charisma: 10, happiness: 10 },
            { text: "Your spouse surprised you with a vacation!", happiness: 20, money: -3000 },
            { text: "You got a serious health scare.", health: -30, happiness: -20 },
            { text: "You started a charity.", happiness: 20, charisma: 5 },
        ];
        
        // Elderly events (ages 60+)
        this.elderlyEvents = [
            { text: "You retired! Time to relax.", happiness: 15 },
            { text: "You became a grandparent!", happiness: 25 },
            { text: "You wrote your memoir.", intelligence: 10, happiness: 15 },
            { text: "You traveled to a bucket-list destination!", happiness: 25, money: -5000 },
            { text: "An old friend reached out!", happiness: 15 },
            { text: "You won the lottery!", money: 50000, happiness: 30 },
            { text: "You lost your spouse.", happiness: -40, health: -15 },
            { text: "You spent time with your family.", happiness: 20 },
            { text: "You reflected on your life with pride.", happiness: 15 },
        ];
    }
    
    // Get random event based on character age
    getRandomEvent(character) {
        let eventPool = [];
        
        if (character.age < 5) {
            eventPool = this.childEvents;
        } else if (character.age < 13) {
            eventPool = this.childEvents;
        } else if (character.age < 20) {
            eventPool = this.teenEvents;
        } else if (character.age < 36) {
            eventPool = this.youngAdultEvents;
        } else if (character.age < 61) {
            eventPool = this.middleAgedEvents;
        } else {
            eventPool = this.elderlyEvents;
        }
        
        return getRandomItem(eventPool);
    }
    
    // Apply an event to a character
    applyEvent(character, event) {
        if (event.happiness) character.addHappiness(event.happiness);
        if (event.health) character.addHealth(event.health);
        if (event.energy) character.addEnergy(event.energy);
        if (event.money) character.addMoney(event.money);
        if (event.fame) character.addFame(event.fame);
        if (event.intelligence) character.addSkill('intelligence', event.intelligence);
        if (event.charisma) character.charisma = clamp(character.charisma + event.charisma, 0, 100);
        if (event.attractiveness) character.attractiveness = clamp(character.attractiveness + event.attractiveness, 0, 100);
        
        character.addLifeEvent(event.text, 
            (event.happiness && event.happiness > 0) ? 'positive' : 
            (event.happiness && event.happiness < 0) ? 'negative' : 
            'neutral'
        );
    }
    
    // Trigger a random event
    triggerRandomEvent(character) {
        const event = this.getRandomEvent(character);
        this.applyEvent(character, event);
        return event;
    }
}

// Create global event system
const eventSystem = new EventSystem();
