import fs from "fs";
import path from "path";
import crypto from "crypto";

const STORAGE_DIR = path.join("/tmp", "travelblog-mock");
const DB_FILE = path.join(STORAGE_DIR, "db.json");
const IMAGES_DIR = path.join(STORAGE_DIR, "images");

const SEED_VERSION = 3;

const MOCK_COMMENTS = {
  "Рассвет над Байкалом": [
    ["Иванов Иван Иванович", "Прекрасное место! В следующем году тоже поеду.", "2024-07-22T10:16:16.000000Z"],
    ["Смирнова Анна", "Лёд на Байкале — просто магия. Добавила в список мест!", "2024-07-23T08:41:02.000000Z"],
    ["Ковалёв Дмитрий", "В феврале там очень холодно? Едем в марте, теперь спокойнее.", "2024-07-25T14:12:47.000000Z"],
    ["Огай Марина", "Фотографии с трещинами во льду — нечто. Спасибо за историю!", "2024-07-26T09:05:33.000000Z"],
    ["Петров Сергей", "Были на Ольхоне летом. Зима выглядит интереснее, признаю.", "2024-07-28T19:33:11.000000Z"],
  ],
  "Степи и Астана": [
    ["Гусева Ольга", "Степь в июне — море ковыля. Очень узнаю эти ощущения.", "2024-08-02T07:55:20.000000Z"],
    ["Лебедев Павел", "Байтерек ночью впечатляет, согласен!", "2024-08-03T16:22:58.000000Z"],
    ["Шакирова Динара", "Отличный маршрут. Сколько дней закладывали на дорогу?", "2024-08-05T11:40:05.000000Z"],
    ["Морозов Илья", "Астана — город контрастов, точно подмечено.", "2024-08-06T13:17:44.000000Z"],
    ["Тихонова Вера", "Вернулась оттуда в прошлом году: степь, ветер и город будущего.", "2024-08-09T09:28:19.000000Z"],
  ],
  "Париж с высоты Монмартра": [
    ["Сорокина Алина", "Сакре-Кёр на закате — лучшая смотровая в Париже, без споров.", "2024-08-12T18:02:37.000000Z"],
    ["Мельник Олег", "Эйфелева башня в момент зажигания огней — что-то незабываемое.", "2024-08-13T21:44:12.000000Z"],
    ["Рахимова Лейла", "Спасибо, теперь знаю, куда пойти в первый вечер.", "2024-08-15T10:09:56.000000Z"],
    ["Дёмин Артём", "А сколько стоил фуникулёр на Монмартр?", "2024-08-17T12:51:03.000000Z"],
    ["Панова Елизавета", "Читается на одном дыхании. Парижу — да!", "2024-08-20T15:36:29.000000Z"],
  ],
  "Один зимний день в Венеции": [
    ["Васильева Ксения", "Зимняя Венеция — недооценённая классика. Согласна на все сто.", "2024-09-01T08:14:41.000000Z"],
    ["Ким Андрей", "Туман над каналом звучит как кадр из фильма.", "2024-09-02T10:47:18.000000Z"],
    ["Борисова Наталия", "Кофе за два евро в Венеции? Расскажите место, где это!", "2024-09-04T09:23:52.000000Z"],
    ["Фролов Максим", "Были в ноябре — туристов почти нет, город твой.", "2024-09-06T17:38:07.000000Z"],
    ["Зайцева Полина", "Добавила в план на февраль. Спасибо за идею!", "2024-09-08T11:59:30.000000Z"],
  ],
  "Два сезона Северной Осетии. ч. 1 — Зима": [
    ["Абаев Тимур", "Даргавс — мой родной край. Рад, что вам понравилось!", "2024-09-11T07:31:14.000000Z"],
    ["Романова Дарья", "Пироги с сыром — отдельный повод поехать, чесслово.", "2024-09-12T12:06:48.000000Z"],
    ["Кабанов Станислав", "Жду вторую часть про лето!", "2024-09-14T19:44:23.000000Z"],
    ["Осипова Людмила", "Перевал и трактор — это уже приключение. Напишите подробнее!", "2024-09-16T08:52:39.000000Z"],
    ["Гришин Валентин", "Цейское ущелье зимой — да, это отдельная планета.", "2024-09-19T14:27:55.000000Z"],
  ],
  "Три дня на Бали без интернета": [
    ["Юсупова Регина", "Отдых без уведомлений — лучший вид отдыха. Проверено.", "2024-09-22T09:18:36.000000Z"],
    ["Соколов Марк", "Улувату — самый красивый край острова, с вами соглашаюсь.", "2024-09-24T13:41:02.000000Z"],
    ["Кузьмина Алина", "А где жили? Ищу виллу в джунглях на март.", "2024-09-26T10:29:17.000000Z"],
    ["Багров Никита", "Досёрферы на рассвете — это только половина красоты, верно?", "2024-09-28T16:55:43.000000Z"],
    ["Миронова Татьяна", "Прямо захотелось выключить телефон. Отличная история!", "2024-09-30T20:03:28.000000Z"],
  ],
};

