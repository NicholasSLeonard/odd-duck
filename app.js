'use strict';

let products = [];

let chartEl = document.getElementById('resultsChart');
let ctx = chartEl.getContext('2d');

let imageElements = document.querySelectorAll('img');

let sessionSize = 25;
let sessionClicks = 0;

function ProductImage(name, path) {
  this.productName = name;
  this.filePath = path;
  this.imgViews = 0;
  this.imgClicks = 0;
}

ProductImage.prototype.clicked = function () {
  this.imgClicks++;
};
ProductImage.prototype.updateStorage = function () {
  let product = JSON.stringify(this);
  localStorage.setItem(this.productName, product);
};
ProductImage.prototype.getStorage = function () {
  let item = localStorage.getItem(this.productName);
  return JSON.parse(item);
};

function randomGen(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

function createProducts() {
  products[0] = new ProductImage('R2D2Bag', 'img/bag.jpg');
  products[1] = new ProductImage('bananaChopper', 'img/banana.jpg');
  products[2] = new ProductImage('IpadHolder', 'img/bathroom.jpg');
  products[3] = new ProductImage('openToedBoots', 'img/boots.jpg');
  products[4] = new ProductImage('toasterCoffeeMaker', 'img/breakfast.jpg');
  products[5] = new ProductImage('meatBallGum', 'img/bubblegum.jpg');
  products[6] = new ProductImage('chair', 'img/chair.jpg');
  products[7] = new ProductImage('cthulu', 'img/cthulhu.jpg');
  products[8] = new ProductImage('dog-duck', 'img/dog-duck.jpg');
  products[9] = new ProductImage('dragon', 'img/dragon.jpg');
  products[10] = new ProductImage('pens', 'img/pen.jpg');
  products[11] = new ProductImage('pet-sweep', 'img/pet-sweep.jpg');
  products[12] = new ProductImage('scissors', 'img/scissors.jpg');
  products[13] = new ProductImage('shark', 'img/shark.jpg');
  products[14] = new ProductImage('sweep', 'img/sweep.png');
  products[15] = new ProductImage('tauntaun', 'img/tauntaun.jpg');
  products[16] = new ProductImage('unicorn', 'img/unicorn.jpg');
  products[17] = new ProductImage('water-can', 'img/water-can.jpg');
  products[18] = new ProductImage('wine-glass', 'img/wine-glass.jpg');

  products.forEach(function (product) {
    if (product.getStorage() !== null) {
      product.imgViews = product.getStorage().imgViews;
      product.imgClicks = product.getStorage().imgClicks;
    }
  });

}

function renderImages() {
  imageElements.forEach(function (img) {
    let newProduct = randomGen(0, 18);

    while (products[newProduct].productName === imageElements[0].id || products[newProduct].productName === imageElements[1].id || products[newProduct].productName === imageElements[2].id) {
      newProduct = randomGen(0, 18);
    }

    img.src = products[newProduct].filePath;
    img.id = products[newProduct].productName;
    products[newProduct].imgViews++;
    img.addEventListener('click', imageClick);
  });
}

function imageClick() {

  if (sessionClicks < sessionSize) {
    for (let i = 0; i < products.length; i++) {
      if (this.id === products[i].productName) {
        products[i].clicked();
        products[i].updateStorage();
      }
    }
    swapImages();
    sessionClicks++;
  }
  if (sessionClicks === sessionSize) {
    createResultsButton();
    imageElements.forEach(function (img) {
      img.removeEventListener('click', imageClick);
    });
  }
}

function swapImages() {
  let image1 = imageElements[0];
  let image2 = imageElements[1];
  let image3 = imageElements[2];
  imageElements.forEach(function (img) {
    let newProduct = randomGen(0, 18);

    while (products[newProduct].productName === imageElements[0].id || products[newProduct].productName === imageElements[1].id || products[newProduct].productName === imageElements[2].id || products[newProduct].productName === image1.id || products[newProduct].productName === image2.id || products[newProduct].productName === image3.id) {
      newProduct = randomGen(0, 18);
    }
    img.src = products[newProduct].filePath;
    img.id = products[newProduct].productName;
    products[newProduct].imgViews++;
  });
}


function createResultsButton() {
  let body = document.getElementsByTagName('body')[0];
  let btn = document.createElement('button');
  body.appendChild(btn);

  btn.addEventListener('click', graphResults);
  btn.innerText = 'View Results';
}

function printResultsText() {
  let body = document.getElementsByTagName('body')[0];
  for (let i = 0; i < products.length; i++) {
    let line = document.createElement('p');
    line.appendChild(document.createTextNode(products[i].productName + ' got ' + products[i].imgClicks + ' votes and was seen ' + products[i].imgViews));
    body.appendChild(line);
  }
}

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
}


createProducts();
renderImages();
