'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

console.log(accounts);

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements) {
  containerMovements.innerHTML = '';
  movements.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposito' : 'saque';

    const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__value">${mov}€</div>
        </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// displayMovements(account1.movements);

const calcDisplayBalance = function (acc) {
  const balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  acc.balance = balance; /// criando um novo valor no obj acc balance movements
  labelBalance.textContent = `${acc.balance} €`;
};

// calcDisplayBalance(account1.movements);

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${out}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}€`;
};

// calcDisplaySummary(account1.movements);

///////////////////////////////////////////////////////////
//função para pega  a primeira letra do nome e colocar em minusculo
// const user = 'Steven Thomas Williams';

// const createUserNamesEX = function (user) {
//   const username = user
//     .toLowerCase()
//     .split(' ') // separa a string
//     .map(name => name[0])
//     .join(''); // junta a string
//   return username;
// };

// console.log(createUserNamesEX('tharly rodrigues elizeu'));

const createUserNames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner // criar um novo obj ao obg
      .toLowerCase()
      .split(' ') // separa a string
      .map(name => name[0])
      .join(''); // junta a string
  });
};

createUserNames(accounts);

const updateUI = acc => {
  // display movimentações
  displayMovements(acc.movements);
  // display balance
  calcDisplayBalance(acc);
  //display summary
  calcDisplaySummary(acc);
  // console.log(acc.owner);
};

// console.log(accounts);
////////////////////////////////////////////////////////////
// add o login usuários;
// event handlers

let currentAccount;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  // console.log('LOGIN');

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
  }
  //display UI e mensagem
  labelWelcome.textContent = `Bem Vindo, Sr ${
    // currentAccount.owner.split(' ')[0]
    currentAccount.owner
  }`;

  // limpa inputs
  inputLoginUsername.value = '';
  inputLoginPin.value = '';
  //tira o foco do input PIN
  inputLoginPin.blur();

  containerApp.style.opacity = 100;

  //update UI
  updateUI(currentAccount);
});

/// TRANSFERÊNCIA DE VALORES ENTRE USUÁRIOS

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);

  //procurar a conta certa dentro do accounts
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  inputTransferAmount.value = inputTransferTo.value = '';

  console.log(amount, receiverAcc);
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    // console.log('transferência valida');

    //update UI
    updateUI(currentAccount);
  }
});