function applyMockComments(data) {
  let maxId = 0;
  data.posts.forEach(function (p) {
    (p.comments || []).forEach(function (c) {
      if (c.id > maxId) maxId = c.id;
    });
  });
  const byTitle = {};
  data.posts.forEach(function (p) { byTitle[p.title] = p; });
  Object.keys(MOCK_COMMENTS).forEach(function (title) {
    const post = byTitle[title];
    if (!post) return;
    post.comments = post.comments || [];
    MOCK_COMMENTS[title].forEach(function (m) {
      const dup = post.comments.some(function (c) {
        return c.author_name === m[0] && c.comment === m[1];
      });
      if (dup) return;
      maxId += 1;
      post.comments.push({
        id: maxId, post_id: post.id,
        author_name: m[0], comment: m[1], created_at: m[2],
      });
    });
  });
  data.nextIds = data.nextIds || { post: 1, comment: 1 };
  data.nextIds.comment = Math.max(data.nextIds.comment || 1, maxId + 1);
}

function extraSeedPosts() {
  return [
    { id: 4, user_id: 1, title: "Один зимний день в Венеции",
      description: "Венеция зимой — это когда город наконец принадлежит тебе. Туман над Гранд-каналом, пустая площадь Сан-Марко и гондольеры, которые уже не мечутся за туристами. Тёплый морской воздух, крики чаек и кофе на барной стойке за два евро — не спешите покидать город на воде до весны.",
      country: "Италия", city: "Венеция", photo: "/images/Vinece.jpg", comments: [] },
    { id: 5, user_id: 1, title: "Два сезона Северной Осетии. ч. 1 — Зима",
      description: "Даргавс, Цейское ущелье и дорога, которая петляет вдоль пропасти. Зимой здесь пусто и по-настоящему высоко: снег скрипит под ногами, а осетинские пироги с сыром греют лучше любого пледа. Отдельный рассказ — про то, как мы застряли на перевале и нас отбуксировал местный трактор.",
      country: "Россия", city: "Владикавказ", photo: "/images/1720900100-osetia.png", comments: [] },
    { id: 6, user_id: 1, title: "Три дня на Бали без интернета",
      description: "Улувату, рисовые террасы и вилла в джунглях, где Wi-Fi ловил раз в сутки — и это оказалось лучшим, что могло случиться. Рассвет на пляже с досёрферов, закат в Warung с рыбой на гриле и деньги на балийские храмовые подношения. Рекомендую всем, кто устал от уведомлений.",
      country: "Индонезия", city: "Улувату", photo: "/images/1720900200-bali.png", comments: [] },
  ];
}

