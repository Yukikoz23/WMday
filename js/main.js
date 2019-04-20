"use strict";
{

  //[startTime, endTime, tasks, color]
  const items = [];

  const rgb = [
    '#d49885',
    '#abb7b7',
    '#95a5a6',
    '#65c6bb',
    '#68c3a3',
    '#2574a9',
    '#336e7b',
    '#446cb3',
    '#5c97bf',
    '#f1a9a0',
    '#e08283',
    '#f2d984',
    '#d49885',
    '#abb7b7',
    '#95a5a6',
    '#65c6bb',
    '#68c3a3',
    '#2574a9',
    '#336e7b',
    '#446cb3',
    '#5c97bf',
    '#f1a9a0',
    '#e08283',
    '#f2d984',
  ];

  const graphSection = document.getElementById('graph');
  const generateBtn = document.getElementById('generate-btn');
  const saveBtn = document.getElementById('save');
  const tasks = document.querySelectorAll('td > input');
  const canvas = document.querySelector('canvas');

  // スケジュールの入力エラーチェック
  function checkTasks() {
    const errorCount = document.getElementById('error-count');
    const errorTextlength = document.getElementById('error-textlength');
    let tasksCount = 0;
    let invalidTasksCount = 0;

    errorCount.classList.add('hidden');
    errorTextlength.classList.add('hidden');

    tasks.forEach(task => {
      const taskText = task.value;

      if (taskText !== '') {
        tasksCount++;
      }

      if (taskText.length > 6) {
        invalidTasksCount++;
      }
    });

    if (tasksCount < 2) {
      errorCount.classList.remove('hidden');
    }

    if (invalidTasksCount > 0) {
    	errorTextlength.classList.remove('hidden');
    }

    if (tasksCount < 2 || invalidTasksCount > 0) {
    	return false;
    } else {
    	return true;
    }
  }

  // プロフィールを書く
  function createProfile() {
    const inputProf = document.querySelectorAll('#input-profile > li > label > input');
    const textarea = document.querySelector('textarea');
    const h2Prof = document.querySelector('#graph > h2');
    const liProf = document.querySelectorAll('#graph > ul > li');

    h2Prof.textContent =
      `働く${inputProf[0].checked ? 'ママ' : 'パパ'} ${inputProf[2].value}さんの1日`;
    liProf[0].textContent = `年齢： ${inputProf[3].value}歳`;
    liProf[1].textContent =
      `職業： ${inputProf[4].value} ※勤務時間は ${inputProf[5].value}〜${inputProf[6].value}`;
    liProf[2].textContent = `子供の人数・年齢： ${inputProf[7].value}`;
    liProf[3].textContent = `家事育児のサポート状況： ${inputProf[8].value}`;
    liProf[4].textContent = textarea.value;
  }

  // スケジュールの入力情報をもとにitems配列データを作る
  function createItems() {
    const endTime = [];

    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].value !== '') {
        items.push([i, tasks[i].value]);
      }
    }

    for (let i = 0; i < items.length - 1; i++) {
      items[i].splice(1, 0, items[i + 1][0]);
    }

    items[items.length - 1].splice(1, 0, items[0][0]);
  }

  // 円グラフを描く
  function drawChart() {
    const WIDTH = 350;
    const HEIGHT = 350;
    const radius = 150;
    let ctx;
    let dpr;
    let numberAngle;
    let numberX;
    let numberY;
    let number;

    if (typeof canvas.getContext === 'undefined') {
      return;
    }

    ctx = canvas.getContext('2d');

    // 高解像度に対応する処理
    dpr = window.devicePixelRatio || 1;
    canvas.width = WIDTH * dpr;
    canvas.height = HEIGHT * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = WIDTH + 'px';
    canvas.style.height = HEIGHT + 'px';

    // スライスの色情報をセット
    for (let i = 0; i < items.length; i++) {
      switch (items[i][2]) {
        case '就寝':
          items[i].push('#2d4d63');
          break;
        case '睡眠':
          items[i].push('#2d4d63');
          break;
        case '仕事':
          items[i].push('#67809f');
          break;
        default:
          items[i].push(rgb[i]);
      }
    }

    // スライスを描く
    items.forEach(item => {
      const startAngle = item[0] >= 6 ? (item[0] - 6) * 15 : (item[0] + 18) * 15;
      const endAngle = item[1] >= 6 ? (item[1] - 6) * 15 : (item[1] + 18) * 15;
      const sliceAngle = item[1] < item[0] ? (item[1] - item[0] + 24) * 15 : (item[1] - item[0]) * 15;
      ctx.beginPath();
      ctx.moveTo(175, 175);
      ctx.arc(175, 175, radius, Math.PI / 180 * startAngle, Math.PI / 180 * endAngle);
      ctx.fillStyle = item[3];
      ctx.fill();
    });

    // スライスを描き終えてからラベルを描く　（文字数が多いと次のスライスの下に入り込んでしまうため）
    items.forEach(item => {
      const startAngle = item[0] >= 6 ? (item[0] - 6) * 15 : (item[0] + 18) * 15;
      const sliceAngle = item[1] < item[0] ? (item[1] - item[0] + 24) * 15 : (item[1] - item[0]) * 15;
      const labelAngle = startAngle + sliceAngle / 2;
      const labelX = radius * 0.7 * Math.cos(Math.PI / 180 * labelAngle) + 175;
      const labelY = radius * 0.7 * Math.sin(Math.PI / 180 * labelAngle) + 175;

      ctx.beginPath();
      ctx.font = '11px sans-serif';
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'center';
      ctx.fillText(item[2], labelX, labelY);
    });

    // 時間を表す数字を円周に描く
    for (let i = 0; i < 24; i++) {
      numberAngle = i * 15;
      numberX = radius * 1.07 * Math.cos(Math.PI / 180 * numberAngle) + 175;
      numberY = radius * 1.07 * Math.sin(Math.PI / 180 * numberAngle) + 175;
      number = i < 18 ? i + 6 : i - 18;
      ctx.font = '10px sans-serif';
      ctx.fillStyle = '#000';
      ctx.textBaseline = 'middle';
      ctx.fillText(number, numberX, numberY);
    }
  }

  // canvasで描いたものをダウンロード
  function downloadCanvas() {
    // a要素を生成
    let link = document.createElement('a');
    // 画像の表現を含むデータURLをセット
    link.href = canvas.toDataURL('img/png');
    link.download = 'chart.png';
    link.click();
  }

  // 円グラフをダウンロードボタンをクリックした時のイベント
  saveBtn.addEventListener('click', () => {
    downloadCanvas();
  });

  // 円グラフを作るボタンをクリックした時のイベント
  generateBtn.addEventListener('click', () => {
    const arrow = document.getElementById('arrow');

    if (checkTasks() === false) {
    	return;
    }
    graphSection.classList.remove('hidden');
    items.length = 0;
    createItems();
    createProfile();
    drawChart();
    arrow.classList.remove('hidden');
  });

}
