var canvas = document.getElementById('game');
var context = canvas.getContext('2d');

ponyimg = new Image();
ponyimg.src = 'img/pony.png';

var mashaimg = new Image();
mashaimg.src = 'img/masha.png';

var fireimg = new Image();
fireimg.src = 'img/fire.png';

var explimg = new Image();
explimg.src = 'img/expl.png';

var fonimg = new Image();
fonimg.src = 'img/background.png';

var pony = [];
var timer = 0;
var masha = { x: 350, y: 600, animx: 0, animy: 0 };
var fire = [];
var expl = [];
var score = 0;
var z = 0;
var audio = new Audio();
audio.src = 'audio.mp3'
audio.volume = 0.3;
var fonaudio = new Audio();
fonaudio.src = 'fonaudio.mp3'
fonaudio.volume = 0.3;

canvas.addEventListener('mousemove', function (event) {
    masha.x = event.offsetX - 30;
    masha.y = event.offsetY - 50;
});

let start = document.querySelector('.start');
start.addEventListener('click', function () {
    game();
});

//совместимость с браузерами
var requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 20);
        };
})();

function game() {
    update();
    render();
    requestAnimFrame(game);
}

function update() {
    timer++;
    if (timer % 50 == 0) { // единороги
        pony.push({
            x: Math.random() * 750,
            y: 0,
            dx: Math.random() * 2 - 2,
            dy: Math.random() * 2 + 1,
            del: 0
        });
    }
    if (timer % 40 == 0) {
        fire.push({
            x: masha.x + 50,
            y: masha.y,
            dx: 0,
            dy: -3
        });
    }

    //физика
    for (i in pony) {
        pony[i].x = pony[i].x + pony[i].dx;
        pony[i].y = pony[i].y + pony[i].dy;

        //границы
        if (pony[i].x >= 700 || pony[i].x < 0) pony[i].dx = -pony[i].dx;
        if (pony[i].y > 1000) pony.splice(i, 1);

        //проверим каждый pony на столкновение с каждой пулей
        for (j in fire) {

            if (Math.abs(pony[i].x + 50 - fire[j].x - 15) < 100 && Math.abs(pony[i].y - fire[j].y) < 50) {
                //произошло столкновение

                //спавн взрыва
                expl.push({ x: pony[i].x - 50, y: pony[i].y - 50, });
                if (expl.length > 10)
                    expl.splice(0, 2);

                score = score + 1;//счетчик очков
                document.querySelector('.score').innerHTML = `${score}`;

                //помечаем pony на удаление
                pony[i].del = 1;
                fire.splice(j, 1);
                break;
            }
        }
        //удаляем астероиды
        if (pony[i].del == 1) pony.splice(i, 1);
    }
    for (i in fire) {
        fire[i].x = fire[i].x + fire[i].dx;
        fire[i].y = fire[i].y + fire[i].dy;

        if (fire[i].y < -30) fire.splice(i, 1);
    }
}
function render() {
    context.drawImage(fonimg, 0, 0, 800, 800);
    context.drawImage(mashaimg, masha.x, masha.y, 100, 100);

    for (i in fire) context.drawImage(fireimg, fire[i].x, fire[i].y, 30, 30);
    for (i in pony) context.drawImage(ponyimg, pony[i].x, pony[i].y, 100, 100);
    for (i in expl) context.drawImage(explimg, expl[i].x, expl[i].y, 70, 70);

    if (z < 1) {
        fonaudio.play();
        z++;
    }

    if (z < 2 && score == 200) {
        fonaudio.pause();
        alert('Любимая, поздравляю тебя с праздником! Ты выиграла поездку в Японию c ЛЮБИМЫМ МУЖЧИНОЙ 13.02.2022 в 12:30 ;)')
        z++;
        audio.play();
    }
    if (z < 3 && score == 400) {
        alert('Рад, что тебе понравилась игра)))  Ты получаешь одну любую шоколадку на выбор за настойчивость!   Не забудь сфоткать это сообщение')
        z++
    }
}