function seed() {
  const data = {
    users: [
      { id: 1, email: "demo@travelblog.com", password: "12345",
        full_name: "Иванов Иван Иванович", city: "Москва", country: "Россия",
        bio: "Лет десять в дороге: от Камчатки до Португалии. Люблю рассветы над водой.", photo: "" },
      { id: 2, email: "test@mail.ru", password: "12345",
        full_name: "Боярская Варвара Михайловна", city: "Вышний Волочёк", country: "",
        bio: "Я обожаю путешествовать. Мне нравится открывать для себя новые места, знакомиться с разными культурами и традициями. Я всегда готова отправиться в путь, даже если это означает покинуть зону комфорта. В дороге я встречаю новых людей, учусь новому и наслаждаюсь красотами природы. Путешествия дают мне возможность расширить свой кругозор и узнать больше о мире вокруг меня. \nЯ уверена, что каждый новый опыт делает меня сильнее и мудрее.",
        photo: "/images/1791135560-4ea6f0d1.jpg" },
      { id: 3, email: "chell3pac@gmail.com", password: "12345",
        full_name: "", city: "", country: "", bio: "", photo: "" },
    ],
    tokens: { "2|mocktoken0001": 1 },
    posts: [
      { id: 1, user_id: 1, title: "Один зимний день в Венеции",
        description: "Говорят, что Венецию покинуло 70% местных жителей. Говорят, что это из-за сверх туризма. Еще говорят, что Венеци...",
        country: "Италия", city: "Венеция", photo: "/images/Vinece.jpg",
        comments: [
          { id: 16, post_id: 4, author_name: "Васильева Ксения", comment: "Зимняя Венеция — недооценённая классика. Согласна на все сто.", created_at: "2024-09-01T08:14:41.000000Z" },
          { id: 17, post_id: 4, author_name: "Ким Андрей", comment: "Туман над каналом звучит как кадр из фильма.", created_at: "2024-09-02T10:47:18.000000Z" },
          { id: 18, post_id: 4, author_name: "Борисова Наталия", comment: "Кофе за два евро в Венеции? Расскажите место, где это!", created_at: "2024-09-04T09:23:52.000000Z" },
          { id: 19, post_id: 4, author_name: "Фролов Максим", comment: "Были в ноябре — туристов почти нет, город твой.", created_at: "2024-09-06T17:38:07.000000Z" },
          { id: 20, post_id: 4, author_name: "Зайцева Полина", comment: "Добавила в план на февраль. Спасибо за идею!", created_at: "2024-09-08T11:59:30.000000Z" },
        ] },
      { id: 2, user_id: 1, title: "Фуншал. Расслабленный и броский",
        description: "Обзорно о замках Фуншала, музеях, скульптурах и нарядных улицах центра",
        full_description: "Столичные города всегда полны достопримечательностей, даже если это маленькая столица совсем небольшого острова. Не всегда хватает времени, чтобы увидеть всё интересное, но даже то, что успели, трудно уместить в один рассказ. \n\nКое-о чем я написала ранее: о катании на тобогане и канатной дороге, о красочном рынке Фуншала, о магнолиях в городском саду и о восхитительном парке на горе Монте Палас. Всё это основные развлечения из разряда «маст-ту-си», но в городе ещё много туристических локаций и атмосферных мест. \n\nБлиже к вечеру, когда мы возвращались с экскурсий по Мадейре, как правило оставалось время, чтобы погулять по Фуншалу самостоятельно и исследовать его в своем ритме. Город довольно симпатичный, не Лиссабон, конечно, но колоритности ему не занимать. \n\nПо пути из отеля в исторический центр и обратно, мы каждый раз проходили мимо оживленной кольцевой развязки, украшенной прелестным фонтаном Ротонда-ду-Инфанте (Rotunda do Infante). Получилось, что именно встречей с этим фонтаном начинались и заканчивались все наши вечерние прогулки. Он стал для меня своеобразным символом и визитной карточкой Фуншала. \n\nКольцевая развязка, пограничная между старой и более новой частями города, была спроектирована в 1945 году архитектором Фариа да Кошта, а скульптор Антониу Дуарте создал Ротонду. Оценить её вполне получилось в тот единственный раз, когда фонтан не работал: композиция представляет собой земной шар, заключенный в армиллярную сферу, из-под которой выпрыгивают четыре морских коня. Не знаю, почему не сфотографировала, наверно, на тот момент мысленно уже отдыхала в отеле. \n\nПару слов о нашем отеле. The Views Baia, оправдывая свое название, радовал роскошными видами на залив Фуншала, которые открывались из окон ресторана, а балкон в нашем номере «смотрел» на город и форт Пику, посвященный Иоанну Крестителю. \n\nИнтерьер, в оформлении которого присутствовали элементы бохо, был еще одной изюминкой отеля. Тем, кто любит предметы ручной работы из натуральных материалов, скорее всего, знаком этот термин. ",
        country: "Португалия", city: "Фуншал", photo: "/images/Funchal.jpg",
        comments: [
          { id: 1, post_id: 1, author_name: "Иванов Иван Иванович", comment: "Интересный городок, узоры брусчатки, разрисованные двери, панно из плитки, вроде незначительные детали, а придают его лицу особый шарм завершенного образа. Сразу видно, какое место у памятника Роналду натирают на удачу", created_at: "2024-07-22T10:16:16.000000Z" },
          { id: 2, post_id: 1, author_name: "Смирнова Анна", comment: "Португальские черты, конечно, угадываются легко. Можно не читать текст, но фото понять о какой стране идёт речь. А то, что Роналду из этого городка, это круто", created_at: "2024-07-23T08:41:02.000000Z" },
          { id: 3, post_id: 1, author_name: "Ковалёв Дмитрий", comment: "Игорь, я в футболе и игроках разбираюсь на уровне зеро )) И памятник мне совсем не понравился. Слышала, что местным также, далеко не всем нравится и построенный Роналду отель. Как бы гордятся выходцем, с одной стороны, но его выпендрёж их коробит", created_at: "2024-07-25T14:12:47.000000Z" },
          { id: 4, post_id: 1, author_name: "Огай Марина", comment: "Очень типичный, узнаваемо португальский!", created_at: "2024-07-26T09:05:33.000000Z" },
          { id: 5, post_id: 1, author_name: "Петров Сергей", comment: "Квартал разрисованных дверей - интересное место! И как украшает улицы!", created_at: "2024-07-28T19:33:11.000000Z" },
        ] },
      { id: 3, user_id: 1, title: "Два сезона Северной Осетии. ч. 1 — Зима",
        description: "Моя первая вылазка в Северную Осетию, январь совсем не популярный месяц тут, но с погодой очень повезло, виды были...",
        country: "Россия", city: "Владикавказ", photo: "/images/Ossetia.jpg",
        comments: [
          { id: 21, post_id: 5, author_name: "Абаев Тимур", comment: "Даргавс — мой родной край. Рад, что вам понравилось!", created_at: "2024-09-11T07:31:14.000000Z" },
          { id: 22, post_id: 5, author_name: "Романова Дарья", comment: "Пироги с сыром — отдельный повод поехать, чесслово.", created_at: "2024-09-12T12:06:48.000000Z" },
          { id: 23, post_id: 5, author_name: "Кабанов Станислав", comment: "Жду вторую часть про лето!", created_at: "2024-09-14T19:44:23.000000Z" },
          { id: 24, post_id: 5, author_name: "Осипова Людмила", comment: "Перевал и трактор — это уже приключение. Напишите подробнее!", created_at: "2024-09-16T08:52:39.000000Z" },
          { id: 25, post_id: 5, author_name: "Гришин Валентин", comment: "Цейское ущелье зимой — да, это отдельная планета.", created_at: "2024-09-19T14:27:55.000000Z" },
        ] },
      { id: 4, user_id: 1, title: "Короткое воспоминание о Монополи",
        description: "За окном уже снег, минус четыре и рано темнеет… Скоро рождественские и новогодние праздники. Кажется надо бы...",
        country: "Италия", city: "Монополи", photo: "/images/Monopoli.jpg",
        comments: [
          { id: 6, post_id: 2, author_name: "Гусева Ольга", comment: "Степь в июне — море ковыля. Очень узнаю эти ощущения.", created_at: "2024-08-02T07:55:20.000000Z" },
          { id: 7, post_id: 2, author_name: "Лебедев Павел", comment: "Байтерек ночью впечатляет, согласен!", created_at: "2024-08-03T16:22:58.000000Z" },
          { id: 8, post_id: 2, author_name: "Шакирова Динара", comment: "Отличный маршрут. Сколько дней закладывали на дорогу?", created_at: "2024-08-05T11:40:05.000000Z" },
          { id: 9, post_id: 2, author_name: "Морозов Илья", comment: "Астана — город контрастов, точно подмечено.", created_at: "2024-08-06T13:17:44.000000Z" },
          { id: 10, post_id: 2, author_name: "Тихонова Вера", comment: "Вернулась оттуда в прошлом году: степь, ветер и город будущего.", created_at: "2024-08-09T09:28:19.000000Z" },
        ] },
      { id: 5, user_id: 1, title: "Санкт-Петербург. Дворец Коттедж",
        description: "Дворец Коттедж и парк Александрия располагаются к востоку от центрального петергофского ансамбля на землях...",
        country: "Россия", city: "Санкт-Петербург", photo: "/images/Saint-Petersburg.jpg",
        comments: [
          { id: 11, post_id: 3, author_name: "Сорокина Алина", comment: "Сакре-Кёр на закате — лучшая смотровая в Париже, без споров.", created_at: "2024-08-12T18:02:37.000000Z" },
          { id: 12, post_id: 3, author_name: "Мельник Олег", comment: "Эйфелева башня в момент зажигания огней — что-то незабываемое.", created_at: "2024-08-13T21:44:12.000000Z" },
          { id: 13, post_id: 3, author_name: "Рахимова Лейла", comment: "Спасибо, теперь знаю, куда пойти в первый вечер.", created_at: "2024-08-15T10:09:56.000000Z" },
          { id: 14, post_id: 3, author_name: "Дёмин Артём", comment: "А сколько стоил фуникулёр на Монмартр?", created_at: "2024-08-17T12:51:03.000000Z" },
          { id: 15, post_id: 3, author_name: "Панова Елизавета", comment: "Читается на одном дыхании. Парижу — да!", created_at: "2024-08-20T15:36:29.000000Z" },
        ] },
      { id: 6, user_id: 1, title: "Арабская сказка: успеть за 8 часов ",
        description: "Длинная стыковка на пути в Южную Америку: знакомство с Дохой, столицей одного из самых маленьких государств...",
        country: "ОАЭ", city: "Дубай", photo: "/images/Dubai.jpg",
        comments: [
          { id: 26, post_id: 6, author_name: "Юсупова Регина", comment: "Отдых без уведомлений — лучший вид отдыха. Проверено.", created_at: "2024-09-22T09:18:36.000000Z" },
          { id: 27, post_id: 6, author_name: "Соколов Марк", comment: "Улувату — самый красивый край острова, с вами соглашаюсь.", created_at: "2024-09-24T13:41:02.000000Z" },
          { id: 28, post_id: 6, author_name: "Кузьмина Алина", comment: "А где жили? Ищу виллу в джунглях на март.", created_at: "2024-09-26T10:29:17.000000Z" },
          { id: 29, post_id: 6, author_name: "Багров Никита", comment: "Досёрферы на рассвете — это только половина красоты, верно?", created_at: "2024-09-28T16:55:43.000000Z" },
          { id: 30, post_id: 6, author_name: "Миронова Татьяна", comment: "Прямо захотелось выключить телефон. Отличная история!", created_at: "2024-09-30T20:03:28.000000Z" },
        ] },
    ],
    nextIds: { post: 7, comment: 37 },
    seedVersion: SEED_VERSION,
  };
  return data;
}

