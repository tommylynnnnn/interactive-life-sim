// ======================
// PLAYER DATA
// ======================

const player = {
  name: "",
  gender: "",
  emoji: "🧑",

  alive: true,

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

  relationships: []
};

// ======================
// GAME VARIABLES
// ======================

let currentEvents = [];

// ======================
// RANDOM NAMES
// ======================

const randomNames = [
  "Emma",
  "Liam",
  "Olivia",
  "Noah",
  "Sophia",
  "Lucas",
  "Mia",
  "Ethan"
];

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
    minAge: 16,
    minSmarts: 20,
    salary: 18000
  },

  {
    title: "Teacher",
    minAge: 22,
    minSmarts: 60,
    salary: 55000
  },

  {
    title: "Doctor",
    minAge: 26,
    minSmarts: 85,
    salary: 140000
  }
];

// ======================
// EVENTS
// ======================

const events = [
  {
    title: "Birthday Money",
    text: "A relative gave you $100.",

    minAge: 5,
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
      player.stats.health -= 8;
      player.stats.happiness -= 4;
    }
  },

  {
    title: "Made a Friend",
    text: "You made a new friend.",

    minAge: 5,
    maxAge: 30,

    effect: () => {

      player.relationships.push({
        name: generateRandomName(),
        type: "Friend",
        friendship: 50
      });

      player.stats.happiness += 8;
    }
  }
];

// ======================
// START GAME
// ======================

function startGame() {

  const nameInput =
    document.getElementById("name-input").value;

  const genderInput =
    document.getElementById("gender-input").value;

  if (nameInput.trim() === "") {
    return;
  }

  player.name = nameInput;
  player.gender = genderInput;

  // GENDER EMOJIS

  if (genderInput === "Male") {
    player.emoji = "👨";
  }

  else if (genderInput === "Female") {
    player.emoji = "👩";
  }

  else {
    player.emoji = "🧑";
  }

  // START RELATIONSHIPS

  player.relationships.push({
    name: "Mom",
    type: "Family",
    friendship: 85
  });

  player.relationships.push({
    name: "Dad",
    type: "Family",
    friendship: 80
  });

  document.getElementById(
    "start-screen"
  ).style.display = "none";

  updateUI();
}

// ======================
// UTILITY FUNCTIONS
// ======================

function generateRandomName() {

  return randomNames[
    Math.floor(
      Math.random() * randomNames.length
    )
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
  }

  else {

    player.education.enrolled = false;
    player.education.school = "None";
  }
}

// ======================
// JOB SYSTEM
// ======================

function applyForJob(index) {

  if (!player.alive) return;

  const job = jobs[index];

  // AGE CHECK

  if (player.age < job.minAge) {

    showPopup(
      "Too Young",
      `You must be at least age ${job.minAge} to become a ${job.title}.`
    );

    return;
  }

  // SMARTS CHECK

  if (player.stats.smarts < job.minSmarts) {

    showPopup(
      "Rejected",
      "You were not qualified for the job."
    );

    return;
  }

  player.job.title = job.title;
  player.job.salary = job.salary;

  showPopup(
    "New Job",
    `You became a ${job.title}!`
  );

  updateUI();
}

function yearlyJobIncome() {

  player.money += player.job.salary;
}

// ======================
// RELATIONSHIPS
// ======================

function complimentPerson(index) {

  player.relationships[index]
    .friendship += 5;

  clampRelationship(index);

  showPopup(
    "Compliment",
    `You complimented ${player.relationships[index].name}.`
  );

  updateUI();
}

function insultPerson(index) {

  player.relationships[index]
    .friendship -= 10;

  clampRelationship(index);

  showPopup(
    "Insult",
    `You insulted ${player.relationships[index].name}.`
  );

  updateUI();
}

function clampRelationship(index) {

  if (
    player.relationships[index]
      .friendship > 100
  ) {
    player.relationships[index]
      .friendship = 100;
  }

  if (
    player.relationships[index]
      .friendship < 0
  ) {
    player.relationships[index]
      .friendship = 0;
  }
}

// ======================
// EVENTS
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

  const event =
    currentEvents.shift();

  event.effect();

  clampStats();

  showPopup(
    event.title,
    event.text,
    showNextEvent
  );
}

// ======================
// RANDOM STAT CHANGES
// ======================

function yearlyStatChanges() {

  player.stats.happiness +=
    randomNumber(-4, 4);

  player.stats.health +=
    randomNumber(-3, 2);

  player.stats.smarts +=
    randomNumber(0, 2);

  player.stats.looks +=
    randomNumber(-1, 1);

  clampStats();
}

