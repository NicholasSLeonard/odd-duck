//Written by Nicholas Leonard

'use strict';

//products stores instances of ProductImage objects
let products = [];

const chartEl = document.getElementById('resultsChart');
const ctx = chartEl.getContext('2d');

//imageElements is an array that stores the image elements so they can be accessed later. Same with labelElements.
const imageElements = document.querySelectorAll('img');
const labelElements = document.querySelectorAll('.itemName');

//The sessionSize controls how many times the user must pick an image.
const sessionSize = 25;
let sessionClicks = 0;

//ProductImage stores information about each product, such as clicks and views.
function ProductImage(name, path) {
  this.productName = name;
  this.filePath = path;
  this.imgViews = 0;
  this.imgClicks = 0;
}

//clicked increments the imgClicks counter
ProductImage.prototype.clicked = function () {
  this.imgClicks++;
};
//updateStorage stores the ProductImage object in local storage or updates an existing one.
ProductImage.prototype.updateStorage = function () {
  let product = JSON.stringify(this);
  localStorage.setItem(this.productName, product);
};
//getStorage retrieves the object and parses it for use.
ProductImage.prototype.getStorage = function () {
  let item = localStorage.getItem(this.productName);
  return JSON.parse(item);
};

function randomGen(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

//createProducts fills in the products array with all currently coded products. If localstorage has a value for the ProductImage object saved, the value will be loaded.
function createProducts() {
  products[0] = new ProductImage('R2D2 Bag', 'img/bag.jpg');
  products[1] = new ProductImage('Banana Chopper', 'img/banana.jpg');
  products[2] = new ProductImage('Ipad Holder', 'img/bathroom.jpg');
  products[3] = new ProductImage('Open Toed Boots', 'img/boots.jpg');
  products[4] = new ProductImage('Toaster and Coffee Maker', 'img/breakfast.jpg');
  products[5] = new ProductImage('MeatBall Gum', 'img/bubblegum.jpg');
  products[6] = new ProductImage('Unique Chair', 'img/chair.jpg');
  products[7] = new ProductImage('Cthulu Toy', 'img/cthulhu.jpg');
  products[8] = new ProductImage('Dog Duck Mask', 'img/dog-duck.jpg');
  products[9] = new ProductImage('Dragon Meat', 'img/dragon.jpg');
  products[10] = new ProductImage('Utensil Pens', 'img/pen.jpg');
  products[11] = new ProductImage('Pet Sweep Slippers', 'img/pet-sweep.jpg');
  products[12] = new ProductImage('Pizza scissors', 'img/scissors.jpg');
  products[13] = new ProductImage('Shark Sleeping Bag', 'img/shark.jpg');
  products[14] = new ProductImage('Baby Sweeper', 'img/sweep.png');
  products[15] = new ProductImage('Tauntaun Sleeping Bag', 'img/tauntaun.jpg');
  products[16] = new ProductImage('Unicorn Meat', 'img/unicorn.jpg');
  products[17] = new ProductImage('Self Filling Watering Can', 'img/water-can.jpg');
  products[18] = new ProductImage('Unique Wine Glass', 'img/wine-glass.jpg');

  products.forEach(function (product) {
    if (product.getStorage() !== null) {
      product.imgViews = product.getStorage().imgViews;
      product.imgClicks = product.getStorage().imgClicks;
    }
  });

}

//renderImages calls the genImages function and applies a onclick listener to each image.
function renderImages() {
  genImages();
  imageElements.forEach(function (img) {
    img.addEventListener('click', imageClick);
  });
}

//imageClick checks to make sure the user has not reached the end of the session, and either increments 'clicks' of the product the user clicked on,
//or removes the images and onclick listeners if the user has reached the end of the session
function imageClick() {

  if (sessionClicks < sessionSize) {
    for (let i = 0; i < products.length; i++) {
      if (this.id === products[i].productName) {
        products[i].clicked();
        products[i].updateStorage();
      }
    }
    genImages();
    sessionClicks++;
  }
  if (sessionClicks === sessionSize) {
    clearImages();
    createButton('results', graphResults, 'View Results');
    imageElements.forEach(function (img) {
      img.removeEventListener('click', imageClick);
    });
  }
}

//genImages generates a new image for each of imageElements. It checks that the new product has not been shown last round, or is not already present this round.
//It also updates the labels for each image using the labelElements array
function genImages() {
  let previousImages = [imageElements[0].id, imageElements[1].id, imageElements[2].id];

  for (let i = 0; i < imageElements.length; i++) {
    let newProduct = randomGen(0, 18);

    while (products[newProduct].productName === imageElements[0].id || products[newProduct].productName === imageElements[1].id || products[newProduct].productName === imageElements[2].id || products[newProduct].productName === previousImages[0] || products[newProduct].productName === previousImages[1] || products[newProduct].productName === previousImages[2]) {
      newProduct = randomGen(0, 18);
    }
    labelElements[i].innerHTML = products[newProduct].productName;
    imageElements[i].src = products[newProduct].filePath;
    imageElements[i].id = products[newProduct].productName;
    products[newProduct].imgViews++;
  }
}

//clearStorage erases all data on the localStorage
function clearStorage() {
  localStorage.clear();
}
// clearImages roves both label and img elements from the page.
function clearImages() {
  for (let i = 0; i < imageElements.length; i++) {
    imageElements[i].remove();
    labelElements[i].remove();
  }
}
//createButton creates a button created as a child of 'element' with an onclick listener that activates 'action' and is rendered with 'text' text inside.
function createButton(element, action, text) {
  let parentEl = document.getElementById(element);
  let btn = document.createElement('button');
  parentEl.appendChild(btn);

  btn.addEventListener('click', action);
  btn.innerText = text;
}
// printResultsText prints out a line that states the number of clicks and views each ProductImage got. Currently unused.
function printResultsText() {
  let resultsEl = document.getElementById('results')[0];
  for (let i = 0; i < products.length; i++) {
    let line = document.createElement('p');
    line.appendChild(document.createTextNode(products[i].productName + ' got ' + products[i].imgClicks + ' votes and was seen ' + products[i].imgViews));
    resultsEl.appendChild(line);
  }
}

// graphResults generates a chart using Chart.js. It summarizes the number of clicks and views each ProductImage has using a bar chart.
//it also generates a button if the user would like to clear all stored data.
function graphResults() {

  let clicks = [];
  let views = [];
  let labels = [];

  products.forEach(function (product) {

    clicks.push(product.imgClicks);
    views.push(product.imgViews);
    labels.push(product.productName);
  });

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: '# of Clicks',
        data: clicks,
        backgroundColor: 'green'
      }, {
        label: '# of Views',
        data: views,
        backgroundColor: 'blue'
      }],
    }
  });
  document.getElementsByTagName('button')[0].remove();
  createButton('results', function () {
    clearStorage();
    document.getElementsByTagName('button')[0].remove();
    document.getElementsByTagName('canvas')[0].remove();
    graphResults();
  }, 'Click to clear all data');
}


createProducts();
renderImages();