let db;
function loadDb() {
  try {
    if (!fs.existsSync(STORAGE_DIR)) fs.mkdirSync(STORAGE_DIR, { recursive: true });
    if (!fs.existsSync(IMAGES_DIR)) fs.mkdirSync(IMAGES_DIR, { recursive: true });
    if (fs.existsSync(DB_FILE)) {
      db = JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
      if (!db || !Array.isArray(db.posts)) throw new Error("bad db");
      return;
    }
  } catch (e) { /* пересидируем ниже */ }
  db = seed();
  saveDb();
}
function saveDb() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
  } catch (e) {}
}

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, Accept",
  "Access-Control-Allow-Methods": "GET, POST, PATCH, OPTIONS",
};
function json(res, status, data) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8", ...CORS });
  res.end(JSON.stringify(data));
}
function excerptOf(text, max) {
  max = max || 120;
  if (!text) return "";
  return text.length > max ? text.slice(0, max).trimEnd() + "…" : text;
}
function publicUser(u) {
  const out = { id: u.id, full_name: u.full_name || "", city: u.city || "", country: u.country || "", bio: u.bio || "" };
  if (u.photo) out.photo = u.photo;
  return out;
}
function userInfoFor(u) {
  return { full_name: u.full_name || "", city: u.city || "", country: u.country || "", bio: u.bio || "" };
}
function getBearer(req) {
  const m = /^Bearer\s+(.+)$/i.exec(req.headers["authorization"] || "");
  return m ? m[1] : null;
}
function userByToken(req) {
  const token = getBearer(req);
  const uid = token && db.tokens[token];
  return uid ? db.users.find(function (u) { return u.id === uid; }) || null : null;
}
function readBody(req) {
  return new Promise(function (resolve, reject) {
    const chunks = [];
    req.on("data", function (c) { chunks.push(c); });
    req.on("end", function () { resolve(Buffer.concat(chunks)); });
    req.on("error", reject);
  });
}