function randomNumber(min, max) {

  return Math.floor(
    Math.random() *
    (max - min + 1)
  ) + min;
}

// ======================
// DEATH SYSTEM
// ======================

function checkDeath() {

  // HEALTH DEATH

  if (player.stats.health <= 0) {

    die(
      "Your health reached 0."
    );

    return;
  }

  // OLD AGE DEATH

  if (player.age >= 70) {

    // increases yearly

    const deathChance =
      (player.age - 69) * 2;

    const roll =
      Math.random() * 100;

    if (roll < deathChance) {

      die(
        "You died of old age."
      );
    }
  }
}

function die(reason) {

  player.alive = false;

  showPopup(
    "You Died",
    reason
  );

  document.getElementById(
    "age-button"
  ).disabled = true;
}

// ======================
// AGE UP
// ======================

function ageUp() {

  if (!player.alive) return;

  player.age++;

  yearlyJobIncome();

  yearlyStatChanges();

  updateSchoolStatus();

  currentEvents = getYearEvents();

  checkDeath();

  if (!player.alive) {
    updateUI();
    return;
  }

  showNextEvent();

  updateUI();
}

// ======================
// POPUP SYSTEM
// ======================

function showPopup(
  title,
  text,
  callback = null
) {

  document.getElementById(
    "popup-title"
  ).innerText = title;

  document.getElementById(
    "popup-text"
  ).innerText = text;

  const overlay =
    document.getElementById(
      "popup-overlay"
    );

  overlay.style.display = "flex";

  const button =
    document.getElementById(
      "popup-button"
    );

  button.onclick = () => {

    overlay.style.display = "none";

    if (callback) {
      callback();
    }
  };
}

// ======================
// UI
// ======================

function updateUI() {

  // PLAYER INFO

  document.getElementById(
    "player-info"
  ).innerHTML = `

    <div class="character-header">

      <div class="character-emoji">
        ${player.emoji}
      </div>

      <div class="character-info">

        <h2>${player.name}</h2>

        <p>Age: ${player.age}</p>

        <p>${player.job.title}</p>

        <p>Money: $${player.money}</p>

      </div>

    </div>

    <div class="stat">
      <div class="stat-name">
        Happiness
      </div>

      <div class="stat-bar">
        <div
          class="stat-fill"
          style="
            width:
            ${player.stats.happiness}%;
          "
        ></div>
      </div>
    </div>

    <div class="stat">
      <div class="stat-name">
        Health
      </div>

      <div class="stat-bar">
        <div
          class="stat-fill"
          style="
            width:
            ${player.stats.health}%;
          "
        ></div>
      </div>
    </div>

    <div class="stat">
      <div class="stat-name">
        Smarts
      </div>

      <div class="stat-bar">
        <div
          class="stat-fill"
          style="
            width:
            ${player.stats.smarts}%;
          "
        ></div>
      </div>
    </div>

    <div class="stat">
      <div class="stat-name">
        Looks
      </div>

      <div class="stat-bar">
        <div
          class="stat-fill"
          style="
            width:
            ${player.stats.looks}%;
          "
        ></div>
      </div>
    </div>
  `;

  // RELATIONSHIPS

  let relationshipHTML =
    `<div class="panel">
      <h2>Relationships</h2>
    `;

  player.relationships.forEach(
    (person, index) => {

    relationshipHTML += `

      <div class="card">

        <h3>
          ${person.name}
        </h3>

        <p>
          ${person.type}
        </p>

        <p>
          Relationship:
          ${person.friendship}
        </p>

        <button
          class="small-button"
          onclick="
            complimentPerson(${index})
          "
        >
          Compliment
        </button>

        <button
          class="small-button"
          onclick="
            insultPerson(${index})
          "
        >
          Insult
        </button>

      </div>
    `;
  });

  relationshipHTML += `</div>`;

  document.getElementById(
    "relationships"
  ).innerHTML = relationshipHTML;

  // JOBS

  let jobsHTML =
    `<div class="panel">
      <h2>Jobs</h2>
    `;

  jobs.forEach((job, index) => {

    jobsHTML += `

      <div class="card">

        <h3>
          ${job.title}
        </h3>

        <p>
          Salary:
          $${job.salary}
        </p>

        <p>
          Minimum Age:
          ${job.minAge}
        </p>

        <p>
          Smarts Needed:
          ${job.minSmarts}
        </p>

        <button
          class="small-button"
          onclick="
            applyForJob(${index})
          "
        >
          Apply
        </button>

      </div>
    `;
  });

  jobsHTML += `</div>`;

  document.getElementById(
    "jobs"
  ).innerHTML = jobsHTML;
}
