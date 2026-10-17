require('dotenv').config();
const mongoose = require('mongoose');

// Define Mongoose Schema directly in the seed file 
const QuestionSchema = new mongoose.Schema({
  prompt: { type: String, required: true },
  options: { type: [String], required: true },
  correctOptionIndex: { type: Number, required: true, min: 0, max: 4 },
  explanation: { type: String, default: '' }
});

const DeckSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    category: { type: String, required: true, lowercase: true },
    difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
    tags: [{ type: String, lowercase: true }],
    questions: [QuestionSchema]
  },
  { timestamps: true }
);

const Deck = mongoose.model('Deck', DeckSchema);

// --- SAMPLE SEED DATA ---
const sampleDecks = [
  {
    title: 'JavaScript Basics',
    description: 'Test your foundational knowledge of JavaScript syntax, types, and core concepts.',
    category: 'javascript',
    difficulty: 'Beginner',
    tags: ['js', 'frontend', 'coding'],
    questions: [
      {
        prompt: 'What is the output of `typeof null` in JavaScript?',
        options: ['null', 'undefined', 'object', 'number', 'boolean'],
        correctOptionIndex: 2,
        explanation: 'Due to a historical bug in JavaScript, `typeof null` returns "object".'
      },
      {
        prompt: 'Which keyword is used to declare a block-scoped variable in ES6?',
        options: ['var', 'let', 'global', 'define', 'const-block'],
        correctOptionIndex: 1,
        explanation: '`let` and `const` provide block-scoped variable declarations.'
      },
      {
        prompt: 'Which method converts a JSON string into a JavaScript object?',
        options: ['JSON.parse()', 'JSON.stringify()', 'JSON.object()', 'JSON.convert()', 'JSON.toJS()'],
        correctOptionIndex: 0,
        explanation: '`JSON.parse()` parses a JSON string and constructs the JavaScript value or object.'
      },
      {
        prompt: 'What symbol is used for single-line comments in JavaScript?',
        options: ['<!-- -->', '/* */', '//', '#', '**'],
        correctOptionIndex: 2,
        explanation: 'Single-line comments in JavaScript start with double slashes (`//`).'
      },
      {
        prompt: 'Which array method adds one or more elements to the end of an array?',
        options: ['shift()', 'unshift()', 'push()', 'pop()', 'concat()'],
        correctOptionIndex: 2,
        explanation: '`push()` adds elements to the end of an array and returns the new length.'
      },
      {
        prompt: 'What does the `===` operator check in JavaScript?',
        options: ['Only value equality', 'Value and type equality', 'Memory reference equality', 'Type equality only', 'Approximate equality'],
        correctOptionIndex: 1,
        explanation: '`===` checks for strict equality, meaning both value and data type must match.'
      },
      {
        prompt: 'Which built-in method returns the length of a string?',
        options: ['size()', 'length', 'count()', 'index()', 'measure()'],
        correctOptionIndex: 1,
        explanation: '`length` is a property on strings and arrays that returns their item count.'
      },
      {
        prompt: 'How do you write an anonymous arrow function in JavaScript?',
        options: ['function => {}', '() -> {}', '() => {}', 'arrow() {}', 'func => {}'],
        correctOptionIndex: 2,
        explanation: 'Arrow function syntax uses fat arrow notation: `() => {}`.'
      },
      {
        prompt: 'Which method is used to remove the last element from an array?',
        options: ['shift()', 'slice()', 'pop()', 'splice()', 'remove()'],
        correctOptionIndex: 2,
        explanation: '`pop()` removes the last element from an array and returns that element.'
      },
      {
        prompt: 'What is NaN in JavaScript?',
        options: ['Not a Null', 'Not a Number', 'Null and Negative', 'New allocation Node', 'None available'],
        correctOptionIndex: 1,
        explanation: 'NaN stands for "Not a Number", representing a value that is not a valid number.'
      },
      {
        prompt: 'Which function is used to schedule execution of a function after a delay?',
        options: ['setInterval', 'setTimeout', 'setDelay', 'delayTimer', 'runLater'],
        correctOptionIndex: 1,
        explanation: '`setTimeout` calls a function or evaluates an expression after a specified delay.'
      },
      {
        prompt: 'Which scope does a variable declared outside any function have?',
        options: ['Local scope', 'Block scope', 'Global scope', 'Functional scope', 'Module private scope'],
        correctOptionIndex: 2,
        explanation: 'Variables declared outside functions have global scope.'
      },
      {
        prompt: 'What does DOM stand for in web development?',
        options: ['Data Object Model', 'Document Oriented Method', 'Document Object Model', 'Digital Ordinance Module', 'Dynamic Operational Menu'],
        correctOptionIndex: 2,
        explanation: 'DOM stands for Document Object Model, representing the page structure.'
      },
      {
        prompt: 'Which method joins all elements of an array into a string?',
        options: ['concat()', 'join()', 'toString()', 'merge()', 'combine()'],
        correctOptionIndex: 1,
        explanation: '`join()` creates and returns a new string by concatenating all elements in an array.'
      },
      {
        prompt: 'What is the result of `2 + "2"` in JavaScript?',
        options: ['4', '"22"', 'NaN', 'TypeError', 'undefined'],
        correctOptionIndex: 1,
        explanation: 'JavaScript performs type coercion, converting the number 2 into a string and concatenating them to `"22"`.'
      },
      {
        prompt: 'Which keyword handles exceptions in JavaScript?',
        options: ['catch', 'try / catch', 'errorHandling', 'exception', 'rescue'],
        correctOptionIndex: 1,
        explanation: 'The `try...catch` statement catches exceptions thrown in a block of code.'
      },
      {
        prompt: 'Which method returns a new array with all elements that pass a test?',
        options: ['map()', 'filter()', 'reduce()', 'forEach()', 'find()'],
        correctOptionIndex: 1,
        explanation: '`filter()` creates a shallow copy of a portion of a given array filtered down to elements passing the test.'
      },
      {
        prompt: 'How do you write a comment that spans multiple lines?',
        options: ['// line 1 \n // line 2', '/* comment */', '<!-- comment -->', '# comment #', '** comment **'],
        correctOptionIndex: 1,
        explanation: 'Multi-line comments in JavaScript are enclosed within `/*` and `*/`.'
      },
      {
        prompt: 'Which object is the root of the JavaScript client-side hierarchy?',
        options: ['Document', 'Window', 'Navigator', 'Screen', 'Root'],
        correctOptionIndex: 1,
        explanation: 'The `window` object represents the browser window containing the DOM document.'
      },
      {
        prompt: 'Which method checks if an array includes a certain element?',
        options: ['contains()', 'has()', 'includes()', 'search()', 'exist()'],
        correctOptionIndex: 2,
        explanation: '`includes()` determines whether an array includes a certain value, returning true or false.'
      }
    ]
  },
  {
    title: 'Spanish Vocabulary',
    description: 'Essential Spanish words, phrases, and conversational terms for everyday use.',
    category: 'spanish',
    difficulty: 'Beginner',
    tags: ['language', 'spanish', 'vocabulary'],
    questions: [
      {
        prompt: 'What does "Hola" mean in English?',
        options: ['Goodbye', 'Please', 'Hello', 'Thank you', 'Water'],
        correctOptionIndex: 2,
        explanation: '"Hola" is the standard Spanish greeting for "Hello".'
      },
      {
        prompt: 'How do you say "Thank you" in Spanish?',
        options: ['Por favor', 'De nada', 'Lo siento', 'Gracias', 'Adiós'],
        correctOptionIndex: 3,
        explanation: '"Gracias" means "Thank you".'
      },
      {
        prompt: 'What is the English translation for "Agua"?',
        options: ['Apple', 'Water', 'Sugar', 'House', 'Car'],
        correctOptionIndex: 1,
        explanation: '"Agua" means "Water".'
      },
      {
        prompt: 'What does "Buenos días" mean?',
        options: ['Good night', 'Good afternoon', 'Good morning', 'Goodbye', 'See you later'],
        correctOptionIndex: 2,
        explanation: '"Buenos días" translates to "Good morning".'
      },
      {
        prompt: 'How do you say "Please" in Spanish?',
        options: ['Gracias', 'Por favor', 'Perdón', 'Sí', 'De nada'],
        correctOptionIndex: 1,
        explanation: '"Por favor" means "Please".'
      },
      {
        prompt: 'What does "Amigo" mean?',
        options: ['Enemy', 'Stranger', 'Brother', 'Friend', 'Neighbor'],
        correctOptionIndex: 3,
        explanation: '"Amigo" translates to "Friend".'
      },
      {
        prompt: 'What is the English meaning of "Casa"?',
        options: ['Car', 'Cat', 'House', 'Dog', 'School'],
        correctOptionIndex: 2,
        explanation: '"Casa" means "House" or "Home".'
      },
      {
        prompt: 'How do you say "Goodbye" in Spanish?',
        options: ['Hola', 'Adiós', 'Hasta luego', 'Por favor', 'Buenos días'],
        correctOptionIndex: 1,
        explanation: '"Adiós" is the standard word for "Goodbye".'
      },
      {
        prompt: 'What does "Libro" mean in English?',
        options: ['Letter', 'Book', 'Library', 'Pen', 'Paper'],
        correctOptionIndex: 1,
        explanation: '"Libro" translates to "Book".'
      },
      {
        prompt: 'What is the translation of "Gato"?',
        options: ['Dog', 'Cat', 'Bird', 'Fish', 'Horse'],
        correctOptionIndex: 1,
        explanation: '"Gato" means "Cat".'
      },
      {
        prompt: 'How do you say "Yes" in Spanish?',
        options: ['No', 'Tal vez', 'Sí', 'Siempre', 'Nunca'],
        correctOptionIndex: 2,
        explanation: '"Sí" means "Yes".'
      },
      {
        prompt: 'What does "Comida" mean?',
        options: ['Drink', 'Food', 'Clothing', 'Music', 'Money'],
        correctOptionIndex: 1,
        explanation: '"Comida" translates to "Food" or "Meal".'
      },
      {
        prompt: 'What is the English meaning of "Rojo"?',
        options: ['Blue', 'Green', 'Red', 'Yellow', 'Black'],
        correctOptionIndex: 2,
        explanation: '"Rojo" is the color "Red".'
      },
      {
        prompt: 'How do you say "Family" in Spanish?',
        options: ['Familia', 'Familiar', 'Casa', 'Grupo', 'Persona'],
        correctOptionIndex: 0,
        explanation: '"Familia" means "Family".'
      },
      {
        prompt: 'What does "Mañana" mean?',
        options: ['Yesterday', 'Tonight', 'Tomorrow / Morning', 'Week', 'Year'],
        correctOptionIndex: 2,
        explanation: '"Mañana" can mean both "morning" and "tomorrow".'
      },
      {
        prompt: 'What is the translation of "Perro"?',
        options: ['Cat', 'Dog', 'Wolf', 'Fox', 'Lion'],
        correctOptionIndex: 1,
        explanation: '"Perro" means "Dog".'
      },
      {
        prompt: 'How do you say "Night" in Spanish?',
        options: ['Día', 'Tarde', 'Noche', 'Mañana', 'Hora'],
        correctOptionIndex: 2,
        explanation: '"Noche" translates to "Night".'
      },
      {
        prompt: 'What does "Escuela" mean?',
        options: ['Hospital', 'Store', 'School', 'Office', 'Park'],
        correctOptionIndex: 2,
        explanation: '"Escuela" means "School".'
      },
      {
        prompt: 'What is the English translation of "Manzana"?',
        options: ['Banana', 'Orange', 'Apple', 'Grape', 'Peach'],
        correctOptionIndex: 2,
        explanation: '"Manzana" translates to "Apple".'
      },
      {
        prompt: 'How do you say "Happy" in Spanish?',
        options: ['Triste', 'Enojado', 'Feliz', 'Cansado', 'Emocionado'],
        correctOptionIndex: 2,
        explanation: '"Feliz" means "Happy".'
      }
    ]
  },
  {
    title: 'Git & GitHub Fundamentals',
    description: 'Core version control commands, workflows, and collaboration concepts.',
    category: 'devops',
    difficulty: 'Intermediate',
    tags: ['git', 'github', 'version-control'],
    questions: [
      {
        prompt: 'Which command initializes a new Git repository?',
        options: ['git start', 'git init', 'git new', 'git create', 'git repository'],
        correctOptionIndex: 1,
        explanation: '`git init` creates a new, empty Git repository or reinitializes an existing one.'
      },
      {
        prompt: 'Which command stages changes for the next commit?',
        options: ['git save', 'git stage', 'git add', 'git commit', 'git push'],
        correctOptionIndex: 2,
        explanation: '`git add` adds changes from the working directory to the staging area.'
      },
      {
        prompt: 'How do you check the current status of your working tree and staging area?',
        options: ['git log', 'git check', 'git status', 'git state', 'git info'],
        correctOptionIndex: 2,
        explanation: '`git status` displays the state of the working directory and staged files.'
      },
      {
        prompt: 'Which command records changes (commits) to the repository?',
        options: ['git save', 'git record', 'git commit', 'git store', 'git update'],
        correctOptionIndex: 2,
        explanation: '`git commit` creates a commit containing the current contents of the staging area.'
      },
      {
        prompt: 'How do you clone an existing remote repository to your local machine?',
        options: ['git download', 'git pull', 'git clone', 'git copy', 'git fetch'],
        correctOptionIndex: 2,
        explanation: '`git clone` clones a repository into a newly created directory.'
      },
      {
        prompt: 'Which command switches to a different branch or restores working tree files?',
        options: ['git change', 'git switch', 'git move', 'git transfer', 'git alter'],
        correctOptionIndex: 1,
        explanation: '`git switch` (or `git checkout`) switches branches.'
      },
      {
        prompt: 'What command downloads objects and refs from a remote repository without merging?',
        options: ['git pull', 'git fetch', 'git download', 'git sync', 'git obtain'],
        correctOptionIndex: 1,
        explanation: '`git fetch` downloads commits, files, and refs from a remote repository into your local repo.'
      },
      {
        prompt: 'Which command combines changes from one branch into another?',
        options: ['git combine', 'git join', 'git merge', 'git integrate', 'git append'],
        correctOptionIndex: 2,
        explanation: '`git merge` joins development histories together.'
      },
      {
        prompt: 'How do you push local commits to a remote repository?',
        options: ['git upload', 'git send', 'git push', 'git publish', 'git transfer'],
        correctOptionIndex: 2,
        explanation: '`git push` uploads local repository content to a remote repository.'
      },
      {
        prompt: 'Which command displays the commit history of a repository?',
        options: ['git history', 'git timeline', 'git log', 'git past', 'git list'],
        correctOptionIndex: 2,
        explanation: '`git log` shows committed history.'
      },
      {
        prompt: 'What is a pull request on GitHub?',
        options: ['A command to download code', 'A proposal to merge changes from one branch into another', 'A bug tracking ticket', 'A remote server backup', 'An issue report'],
        correctOptionIndex: 1,
        explanation: 'A pull request lets you tell others about changes you\'ve pushed to a branch on GitHub.'
      },
      {
        prompt: 'Which command creates a new branch and switches to it immediately?',
        options: ['git branch -new', 'git checkout -b', 'git make branch', 'git create-branch', 'git start-branch'],
        correctOptionIndex: 1,
        explanation: '`git checkout -b <branch>` (or `git switch -c`) creates and switches to a new branch.'
      },
      {
        prompt: 'How do you list all local branches in your repository?',
        options: ['git list-branches', 'git branch', 'git show branches', 'git status -b', 'git branches'],
        correctOptionIndex: 1,
        explanation: '`git branch` lists all local branches and highlights the current one.'
      },
      {
        prompt: 'Which file tells Git which files or directories to ignore?',
        options: [' .gitignore', '.gitexclude', 'ignore.txt', '.git-skip', 'config.ignore'],
        correctOptionIndex: 0,
        explanation: '`.gitignore` specifies intentionally untracked files that Git should ignore.'
      },
      {
        prompt: 'How do you temporarily store modified, tracked files without committing them?',
        options: ['git save', 'git stash', 'git pause', 'git hold', 'git store'],
        correctOptionIndex: 1,
        explanation: '`git stash` shelves (stashes) changes away to work on something else.'
      },
      {
        prompt: 'Which command retrieves stashed changes back into your working directory?',
        options: ['git pop', 'git unstash', 'git stash apply', 'git unhide', 'git restore-stash'],
        correctOptionIndex: 2,
        explanation: '`git stash apply` or `git stash pop` applies previously stashed changes.'
      },
      {
        prompt: 'What does HEAD point to in Git?',
        options: ['The remote origin server', 'The latest commit on the main branch', 'The current active commit / branch pointer', 'The root directory', 'The staging area index'],
        correctOptionIndex: 2,
        explanation: '`HEAD` is a pointer to the current branch reference (or commit) you are checked out on.'
      },
      {
        prompt: 'Which command undoes the last commit while keeping the changes in the working directory?',
        options: ['git reset --hard HEAD~1', 'git reset --soft HEAD~1', 'git undo', 'git revert last', 'git clean'],
        correctOptionIndex: 1,
        explanation: '`git reset --soft HEAD~1` moves the branch pointer back one commit while keeping changes staged.'
      },
      {
        prompt: 'What protocol does GitHub primarily use for secure remote repository communication?',
        options: ['FTP', 'SSH / HTTPS', 'Telnet', 'SMTP', 'TCP/IP raw socket'],
        correctOptionIndex: 1,
        explanation: 'GitHub supports secure connections via SSH and HTTPS.'
      },
      {
        prompt: 'Which command downloads changes from a remote repository and immediately merges them into the current branch?',
        options: ['git fetch', 'git pull', 'git sync', 'git update', 'git get'],
        correctOptionIndex: 1,
        explanation: '`git pull` runs `git fetch` followed by `git merge`.'
      }
    ]
  }
];

// --- EXECUTE SEED SCRIPT ---
async function seedDatabase() {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/quizapp';
    
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoURI);
    console.log('Connected successfully!');

    console.log('Cleaning existing decks...');
    await Deck.deleteMany({});

    console.log('Inserting sample quiz decks...');
    await Deck.insertMany(sampleDecks);

    console.log(`Database seeded successfully with ${sampleDecks.length} decks!`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();