function parseMultipart(buffer, contentType) {
  const m = /boundary=(?:"([^"]+)"|([^;]+))/i.exec(contentType);
  if (!m) return { fields: {}, files: {} };
  const boundary = "--" + (m[1] || m[2]);
  const fields = {};
  const files = {};
  const binaryStr = buffer.toString("binary");
  const parts = binaryStr.split(boundary);
  for (let i = 1; i < parts.length; i++) {
    let part = parts[i];
    if (part.slice(0, 2) === "--") break;
    if (part.slice(0, 2) === "\r\n") part = part.slice(2);
    const idx = part.indexOf("\r\n\r\n");
    if (idx === -1) continue;
    const headers = part.slice(0, idx);
    let body = part.slice(idx + 4);
    if (body.slice(-2) === "\r\n") body = body.slice(0, -2);
    const nameMatch = /name="([^"]*)"/i.exec(headers);
    const fileMatch = /filename="([^"]*)"/i.exec(headers);
    const name = nameMatch ? nameMatch[1] : "";
    if (!name) continue;
    if (fileMatch) {
      files[name] = { filename: fileMatch[1], data: Buffer.from(body, "binary") };
    } else {
      fields[name] = Buffer.from(body, "binary").toString("utf8");
    }
  }
  return { fields: fields, files: files };
}

