import { useMemo, useState, useEffect } from "react";


const PERSIST_KEY = "pa-quiz-state@v2";

function persistSave(state) {
  try { localStorage.setItem(PERSIST_KEY, JSON.stringify(state)); } catch { }
}

function persistLoad() {
  try {
    const raw = localStorage.getItem(PERSIST_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    return data && typeof data === "object" ? data : null;
  } catch { return null; }
}


// --- Данни (взети и адаптирани от твоя файл) ---
const MASTER_QUESTIONS = [
  {
    text: "На работа ти възлагат проект извън зоната ти на комфорт. Как реагираш?",
    answers: [
      { text: "Приемам без колебание, обичам предизвикателствата.", val: "voin", light: 9, shadow: 3 },
      { text: "Оценявам риска, но искам да спечеля доверието на шефа.", val: "kral", light: 8, shadow: 2 },
      { text: "Измислям нестандартен подход, може би има по-умно решение.", val: "mag", light: 9, shadow: 2 },
      { text: "Питам колегите дали го поемаме заедно, така е по-приятно.", val: "lubov", light: 8, shadow: 1 }
    ]
  },
  {
    text: "Приятел идва с личен проблем. Как реагираш?",
    answers: [
      { text: "Изслушвам го със сърце и му показвам, че не е сам.", val: "lubov", light: 9, shadow: 1 },
      { text: "Давам му структуриран съвет как да процедира.", val: "kral", light: 8, shadow: 2 },
      { text: "Казвам му: „Стани и се справи, нямаш време за сълзи.“", val: "voin", light: 4, shadow: 8 },
      { text: "Предлагам му алтернативен поглед, може би проблемът е възможност.", val: "mag", light: 9, shadow: 2 }
    ]
  },
  {
    text: "Какво те мотивира най-силно?",
    answers: [
      { text: "Да побеждавам и да превъзхождам.", val: "voin", light: 5, shadow: 8 },
      { text: "Да изградя нещо стабилно и значимо.", val: "kral", light: 9, shadow: 2 },
      { text: "Да открия нещо ново и да трансформирам.", val: "mag", light: 9, shadow: 3 },
      { text: "Да обичам и да бъда обичан.", val: "lubov", light: 9, shadow: 1 }
    ]
  },
  {
    text: "Как избираш подарък за близък?",
    answers: [
      { text: "Избирам нещо, което носи спомен и емоция.", val: "lubov", light: 9, shadow: 1 },
      { text: "Подбирам нещо практично и качествено.", val: "kral", light: 8, shadow: 2 },
      { text: "Създавам персонализиран подарък, нещо уникално.", val: "mag", light: 9, shadow: 2 },
      { text: "Купувам нещо впечатляващо, да се усети силата.", val: "voin", light: 5, shadow: 7 }
    ]
  },
  {
    text: "Получаваш критика. Как реагираш?",
    answers: [
      { text: "Приемам я като предизвикателство, ще докажа, че греша.", val: "voin", light: 8, shadow: 6 },
      { text: "Анализирам я и коригирам курса.", val: "kral", light: 9, shadow: 2 },
      { text: "Питам: „Какво не виждам?“, търся скрития смисъл.", val: "mag", light: 9, shadow: 2 },
      { text: "Усещам се наранен, но търся връзката, защо ме критикуват?", val: "lubov", light: 8, shadow: 3 }
    ]
  },
  {
    text: "Как прекарваш идеалния уикенд?",
    answers: [
      { text: "С близки хора, вино, разговори до късно.", val: "lubov", light: 9, shadow: 1 },
      { text: "Планина, предизвикателство, адреналин.", val: "voin", light: 8, shadow: 4 },
      { text: "Организирам нещо полезно, ремонт, план, кауза.", val: "kral", light: 8, shadow: 2 },
      { text: "Чета, пиша, медитирам, търся нови идеи.", val: "mag", light: 9, shadow: 2 }
    ]
  },
  {
    text: "Какво мразиш най-много в хората?",
    answers: [
      { text: "Слабостта и оправданията.", val: "voin", light: 3, shadow: 9 },
      { text: "Безотговорността и липсата на ред.", val: "kral", light: 8, shadow: 3 },
      { text: "Повърхностността и липсата на оригиналност.", val: "mag", light: 8, shadow: 4 },
      { text: "Студенината и липсата на емпатия.", val: "lubov", light: 9, shadow: 1 }
    ]
  },
  {
    text: "Какво те разплаква?",
    answers: [
      { text: "Истинска любов или раздяла.", val: "lubov", light: 9, shadow: 2 },
      { text: "Когато видя провал на нещо, което съм градил с години.", val: "kral", light: 7, shadow: 5 },
      { text: "Когато осъзная, че съм живял в илюзия.", val: "mag", light: 8, shadow: 4 },
      { text: "Не плача. Но ако се случи, е от яд, че не успях.", val: "voin", light: 4, shadow: 8 }
    ]
  },
  {
    text: "Как искаш да те запомнят?",
    answers: [
      { text: "Като човек, който е оставил стабилна следа.", val: "kral", light: 9, shadow: 2 },
      { text: "Като боец, който никога не се е предавал.", val: "voin", light: 8, shadow: 6 },
      { text: "Като човек, който е виждал онова, което другите не виждат.", val: "mag", light: 9, shadow: 2 },
      { text: "Като човек, който е обичал истински.", val: "lubov", light: 9, shadow: 1 }
    ]
  },
  {
    text: "Избираш символ за своя герб. Кой е той?",
    answers: [
      { text: "Корона - символ на ред и отговорност.", val: "kral", light: 9, shadow: 2 },
      { text: "Меч - символ на сила и защита.", val: "voin", light: 7, shadow: 7 },
      { text: "Око в триъгълник - символ на прозрение.", val: "mag", light: 9, shadow: 3 },
      { text: "Сърце с пламък - символ на страст и връзка.", val: "lubov", light: 9, shadow: 1 }
    ]
  },
  {
    text: "Виждаш неправда на улицата. Коя ти е първата реакция?",
    answers: [
      { text: "Скачам веднага, никой няма право да тъпче другия.", val: "voin", light: 8, shadow: 7 },
      { text: "Търся възможност да де-ескалирам ситуацията с думи.", val: "mag", light: 9, shadow: 2 },
      { text: "Успокоявам засегнатия и викам помощ.", val: "lubov", light: 9, shadow: 1 },
      { text: "Докладвам на компетентните органи и следя процедурата.", val: "kral", light: 8, shadow: 2 }
    ]
  },
  {
    text: "Кое е най-голямото ти изкушение?",
    answers: [
      { text: "Да контролирам всичко около себе си.", val: "kral", light: 3, shadow: 9 },
      { text: "Да разбия врага докрай.", val: "voin", light: 2, shadow: 10 },
      { text: "Да манипулирам, за да получа каквото искам.", val: "mag", light: 2, shadow: 10 },
      { text: "Да се раздам напълно на другия.", val: "lubov", light: 2, shadow: 9 }
    ]
  },
  {
    text: "Какво най-трудно прощаваш на себе си?",
    answers: [
      { text: "Че не успях да защитя някого.", val: "voin", light: 7, shadow: 6 },
      { text: "Че не спазих думата си.", val: "kral", light: 7, shadow: 5 },
      { text: "Че се заблудих и живях в илюзия.", val: "mag", light: 7, shadow: 5 },
      { text: "Че нараних някого с думи или действия.", val: "lubov", light: 7, shadow: 5 }
    ]
  },
  {
    text: "Кое качество най-много цениш в партньор?",
    answers: [
      { text: "Лоялност и последователност.", val: "kral", light: 9, shadow: 2 },
      { text: "Страст и искреност.", val: "lubov", light: 9, shadow: 2 },
      { text: "Ум и дълбочина.", val: "mag", light: 9, shadow: 2 },
      { text: "Смелост и решителност.", val: "voin", light: 9, shadow: 3 }
    ]
  },
  {
    text: "Ако утре свърши светът, какво правиш днес?",
    answers: [
      { text: "Събирам всички любими хора на едно място.", val: "lubov", light: 10, shadow: 0 },
      { text: "Организирам последна акция - изкачване, скок с бънджи, битка.", val: "voin", light: 9, shadow: 3 },
      { text: "Записвам всички прозрения, за да останат след мен.", val: "mag", light: 9, shadow: 2 },
      { text: "Навеждам ред - завещания, думи, прошка.", val: "kral", light: 9, shadow: 1 }
    ]
  }
];

const keys = ["kral", "voin", "mag", "lubov"];
const titles = { kral: "Кралят", voin: "Войнът", mag: "Магьосникът", lubov: "Любовникът" };
const colors = { kral: "var(--accent-kral)", voin: "var(--accent-voin)", mag: "var(--accent-mag)", lubov: "var(--accent-lubov)" };
const advices = {
  kral: {
    light: "Развивай способността си да вдъхновяваш и да създаваш ред без контрол.",
    shadow: "Внимавай с прекаления контрол и перфекционизъм, остави място за гъвкавост."
  },
  voin: {
    light: "Използвай куража си, за да защитаваш слабите и да водиш с чест.",
    shadow: "Не превръщай силата в агресия, научи се да почиваш и да усещаш уязвимост."
  },
  mag: {
    light: "Споделяй прозренията си, светът има нужда от твоята оригиналност.",
    shadow: "Не манипулирай и не се изолирай, довери се и на сърцето, не само на ума."
  },
  lubov: {
    light: "Продължавай да създаваш красота и връзка, това е твоята суперсила.",
    shadow: "Не губи себе си в другите, научи се да казваш „не“ и да пазиш граници."
  }
};


// --- Нови речници за персонализация ---
const COMBO_BLURBS = {
  "kral-voin": "Структуриран лидер с импулс за действие, умееш да задаваш посока и да довеждаш до край.",
  "kral-mag": "Стратег с визия, мислиш системно, но виждаш и скритите възможности.",
  "kral-lubov": "Грижовен координатор, правиш ред, който служи на хората и връзките.",
  "voin-kral": "Дисциплиниран изпълнител-лидер, действаш смело, но държиш на честни правила.",
  "voin-mag": "Интуитивен боец, режеш шумa и намираш нестандартни решения под натиск.",
  "voin-lubov": "Защитник на хората, бориш се за тези, които обичаш, и вдъхновяваш с пример.",
  "mag-kral": "Архитект на промяната, превръщаш идеи в устойчиви системи.",
  "mag-voin": "Тактически иноватор, комбинираш идея + действие на терен.",
  "mag-lubov": "Алхимик на връзките, лекуваш, учиш и трансформираш чрез емпатия.",
  "lubov-kral": "Харизматичен обединител, събираш хората и им даваш посока.",
  "lubov-voin": "Страстен двигател, движиш се от кауза и сърце, заразяваш с енергия.",
  "lubov-mag": "Творец на смисъл, вплиташ емоция и прозрение в ценни преживявания.",
};

const AFFIRMATIONS = {
  kral: "Водя с яснота и грижа, редът ми служи на смисъла.",
  voin: "Действам храбро и разумно, силата ми защитава важните неща.",
  mag: "Виждам дълбоко и творя нови пътеки, знанието ми е за споделяне.",
  lubov: "Свързвам и вдъхновявам, любовта ми е сила с граници."
};

const MICRO_HABITS = {
  kral: {
    light: [
      "Напиши 3 приоритета за деня и делегирай 1 задача.",
      "Затвори деня с 5-мин. рефлексия: кое да стандартизирам утре?",
      "Провери 1 граница: „Къде давам контрол, а къде задържам излишно?“",
    ],
    shadow: [
      "Планирай 1 „гъвкав“ блок (без график) за непредвидени неща.",
      "Попитай човек от екипа какво да спрете да правите.",
      "Отмени 1 перфекционистка дреболия, която не носи стойност.",
    ],
  },
  voin: {
    light: [
      "Минимум 20 мин фокус работа без разсейване.",
      "Провери тялото: вода, 10 клека, раздвижване.",
      "Избери 1 битка за днес и остави останалите за утре.",
    ],
    shadow: [
      "Глътка пауза преди реакция: 3 дълбоки вдишвания.",
      "Замени „натискам“ с „питам“ поне веднъж днес.",
      "Планирай възстановяване (сън/разходка) преди следващия спринт.",
    ],
  },
  mag: {
    light: [
      "Запиши 1 инсайт → превърни го в малък експеримент.",
      "Сподели идея с човек, който не мисли като теб.",
      "Изчисти 1 абстракция до конкретна следваща стъпка.",
    ],
    shadow: [
      "Спри „прекаления анализ“ чрез 15-мин. таймер за решение.",
      "Провери реалността: какво е факт и какво, хипотеза?",
      "Свържи се с тялото: 5 мин наблюдение на дишането.",
    ],
  },
  lubov: {
    light: [
      "Изпрати 1 искрено благодарствено съобщение.",
      "Планирай 30 мин „качествена връзка“ с близък човек.",
      "Мини през деня с въпроса: „Къде добавям красота?“",
    ],
    shadow: [
      "Откажи учтиво 1 нещо (граница).",
      "Напиши 1 „да“ за себе си преди да кажеш „да“ на друг.",
      "5 мин самообслужване: хидратация, разходка, тишина.",
    ],
  },
};



// --- помагала ---
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function ArchetypeQuiz() {
  // ❗ Вместо useMemo – еднократен state + опит за възстановяване от localStorage
  const initialQuestions = (() => {
    const saved = persistLoad();
    if (saved?.questions?.length === MASTER_QUESTIONS.length) {
      return saved.questions; // пазим същия ред и същия шъфъл на отговорите
    }
    return shuffle(MASTER_QUESTIONS).map(q => ({
      ...q,
      answers: shuffle(q.answers)
    }));
  })();

  const [questions, setQuestions] = useState(initialQuestions);


  const savedOnce = persistLoad();

  const [current, setCurrent] = useState(() => {
    const idx = savedOnce?.current ?? 0;
    return Math.min(Math.max(0, idx), initialQuestions.length - 1);
  });

  const [answers, setAnswers] = useState(() => {
    if (savedOnce?.answers?.length === initialQuestions.length) return savedOnce.answers;
    return Array(initialQuestions.length).fill(null);
  });

  const [showResult, setShowResult] = useState(() => !!savedOnce?.showResult);


  const answeredCount = answers.filter(Boolean).length;
  const progressPct = ((current + 1) / questions.length) * 100;

  function onSelect(idx, ansObj) {
    const next = answers.slice();
    next[idx] = ansObj;
    setAnswers(next);
  }

  function goNext() {
    if (!answers[current]) {
      alert("Моля, избери отговор.");
      return;
    }
    if (current === questions.length - 1) {
      setShowResult(true);
    } else {
      setCurrent(c => c + 1);
    }
  }

  function goPrev() {
    setCurrent(c => Math.max(0, c - 1));
  }

  function resetAll({ reshuffle = false } = {}) {
    const nextQuestions = reshuffle
      ? shuffle(MASTER_QUESTIONS).map(q => ({ ...q, answers: shuffle(q.answers) }))
      : questions; // пазим същия ред, ако не искаме нов шъфъл

    setQuestions(nextQuestions);
    setAnswers(Array(nextQuestions.length).fill(null));
    setCurrent(0);
    setShowResult(false);

    if (reshuffle) localStorage.removeItem(PERSIST_KEY); // твърдо изчистване
  }


  useEffect(() => {
    if (!questions.length) return;
    persistSave({
      version: 2,
      questions,   // замразен шъфъл
      current,     // индекс на текущия въпрос
      answers,     // избраните отговори
      showResult,  // ако сме на екрана с резултата
      ts: Date.now()
    });
  }, [questions, current, answers, showResult]);




  // Изчисления накрая - коректни и при връщане назад
  // Брой реално отговорени
  const answered = answers.filter(Boolean).length;

  const stats = useMemo(() => {
    const lightRaw = { kral: 0, voin: 0, mag: 0, lubov: 0 };
    const shadowRaw = { kral: 0, voin: 0, mag: 0, lubov: 0 };
    answers.forEach(a => {
      if (!a) return;
      lightRaw[a.val] += a.light;
      shadowRaw[a.val] += a.shadow;
    });

    // По твоя UI пазим 0-10 скали спрямо броя отговори
    const denom = answered || 1;
    const per10 = {};
    keys.forEach(k => {
      per10[k] = {
        light: Math.round(lightRaw[k] / denom),
        shadow: Math.round(shadowRaw[k] / denom),
      };
    });

    // Сурови точки + проценти + confidence
    const rawScore = {};
    let totalRaw = 0;
    keys.forEach(k => {
      rawScore[k] = lightRaw[k] + shadowRaw[k];
      totalRaw += rawScore[k];
    });

    const pct = {};
    keys.forEach(k => {
      pct[k] = totalRaw ? Math.round((rawScore[k] / totalRaw) * 100) : 0;
    });

    // Класиране по суров резултат (по-стабилно при равен брой въпроси)
    const ranking = keys
      .map(k => ({ k, score: rawScore[k] }))
      .sort((a, b) => b.score - a.score);

    const primary = ranking[0]?.k ?? "kral";
    const secondary = ranking[1]?.k ?? "voin";

    const margin = totalRaw ? (ranking[0].score - ranking[1].score) / totalRaw : 0;
    const confidence = Math.round(50 + 50 * Math.max(0, margin)); // 50-100

    // Тон на водещия: светлина/баланс/сянка
    const delta = (per10[primary].light || 0) - (per10[primary].shadow || 0);
    const tone = delta >= 3 ? "light" : delta <= -3 ? "shadow" : "balanced";

    return {
      per10, raw: { lightRaw, shadowRaw, rawScore, totalRaw },
      pct, ranking, primary, secondary, confidence, tone
    };
  }, [answers, answered]);


  function comboBlurb(primary, secondary) {
    const key = `${primary}-${secondary}`;
    return COMBO_BLURBS[key] || "Интегрирана комбинация — баланс между качества и стилове.";
  }

  function toneLabel(tone) {
    return tone === "light" ? "Водиш от светлината"
      : tone === "shadow" ? "Има натиск от сянката"
        : "Балансиран режим";
  }

  function buildSummaryText(s) {
    const t = titles[s.primary], t2 = titles[s.secondary];
    return [
      `Водещ архетип: ${t} (${s.confidence}% увереност)`,
      `Втори архетип: ${t2}`,
      `Тон: ${toneLabel(s.tone)}`,
      `Проценти: Крал ${s.pct.kral}% · Войн ${s.pct.voin}% · Магьосник ${s.pct.mag}% · Любовник ${s.pct.lubov}%`,
      `Светлина/Сянка на ${t}: ${s.per10[s.primary].light}/10 · ${s.per10[s.primary].shadow}/10`,
      `Комбо: ${comboBlurb(s.primary, s.secondary)}`,
    ].join("\n");
  }

  function copySummary() {
    const text = buildSummaryText(stats);
    navigator.clipboard?.writeText(text).then(() => {
      alert("Обобщението е копирано ✅");
    });
  }


  return (
    <div className="pa-wrap">
      <h1 className="pa-title">Архетипи: Светлина и сянка</h1>


      {/* Прогрес */}
      <div className="pa-progress" aria-label="Прогрес">
        <div className="pa-progress-bar" style={{ width: `${progressPct}%` }} />
      </div>

      {!showResult && (
        <div className="pa-progress-meta" aria-live="polite" aria-atomic="true">
          Отговорени въпроси: {answeredCount} / {questions.length}
        </div>
      )}


      {/* Въпроси */}
      {!showResult && (
        <form className="pa-form" onSubmit={e => e.preventDefault()}>
          {questions.map((q, idx) => (
            <div className={`pa-card ${idx === current ? "active" : ""}`} key={idx}>
              <h3>{idx + 1}. {q.text}</h3>
              <div className="pa-answers">
                {q.answers.map((a, i) => {
                  const name = `q${idx}`;
                  const selected = answers[idx]?.val === a.val && answers[idx]?.text === a.text;
                  return (
                    <label
                      className={`pa-option ${selected ? "is-selected" : ""}`}
                      data-arch={a.val}
                      key={i}
                    >
                      <input
                        type="radio"
                        name={name}
                        checked={selected}
                        onChange={() => onSelect(idx, a)}
                      />
                      <span className="pa-bullet" aria-hidden="true"></span>
                      <span className="pa-text">{a.text}</span>
                      <span className="pa-check" aria-hidden="true">✓</span>
                    </label>
                  );
                })}
              </div>

              <div className="pa-nav">
                {idx > 0 ? (
                  <button type="button" className="pa-btn pa-prev" onClick={goPrev}>← Назад</button>
                ) : <span />}

                <button type="button" className="pa-btn pa-next" onClick={goNext}>
                  {idx === questions.length - 1 ? "Виж резултата" : "Напред →"}
                </button>
              </div>
            </div>
          ))}
        </form>
      )}

      {/* Резултат */}
      {showResult && (
        <div className="pa-result" style={{ display: "block" }}>
          <h2 style={{ color: colors[stats.primary] }}>
            Твоят водещ архетип е<br /><strong>{titles[stats.primary]}</strong>
          </h2>

          <p style={{ marginTop: 6, opacity: .9 }}>
            Втори архетип: <strong style={{ color: colors[stats.secondary] }}>{titles[stats.secondary]}</strong> ·
            Увереност: <strong>{stats.confidence}%</strong> ·
            Режим: <strong>{toneLabel(stats.tone)}</strong>
          </p>

          <p style={{ marginTop: 10 }}>
            {comboBlurb(stats.primary, stats.secondary)}
          </p>

          {/* Барове за водещия архетип (както при теб) */}
          <div style={{ margin: "20px auto", textAlign: "left", maxWidth: 520 }}>
            <div><strong>Светлина:</strong> {stats.per10[stats.primary].light}/10</div>
            <div className="pa-bar-bg">
              <div className="pa-bar" style={{ width: `${(stats.per10[stats.primary].light) * 10}%`, background: colors[stats.primary] }} />
            </div>
            <div><strong>Сянка:</strong> {stats.per10[stats.primary].shadow}/10</div>
            <div className="pa-bar-bg">
              <div className="pa-bar" style={{ width: `${(stats.per10[stats.primary].shadow) * 10}%`, background: "#777777" }} />
            </div>

            <p style={{ marginTop: 12 }}><strong>Какво да развиваш:</strong> {advices[stats.primary].light}</p>
            <p><strong>Къде да внимаваш:</strong> {advices[stats.primary].shadow}</p>
          </div>

          {/* Проценти за четирите архетипа */}
          <div style={{ margin: "16px auto 8px", maxWidth: 520 }}>
            <small style={{ color: "var(--subtle)" }}>
              Дялове: Крал {stats.pct.kral}% · Войн {stats.pct.voin}% · Магьосник {stats.pct.mag}% · Любовник {stats.pct.lubov}%
            </small>
          </div>

          {/* Микро-навици според тон (light/balanced => light; shadow => shadow) */}
          <div className="pa-card" style={{ display: "block", marginTop: 18 }}>
            <h3 style={{ marginTop: 0 }}>3 микро-навици за днес</h3>
            <ul style={{
              textAlign: "left",
              listStyle: "disc",
              paddingLeft: "1.25rem",
              margin: "0.5rem 0 0"
            }}>
              {(stats.tone === "shadow" ? MICRO_HABITS[stats.primary].shadow : MICRO_HABITS[stats.primary].light).map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
            <p style={{ marginTop: 10, opacity: .9 }}>
              Утвърждение: <em>„{AFFIRMATIONS[stats.primary]}“</em>
            </p>
          </div>

          {/* Втори архетип — кратко огледало */}
          <h3 style={{ color: colors[stats.secondary], marginTop: 28 }}>
            Втори архетип: {titles[stats.secondary]}
          </h3>
          <div style={{ margin: "10px auto", textAlign: "left", maxWidth: 520 }}>
            <div><strong>Светлина:</strong> {stats.per10[stats.secondary].light}/10</div>
            <div className="pa-bar-bg">
              <div className="pa-bar" style={{ width: `${(stats.per10[stats.secondary].light) * 10}%`, background: colors[stats.secondary] }} />
            </div>
            <div><strong>Сянка:</strong> {stats.per10[stats.secondary].shadow}/10</div>
            <div className="pa-bar-bg">
              <div className="pa-bar" style={{ width: `${(stats.per10[stats.secondary].shadow) * 10}%`, background: "#777777" }} />
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 16, flexWrap: "wrap" }}>
            <button className="pa-btn pa-prev" onClick={copySummary}>📋 Копирай обобщението</button>
            <button className="pa-btn pa-reset" onClick={resetAll}>🔄 Направи теста отново</button>
          </div>
        </div>
      )}

    </div>
  );
}