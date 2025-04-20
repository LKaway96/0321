let radio;
let inputBox; // 用於填空題的輸入框
let submitButton;
let restartButton;
let resultText = ""; // 用於儲存結果文字
let table; // 用於存放 CSV 資料
let currentQuestion = 0; // 當前題目索引
let correctCount = 0; // 答對題數
let incorrectCount = 0; // 答錯題數

function preload() {
  // 載入 CSV 檔案
  table = loadTable('questions.csv', 'csv', 'header');
}

function setup() {
  // 產生一個全視窗畫布
  createCanvas(windowWidth, windowHeight);
  // 設定背景顏色為(fefae0)
  background('#fefae0');

  // 建立選項 (radio 按鈕)
  radio = createRadio();
  radio.style('font-size', '24px');
  radio.style('color', 'white'); // 設定選項文字顏色為白色
  radio.position(windowWidth / 2 - 50, windowHeight / 2 - 30);

  // 建立填空題輸入框
  inputBox = createInput();
  inputBox.style('font-size', '24px');
  inputBox.position(windowWidth / 2 - 50, windowHeight / 2 - 30);
  inputBox.hide(); // 初始隱藏

  // 建立送出按鈕
  submitButton = createButton('送出');
  submitButton.style('font-size', '24px');
  submitButton.position(windowWidth / 2 - 30, windowHeight / 2 + 50);
  submitButton.mousePressed(handleSubmit);

  // 建立重新開始按鈕（初始隱藏）
  restartButton = createButton('重新開始');
  restartButton.style('font-size', '24px');
  restartButton.position(windowWidth / 2 - 50, windowHeight / 2 + 100);
  restartButton.mousePressed(restartQuiz);
  restartButton.hide();

  // 顯示第一題
  loadQuestion(currentQuestion);
}

function draw() {
  // 設定背景顏色為(fefae0)
  background('#fefae0');
  
  // 設定填充顏色為 #003049
  fill('#003049');
  noStroke(); // 移除邊框

  // 計算矩形的位置與大小
  let rectWidth = windowWidth / 2;
  let rectHeight = windowHeight / 2;
  let rectX = (windowWidth - rectWidth) / 2;
  let rectY = (windowHeight - rectHeight) / 2;

  // 繪製矩形
  rect(rectX, rectY, rectWidth, rectHeight);

  // 顯示題目或結束文字
  fill(255); // 白色文字
  textSize(24);
  textAlign(CENTER, CENTER);

  if (currentQuestion < table.getRowCount()) {
    // 顯示題目文字
    text(table.getString(currentQuestion, 'question'), windowWidth / 2, windowHeight / 2 - 100);
  } else {
    // 顯示測驗結束訊息，置於方框正中央
    text(resultText, windowWidth / 2, windowHeight / 2);
  }

  // 顯示結果文字（僅在測驗進行中）
  if (currentQuestion < table.getRowCount()) {
    text(resultText, windowWidth / 2, windowHeight / 2 + 150);
    }
}

function windowResized() {
  // 當視窗大小改變時，重新調整畫布大小
  resizeCanvas(windowWidth, windowHeight);

  // 更新 radio、輸入框和按鈕的位置
  radio.position(windowWidth / 2 - 50, windowHeight / 2 - 30);
  inputBox.position(windowWidth / 2 - 100, windowHeight / 2 - 15); // 移動到方框中心
  submitButton.position(windowWidth / 2 - 30, windowHeight / 2 + 50);
  restartButton.position(windowWidth / 2 - 50, windowHeight / 2 + 100);
}

function handleSubmit() {
  let correctAnswer = table.getString(currentQuestion, 'answer');
  let answer;

  if (table.getString(currentQuestion, 'type') === 'multiple') {
    // 取得選中的選項
    answer = radio.value();
  } else if (table.getString(currentQuestion, 'type') === 'fill') {
    // 取得填空題的輸入值
    answer = inputBox.value().trim();
  }

  if (answer === correctAnswer) {
    resultText = "答對了！"; // 更新結果文字
    correctCount++; // 增加答對題數
  } else {
    resultText = "答錯了，請再試一次！"; // 更新結果文字
    incorrectCount++; // 增加答錯題數
  }

  // 切換到下一題
  currentQuestion++;
  if (currentQuestion < table.getRowCount()) {
    loadQuestion(currentQuestion); // 載入下一題
  } else {
    // 顯示測驗結束訊息
    resultText = `測驗結束！答對題數：${correctCount}，答錯題數：${incorrectCount}`;
    radio.html(''); // 清空選項
    inputBox.hide(); // 隱藏輸入框
    submitButton.hide(); // 隱藏送出按鈕
    restartButton.show(); // 顯示重新開始按鈕
  }
}

function loadQuestion(index) {
  // 清空選項和輸入框
  radio.html('');
  inputBox.hide();

  // 載入題目類型
  let type = table.getString(index, 'type');

  if (type === 'multiple') {
    // 載入選擇題
    radio.show();
    let options = [
      table.getString(index, 'option1'),
      table.getString(index, 'option2'),
      table.getString(index, 'option3'),
      table.getString(index, 'option4')
    ];
    for (let i = 0; i < options.length; i++) {
      radio.option(options[i]);
    }
  } else if (type === 'fill') {
    // 載入填空題
    radio.hide();
    inputBox.show();
    inputBox.position(windowWidth / 2 - 100, windowHeight / 2 - 15); // 移動到方框中心
    inputBox.value(''); // 清空文字框內容
  }
}

function restartQuiz() {
  // 重置變數
  currentQuestion = 0;
  correctCount = 0;
  incorrectCount = 0;
  resultText = "";

  // 顯示第一題
  loadQuestion(currentQuestion);

  // 顯示送出按鈕，隱藏重新開始按鈕
  submitButton.show();
  restartButton.hide();
}