function saveUploadedFile(file) {
  if (!file || !file.filename) return "";
  const ext = (path.extname(file.filename) || ".png").toLowerCase();
  const safe = ext === ".png" || ext === ".jpg" || ext === ".jpeg" ? ext : ".png";
  const name = Math.floor(Date.now() / 1000) + "-" + crypto.randomBytes(4).toString("hex") + safe;
  try {
    fs.writeFileSync(path.join(IMAGES_DIR, name), file.data);
  } catch (e) { return ""; }
  return "/images/" + name;
}
function parseJson(raw) {
  try { return JSON.parse(raw.toString("utf8") || "{}"); } catch (e) { return {}; }
}

function getRoute(req) {
  try {
    const url = new URL(req.url, "http://localhost");
    const r = url.searchParams.get("route");
    if (r) {
      const decoded = decodeURIComponent(r).replace(/^\/+/, "");
      return decoded.startsWith("images/") ? "/" + decoded : "/api/" + decoded;
    }
    return decodeURIComponent(url.pathname);
  } catch (e) {
    return "/api/unknown";
  }
}

export default async function handler(req, res) {
  loadDb();

  const route = getRoute(req);

  if (req.method === "OPTIONS") {
    res.writeHead(204, CORS);
    return res.end();
  }

  if (route.startsWith("/images/")) {
    const file = path.join(IMAGES_DIR, path.basename(route));
    if (fs.existsSync(file)) {
      const ext = path.extname(file).toLowerCase();
      const mime = ext === ".png" ? "image/png" : (ext === ".jpg" || ext === ".jpeg") ? "image/jpeg" : "application/octet-stream";
      res.writeHead(200, { "Content-Type": mime, ...CORS });
      return res.end(fs.readFileSync(file));
    }
    return json(res, 404, { error: "Not found" });
  }

  const raw = await readBody(req);
  const contentType = req.headers["content-type"] || "";

  if (route === "/api/register" && req.method === "POST") {
    const body = parseJson(raw);
    const email = String(body.email || "").trim();
    const password = String(body.password || "");
    const errors = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = ["Укажите корректный email"];
    else if (db.users.some(function (u) { return u.email === email; })) errors.email = ["Аккаунт с данным email уже существует"];
    if (!password) errors.password = ["Поле password обязательно"];
    if (Object.keys(errors).length) return json(res, 400, { errors: errors });

    const user = { id: Math.max.apply(null, [0].concat(db.users.map(function (u) { return u.id; }))) + 1,
      email: email, password: password, full_name: "", city: "", country: "", bio: "", photo: "" };
    db.users.push(user);
    const token = "2|" + crypto.randomBytes(20).toString("hex");
    db.tokens[token] = user.id;
    saveDb();
    return json(res, 200, { token: token });
  }

  if (route === "/api/login" && req.method === "POST") {
    const body = parseJson(raw);
    const email = String(body.email || "").trim();
    const password = String(body.password || "");
    const errors = {};
    if (!email) errors.email = ["Укажите логин"];
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = ["Укажите корректный email"];
    if (!password) errors.password = ["Введите пароль"];
    if (Object.keys(errors).length) return json(res, 400, { errors: errors });

    const user = db.users.find(function (u) {
      return u.email === email && u.password === password;
    });
    if (!user) return json(res, 400, { errors: { _global: ["Неправильный логин или пароль"] } });

    const token = "2|" + crypto.randomBytes(20).toString("hex");
    db.tokens[token] = user.id;
    saveDb();
    return json(res, 200, { token: token });
  }

  if (route === "/api/logout" && req.method === "GET") {
    const token = getBearer(req);
    if (token && db.tokens[token]) { delete db.tokens[token]; saveDb(); }
    return json(res, 200, { message: "User logged out" });
  }

  if (route === "/api/user" && req.method === "GET") {
    const user = userByToken(req);
    if (!user) return json(res, 401, { message: "Unauthenticated." });
    return json(res, 200, publicUser(user));
  }

  if (route === "/api/user" && req.method === "POST") {
    const user = userByToken(req);
    if (!user) return json(res, 401, { message: "Unauthenticated." });
    const parsed = parseMultipart(raw, contentType);
    const fields = parsed.fields, files = parsed.files;
    if (fields.full_name !== undefined && fields.full_name.trim()) user.full_name = fields.full_name.trim();
    if (fields.city !== undefined) user.city = fields.city.trim();
    if (fields.country !== undefined) user.country = fields.country.trim();
    if (fields.bio !== undefined) user.bio = fields.bio.trim();
    if (files.photo && files.photo.filename) user.photo = saveUploadedFile(files.photo);
    saveDb();
    return json(res, 200, publicUser(user));
  }

  if (route === "/api/user/password" && req.method === "PATCH") {
    const user = userByToken(req);
    if (!user) return json(res, 401, { message: "Unauthenticated." });
    const password = String(parseJson(raw).password || "");
    if (!password) return json(res, 400, { errors: { password: ["Поле password обязательно"] } });
    user.password = password;
    saveDb();
    return json(res, 200, { message: "OK" });
  }

  if (route === "/api/posts" && req.method === "GET") {
    const list = db.posts.map(function (p) {
      return { id: p.id, title: p.title, excerpt: excerptOf(p.description), photo: p.photo, country: p.country, city: p.city, };
    });
    return json(res, 200, list);
  }

  if (route === "/api/posts" && req.method === "POST") {
    const user = userByToken(req);
    if (!user) return json(res, 401, { message: "Unauthenticated." });
    const parsed = parseMultipart(raw, contentType);
    const fields = parsed.fields, files = parsed.files;
    const errors = {};
    ["title", "description", "country", "city"].forEach(function (f) {
      if (!fields[f] || !fields[f].trim()) errors[f] = ["Поле " + f + " обязательно"];
    });
    if (!files.photo || !files.photo.filename) errors.photo = ["Загрузите фотографию"];
    if (Object.keys(errors).length) return json(res, 400, { errors: errors });

    const post = {
      id: db.nextIds.post++,
      user_id: user.id,
      title: fields.title.trim(),
      description: fields.description.trim(),
      country: fields.country.trim(),
      city: fields.city.trim(),
      photo: saveUploadedFile(files.photo),
      comments: [],
    };
    db.posts.push(post);
    saveDb();
    return json(res, 200, Object.assign({}, post, { excerpt: excerptOf(post.description), userInfo: userInfoFor(user) }));
  }

  const postMatch = /^\/api\/posts\/(\d+)$/.exec(route);
  if (postMatch && req.method === "GET") {
    const post = db.posts.find(function (p) { return p.id === Number(postMatch[1]); });
    if (!post) return json(res, 404, { error: "Post not found." });
    const author = db.users.find(function (u) { return u.id === post.user_id; });
    return json(res, 200, Object.assign({}, post, { excerpt: excerptOf(post.description), userInfo: author ? userInfoFor(author) : {} }));
  }

  const commentsMatch = /^\/api\/posts\/(\d+)\/comments$/.exec(route);
  if (commentsMatch && req.method === "GET") {
    const post = db.posts.find(function (p) { return p.id === Number(commentsMatch[1]); });
    if (!post) return json(res, 404, { error: "Post not found." });
    return json(res, 200, post.comments);
  }

  if (commentsMatch && req.method === "POST") {
    const user = userByToken(req);
    if (!user) return json(res, 401, { message: "Unauthenticated." });
    const post = db.posts.find(function (p) { return p.id === Number(commentsMatch[1]); });
    if (!post) return json(res, 400, { error: "Post not found." });
    const body = parseJson(raw);
    const comment = {
      id: db.nextIds.comment++,
      post_id: post.id,
      author_name: String(body.full_name || "").trim() || user.full_name || "Путешественник",
      comment: String(body.comment || "").trim(),
      created_at: new Date().toISOString(),
    };
    post.comments.push(comment);
    saveDb();
    return json(res, 200, comment);
  }

  return json(res, 404, { error: "Not found" });
}


