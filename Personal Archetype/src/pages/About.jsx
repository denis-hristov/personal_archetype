import { NavLink } from "react-router-dom";

export default function About() {
  return (
    <section className="pa-about">
      <h1 className="pa-title">Personal Archetype</h1>
      <div className="pa-card" style={{ display: "block" }}>
        <div className="pa-prose">
          <p>
            Кратък тест, който ти показва кой архетип те води днес и къде са силните ти
            страни (<em>светлина</em>) и рисковете (<em>сянка</em>). Работим с 4 архетипа:
            <strong> Кралят</strong>, <strong>Войнът</strong>, <strong>Магьосникът</strong>,
            <strong> Любовникът</strong>.
          </p>

          <h3>Как помага?</h3>
          <ul>
            <li><strong>Самоосъзнаване:</strong> виждаш какво ти е естествено силно и къде да внимаваш.</li>
            <li><strong>Практични насоки:</strong> получаваш идеи „какво да развиваш“ и „къде да внимаваш“ според резултата.</li>
            <li><strong>По-добра комуникация:</strong> разпознаваш стила си в екип и адаптираш подхода си.</li>
            <li><strong>Фокус върху навици:</strong> свързваш архетипа си с ежедневни действия и цели.</li>
          </ul>

          <h3>Как работи?</h3>
          <ul>
            <li>Отговаряш на поредица от реални ситуации и предпочитания.</li>
            <li>В края виждаш водещ и втори архетип, плюс барове за „светлина“ и „сянка“ и кратки съвети.</li>
          </ul>

          <p style={{ color: "var(--subtle)" }}>
            Забележка: това е саморазвиващ инструмент, а не клинична оценка.
          </p>

          <div style={{ marginTop: 16 }}>
            <NavLink to="/" className="pa-btn pa-next">Започни теста</NavLink>
          </div>
        </div>
      </div>
    </section>
  );
}