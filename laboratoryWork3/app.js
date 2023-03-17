"use strict";

// Selectors
const ToDoInput = document.querySelector('#input');
const button = document.querySelector('#submitButton');
const ToDoList = document.querySelector('#todo-list');
const notificationContainer = document.querySelector('#notificationContainer');
const cardFilter = document.querySelector('.select');

// Event Listeners
document.addEventListener('DOMContentLoaded', getStorageCards);
button.addEventListener('click', addCard);
ToDoList.addEventListener('click', checkOrDelete);
cardFilter.addEventListener('click', filterCards);

// Functions
function addCard(e) {
    e.preventDefault();
    if (ToDoInput.value === '') return;
  
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('unchecked');
  
    const checkMark = document.createElement('img');
    checkMark.src = './images/uncheck_button.png';
    checkMark.classList.add('checkmark');
    cardDiv.appendChild(checkMark);
  
    const newCard = document.createElement('li');
    newCard.innerText = ToDoInput.value;
    cardDiv.appendChild(newCard);
  
    const deleteButton = document.createElement('img');
    deleteButton.src = './images/close_button.png';
    deleteButton.classList.add('deleteButton');
    cardDiv.appendChild(deleteButton);
  
    // Save the card text and checked state in local storage
    saveStorageCard(ToDoInput.value, false);
  
    ToDoList.appendChild(cardDiv);
    ToDoInput.value = '';
  
    showNotification('New card added!', 'success');
  }

  function checkOrDelete(e) {
    const item = e.target;
    if (item.classList[0] === 'deleteButton') {
      const card = item.parentElement;
      removeStorageCard(card.querySelector('li').innerText);
      card.remove();
      showNotification('Card deleted!', 'error');
    }
  
    if (item.classList[0] === 'checkmark') {
      const card = item.parentElement;
      const isChecked = card.classList.toggle('checked');
      item.src = isChecked ? './images/check_button.png' : './images/uncheck_button.png';
      // Update the checked state in local storage
      const cardText = card.querySelector('li').innerText;
      saveStorageCard(cardText, isChecked);
      showNotification(isChecked ? 'Card checked.' : 'Card unchecked.', 'success');
    }
  }

  function showNotification(message, type) {
    const notificationContainer = document.getElementById("notification-container");
    const notification = document.createElement("div");
    notification.classList.add("notification");
    if (type === "success") {
      notification.classList.add("notification-success");
    } else {
      notification.classList.add("notification-error");
    }
    notification.innerText = message;
    notificationContainer.appendChild(notification);
    setTimeout(() => {
      notification.remove();
    }, 1500);
  }

  function filterCards(e) {
    const cards = ToDoList.querySelectorAll('div');
    cards.forEach(function (card) {
      switch (e.target.value) {
        case 'All':
          card.classList.remove('deleteCard');
          break;
        case 'Checked':
          if (card.classList.contains('checked')) card.classList.remove('deleteCard');
          else card.classList.add('deleteCard');
          break;
        case 'Non Checked':
          if (card.classList.contains('checked')) card.classList.add('deleteCard');
          else card.classList.remove('deleteCard');
          break;
      }
    });
    localStorage.setItem('selectedFilter', e.target.value);
  }

function saveStorageCard(text, checked) {
  let cards;
  if (localStorage.getItem('cards') === null) cards = [];
  else {
    cards = JSON.parse(localStorage.getItem('cards'));
  }
  const cardData = { text: text, checked: checked };
  const existingCardIndex = cards.findIndex((card) => card.text === text);
  if (existingCardIndex !== -1) {
    // If the card already exists, update its checked state
    cards[existingCardIndex].checked = checked;
  } else {
    cards.push(cardData);
  }
  localStorage.setItem('cards', JSON.stringify(cards));
}

function getStorageCards() {
  let cards;
  if(localStorage.getItem('cards') === null)
      cards = [];
  else {
      cards = JSON.parse(localStorage.getItem('cards'));
  }
  cards.forEach(function(card) {
      const cardDiv = document.createElement('div');
      cardDiv.classList.add('unchecked');
      if (card.checked) {
          cardDiv.classList.toggle('checked');
      }

      const checkMark = document.createElement('img');
      checkMark.src = card.checked ? './images/check_button.png' : './images/uncheck_button.png';
      checkMark.classList.add('checkmark');
      cardDiv.appendChild(checkMark);

      const newCard = document.createElement('li');
      newCard.innerText = card.text;
      cardDiv.appendChild(newCard);

      const deleteButton = document.createElement('img');
      deleteButton.src = './images/close_button.png';
      deleteButton.classList.add('deleteButton');
      cardDiv.appendChild(deleteButton);

      ToDoList.appendChild(cardDiv);
  });

  const selectedFilter = localStorage.getItem('selectedFilter');
  if (selectedFilter) {
    cardFilter.value = selectedFilter;
    filterCards({ target: cardFilter }); 
  }
}


function removeStorageCard(text) {
    let cards;
    if (localStorage.getItem('cards') === null) {
      cards = [];
    } else {
      cards = JSON.parse(localStorage.getItem('cards'));
    }
    const cardIndex = cards.findIndex((card) => card.text === text);
    if (cardIndex !== -1) {
      cards.splice(cardIndex, 1);
      localStorage.setItem('cards', JSON.stringify(cards));
    }
  }

  var canvas = document.getElementById( 'canvas' ),
		ctx = canvas.getContext( '2d' ),
    canvas2 = document.getElementById( 'canvas2' ),
    ctx2 = canvas2.getContext( '2d' ),
		// full screen dimensions
		cw = window.innerWidth,
		ch = window.innerHeight,
    charArr = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'],
    maxCharCount = 100,
    fallingCharArr = [],
    fontSize = 10,
    maxColums = cw/(fontSize);
    canvas.width = canvas2.width = cw;
    canvas.height = canvas2.height = ch;


    function randomInt( min, max ) {
    	return Math.floor(Math.random() * ( max - min ) + min);
    }

    function randomFloat( min, max ) {
    	return Math.random() * ( max - min ) + min;
    }

    function Point(x,y)
    {
      this.x = x;
      this.y = y;
    }

    Point.prototype.draw = function(ctx){

      this.value = charArr[randomInt(0,charArr.length-1)].toUpperCase();
      this.speed = randomFloat(1,5);


      ctx2.fillStyle = "rgba(255,255,255,0.8)";
      ctx2.font = fontSize+"px san-serif";
      ctx2.fillText(this.value,this.x,this.y);

        ctx.fillStyle = "#0F0";
        ctx.font = fontSize+"px san-serif";
        ctx.fillText(this.value,this.x,this.y);



        this.y += this.speed;
        if(this.y > ch)
        {
          this.y = randomFloat(-100,0);
          this.speed = randomFloat(2,5);
        }
    }

    for(var i = 0; i < maxColums ; i++) {
      fallingCharArr.push(new Point(i*fontSize, randomFloat(-500,0)));
    }


    var update = function()
    {

    ctx.fillStyle = "rgba(0,0,0,0.05)";
    ctx.fillRect(0,0,cw,ch);

    ctx2.clearRect(0,0,cw,ch);

      var i = fallingCharArr.length;

      while (i--) {
        fallingCharArr[i].draw(ctx);
        var v = fallingCharArr[i];
      }

      requestAnimationFrame(update);
    }

  update();