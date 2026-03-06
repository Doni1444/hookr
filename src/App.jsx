import { useMemo, useState } from "react";
import "./App.css";

const CONTENT_BY_NICHE = {
  фитнес: {
    trend: "Сейчас в тренде короткие ролики формата ‘до/после’, утренние рутины и честные дневники прогресса без фильтров.",
    reels: [
      "3 упражнения для спины без оборудования (30 сек)",
      "Что я ем за день для сушки: быстрый разбор",
      "Тренировка дома на всё тело за 12 минут"
    ],
    titles: [
      "Минус 3 кг без жёстких диет: мой план",
      "5 ошибок в тренировках, которые тормозят результат",
      "Как начать тренироваться, если нет мотивации"
    ]
  },
  бизнес: {
    trend: "Вирально заходят кейсы ‘как я сделал X за 7 дней’, разборы AI-инструментов и честные фейлы предпринимателей.",
    reels: [
      "1 AI-инструмент, который экономит мне 3 часа в день",
      "Разбор оффера за 60 секунд: что исправить",
      "3 шага, как поднять средний чек уже сегодня"
    ],
    titles: [
      "Как я получил первых клиентов без рекламы",
      "Почему ваш контент не продаёт (и как это исправить)",
      "Простой шаблон продающего Reels для экспертов"
    ]
  },
  крипта: {
    trend: "Популярны объяснения сложных тем простыми словами: альтсезон, риск-менеджмент и новости рынка в формате ‘что это значит для тебя’.",
    reels: [
      "Крипто-новость дня за 20 секунд и её влияние",
      "Как новичку собрать безопасный портфель",
      "3 сигнала, что входить в сделку рано"
    ],
    titles: [
      "Крипта для новичков: с чего начать в 2026",
      "5 ошибок, из-за которых сливают депозит",
      "Как анализировать монету за 2 минуты"
    ]
  }
};

const DEFAULT_CONTENT = {
  trend: "Сейчас в тренде экспертный контент с личной историей, быстрыми практическими советами и чётким CTA в конце видео.",
  reels: [
    "Топ-3 инсайта в вашей нише за минуту",
    "Разбор частой ошибки аудитории и решение",
    "Мини-кейс: результат клиента/проекта до и после"
  ],
  titles: [
    "Что прямо сейчас работает в вашей нише",
    "План контента на неделю за 15 минут",
    "Как делать Reels, которые досматривают до конца"
  ]
};

export default function App() {
  const [nicheInput, setNicheInput] = useState("");
  const [result, setResult] = useState(null);

  const normalizedNiche = useMemo(() => nicheInput.trim().toLowerCase(), [nicheInput]);

  const handleFindIdeas = () => {
    const data = CONTENT_BY_NICHE[normalizedNiche] || DEFAULT_CONTENT;

    setResult({
      niche: nicheInput.trim() || "вашей ниши",
      ...data
    });
  };

  return (
    <main className="page">
      <section className="card">
        <h1>AI ассистент для блогеров</h1>
        <p className="subtitle">Введите нишу и получите идеи контента за секунды.</p>

        <div className="inputRow">
          <input
            type="text"
            placeholder="Например: фитнес, бизнес, крипта"
            value={nicheInput}
            onChange={(event) => setNicheInput(event.target.value)}
          />
          <button type="button" onClick={handleFindIdeas}>
            Найти идеи
          </button>
        </div>

        {result && (
          <div className="results">
            <article>
              <h2>Что сейчас в тренде</h2>
              <p>
                <strong>{result.niche}:</strong> {result.trend}
              </p>
            </article>

            <article>
              <h2>Идеи для Reels</h2>
              <ul>
                {result.reels.map((idea) => (
                  <li key={idea}>{idea}</li>
                ))}
              </ul>
            </article>

            <article>
              <h2>Идеи для заголовков</h2>
              <ul>
                {result.titles.map((title) => (
                  <li key={title}>{title}</li>
                ))}
              </ul>
            </article>
          </div>
        )}
      </section>
    </main>
  );
}
