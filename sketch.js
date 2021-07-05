var dog,sadDog,happyDog, database;
var foodS,foodStock;
var addFood;
var foodObj;
var fed;
var lastFed;
var foodStockVal;
var fedTime;

function preload(){
sadDog=loadImage("Dog.png");
happyDog=loadImage("happy dog.png");
}

function setup() {
  database=firebase.database();
  createCanvas(1000,400);

  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  
  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;

  feedDog = createButton("feed dog");
  feedDog.position(700, 95);
  feedDog.mousePressed(feedDogFunction);

  addFood = createButton("Add Food");
  addFood.position(800, 95);
  addFood.mousePressed(addFoods)

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

}

function draw() {
  background(46,139,87);
  foodObj.display();

  fedTime = database.ref('FeedTime');
  fedTime.on("value", function(data){
    lastFed = data.val()
  });
 
  //write code to display text lastFed time here
if(lastFed>=12){
  textSize(10);
  fill("black");
  text("Last Feed : "+ lastFed%12 + " PM", 350,30);
}else if(lastFed==0){
  textSize(10);
  fill("black");
  text("Last Feed : 12 AM",350,30);
}else{
  textSize(10);
  fill("black");
  text("Last Feed : "+ lastFed + " AM", 350,30);
}
 
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


function feedDogFunction(){
  dog.addImage(happyDog);
    foodStockVal  = foodObj.getFoodStock();
    console.log(foodStockVal);
  if(foodStockVal <= 0){
    foodObj.updateFoodStock(foodStockVal*0);
  }
  else{
    foodObj.updateFoodStock(foodStockVal-1);
  }
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })

}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}
