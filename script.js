// ======================
// PLAYER DATA
// ======================

const player = {
  name: "Alex",

  age: 0,
  money: 0,

  stats: {
    happiness: 50,
    health: 50,
    smarts: 50,
    looks: 50
  },

  education: {
    enrolled: false,
    school: "None"
  },

  job: {
    title: "Unemployed",
    salary: 0
  },

  relationships: [
    {
      name: "Mom",
      type: "Family",
      friendship: 80
    },

    {
      name: "Dad",
      type: "Family",
      friendship: 75
    }
  ]
};

// ======================
// GAME VARIABLES
// ======================

let currentEvents = [];

// ======================
// SCHOOLS
// ======================

const schools = [
  {
    name: "Elementary School",
    startAge: 5,
    endAge: 13
  },

  {
    name: "High School",
    startAge: 14,
    endAge: 18
  }
];

// ======================
// JOBS
// ======================

const jobs = [
  {
    title: "Cashier",
    minSmarts: 20,
    salary: 20000
  },

  {
    title: "Teacher",
    minSmarts: 50,
    salary: 50000
  },

  {
    title: "Doctor",
    minSmarts: 80,
    salary: 120000
  }
];

// ======================
// EVENTS
// ======================

const events = [
  {
    title: "First Day of School",
    text: "You started school.",
    minAge: 5,
    maxAge: 5,

    effect: () => {
      player.stats.smarts += 5;
      player.stats.happiness -= 2;
    }
  },

  {
    title: "Birthday Money",
    text: "A relative gave you $100.",
    minAge: 6,
    maxAge: 18,

    effect: () => {
      player.money += 100;
    }
  },

  {
    title: "Caught a Cold",
    text: "You got sick this year.",
    minAge: 0,
    maxAge: 100,

    effect: () => {
      player.stats.health -= 10;
      player.stats.happiness -= 5;
    }
  },

  {
    title: "Made a New Friend",
    text: "You became friends with someone new.",
    minAge: 5,
    maxAge: 25,

    effect: () => {
      player.relationships.push({
        name: generateRandomName(),
        type: "Friend",
        friendship: 50
      });

      player.stats.happiness += 10;
    }
  }
];

// ======================
// RANDOM NAMES
// ======================

const randomNames = [
  "Emma",
  "Liam",
  "Olivia",
  "Noah",
  "Sophia",
  "Mason",
  "Ava",
  "Lucas",
  "Mia",
  "Ethan"
];

// ======================
// UTILITY FUNCTIONS
// ======================

function generateRandomName() {
  return randomNames[
    Math.floor(Math.random() * randomNames.length)
  ];
}

function clampStats() {
  for (let stat in player.stats) {
    if (player.stats[stat] < 0) {
      player.stats[stat] = 0;
    }

    if (player.stats[stat] > 100) {
      player.stats[stat] = 100;
    }
  }
}

// ======================
// SCHOOL SYSTEM
// ======================

function updateSchoolStatus() {
  const school = schools.find(s =>
    player.age >= s.startAge &&
    player.age <= s.endAge
  );

  if (school) {
    player.education.enrolled = true;
    player.education.school = school.name;
  } else {
    player.education.enrolled = false;
    player.education.school = "None";
  }
}

// ======================
// JOB SYSTEM
// ======================

function applyForJob(index) {
  const job = jobs[index];

  if (player.stats.smarts >= job.minSmarts) {
    player.job.title = job.title;
    player.job.salary = job.salary;

    alert(`You became a ${job.title}!`);
  } else {
    alert("You are not qualified for this job.");
  }

  updateUI();
}

function yearlyJobIncome() {
  player.money += player.job.salary;
}

// ======================
// RELATIONSHIP SYSTEM
// ======================

function complimentPerson(index) {
  player.relationships[index].friendship += 5;

  if (player.relationships[index].friendship > 100) {
    player.relationships[index].friendship = 100;
  }

  alert(`You complimented ${player.relationships[index].name}!`);

  updateUI();
}

function insultPerson(index) {
  player.relationships[index].friendship -= 10;

  if (player.relationships[index].friendship < 0) {
    player.relationships[index].friendship = 0;
  }

  alert(`You insulted ${player.relationships[index].name}!`);

  updateUI();
}

// ======================
// EVENT SYSTEM
// ======================

function getYearEvents() {
  const validEvents = events.filter(event =>
    player.age >= event.minAge &&
    player.age <= event.maxAge
  );

  const chosenEvents = [];

  validEvents.forEach(event => {
    if (Math.random() < 0.35) {
      chosenEvents.push(event);
    }
  });

  return chosenEvents;
}

function showNextEvent() {
  if (currentEvents.length === 0) {
    updateUI();
    return;
  }

  const event = currentEvents.shift();

  event.effect();

  clampStats();

  alert(`${event.title}\n\n${event.text}`);

  showNextEvent();
}

// ======================
// AGE UP SYSTEM
// ======================

function ageUp() {
  player.age++;

  yearlyJobIncome();

  updateSchoolStatus();

  currentEvents = getYearEvents();

  showNextEvent();

  updateUI();
}

// ======================
// UI SYSTEM
// ======================

function updateUI() {

  // PLAYER INFO

  document.getElementById("player-info").innerHTML = `
    <h2>${player.name}</h2>

    <p><strong>Age:</strong> ${player.age}</p>

    <p><strong>Money:</strong> $${player.money}</p>

    <p><strong>Job:</strong> ${player.job.title}</p>

    <p><strong>School:</strong> ${player.education.school}</p>

    <h3>Stats</h3>

    <p>Happiness: ${player.stats.happiness}</p>
    <p>Health: ${player.stats.health}</p>
    <p>Smarts: ${player.stats.smarts}</p>
    <p>Looks: ${player.stats.looks}</p>
  `;

  // RELATIONSHIPS

  let relationshipHTML = "<h3>Relationships</h3>";

  player.relationships.forEach((person, index) => {

    relationshipHTML += `
      <div class="relationship">

        <p>
          <strong>${person.name}</strong>
          (${person.type})
        </p>

        <p>Relationship: ${person.friendship}</p>

        <button onclick="complimentPerson(${index})">
          Compliment
        </button>

        <button onclick="insultPerson(${index})">
          Insult
        </button>

      </div>
    `;
  });

  document.getElementById("relationships").innerHTML =
    relationshipHTML;

  // JOBS

  let jobsHTML = "<h3>Jobs</h3>";

  jobs.forEach((job, index) => {

    jobsHTML += `
      <div class="job">

        <p>
          <strong>${job.title}</strong>
        </p>

        <p>Salary: $${job.salary}</p>

        <p>Required Smarts: ${job.minSmarts}</p>

        <button onclick="applyForJob(${index})">
          Apply
        </button>

      </div>
    `;
  });

  document.getElementById("jobs").innerHTML = jobsHTML;
}

// ======================
// START GAME
// ======================

updateSchoolStatus();
updateUI();
