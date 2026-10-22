export function createTranslator(dictionaries, initialLanguage = 'en') {
  let language = initialLanguage;
  const messages = Object.fromEntries(
    [...new Set(Object.values(dictionaries).flatMap((dictionary) => Object.keys(dictionary)))].map(
      (key) => [
        key,
        Object.fromEntries(
          Object.entries(dictionaries).map(([locale, dictionary]) => [locale, dictionary[key]]),
        ),
      ],
    ),
  );
  function translate(text) {
    if (language === 'en') return text;
    const clean = text.trim(),
      direct = messages[clean.replace(/\s+/g, ' ')]?.[language];
    if (direct) return text.replace(clean, direct);
    const patterns = [
      [
        /^(\d+) mentors shown$/,
        (_, count) =>
          language === 'ru'
            ? `Показано наставников: ${count}`
            : `Көрсетілген тәлімгерлер: ${count}`,
      ],
      [
        /^Version (\d+) · (.+)$/,
        (_, count, status) =>
          `${language === 'ru' ? 'Версия' : 'Нұсқа'} ${count} · ${translate(status)}`,
      ],
      [
        /^Version history \((\d+)\)$/,
        (_, count) => `${language === 'ru' ? 'История версий' : 'Нұсқалар тарихы'} (${count})`,
      ],
      [
        /^(\d+) of (\d+)$/,
        (_, first, second) =>
          language === 'ru' ? `${first} из ${second}` : `${second} құжаттың ${first}-і`,
      ],
      [
        /^Linked to (.+)$/,
        (_, name) => `${language === 'ru' ? 'Связан с' : 'Байланыстырылған'}: ${name}`,
      ],
      [/^(Request|Plan): (.+)$/, (_, kind, status) => `${translate(kind)}: ${translate(status)}`],
      [
        /^School feedback: (.*)$/,
        (_, value) =>
          `${language === 'ru' ? 'Комментарий Школы' : 'Мектеп түсініктемесі'}: ${value}`,
      ],
      [/^Preferred mentor: (.*)$/, (_, value) => `${translate('Preferred mentor')}: ${value}`],
      [/^Development focus: (.*)$/, (_, value) => `${translate('Development focus')}: ${value}`],
      [
        /^(Matching course found|Below matching threshold) · (.+)$/,
        (_, label, value) =>
          `${language === 'ru' ? (label === 'Matching course found' ? 'Найден подходящий курс' : 'Ниже порога соответствия') : label === 'Matching course found' ? 'Сәйкес курс табылды' : 'Сәйкестік шегінен төмен'} · ${value}`,
      ],
      [
        /^Model score: (.+) · Threshold: (.+)$/,
        (_, score, threshold) =>
          `${language === 'ru' ? 'Оценка модели' : 'Модель бағасы'}: ${score} · ${language === 'ru' ? 'Порог' : 'Шек'}: ${threshold}`,
      ],
      [
        /^This course is illustratively assigned to (.+)\. The score is not a validated measure of mentor suitability\.$/,
        (_, name) =>
          language === 'ru'
            ? `Курс условно связан с ${name}. Оценка не является подтверждённой мерой пригодности наставника.`
            : `Курс ${name} профиліне шартты түрде байланыстырылған. Баға тәлімгер жарамдылығының расталған өлшемі емес.`,
      ],
      [
        /^(.+) \(preferred\)$/,
        (_, name) => `${name} (${language === 'ru' ? 'предпочтение' : 'қалаған тәлімгер'})`,
      ],
      [/^\(illustrative\)$/, () => (language === 'ru' ? '(демонстрация)' : '(демонстрация)')],
      [
        /^(.+) — (School of Computing|School of Engineering)$/,
        (_, name, school) => `${name} — ${translate(school)}`,
      ],
      [
        /^(.+) · (School of Computing|School of Engineering)$/,
        (_, name, school) => `${name} · ${translate(school)}`,
      ],
      [
        /^Version (\d+) · (.+) · (\d+) activities$/,
        (_, countValue, status, count) =>
          `${language === 'ru' ? 'Версия' : 'Нұсқа'} ${countValue} · ${translate(status)} · ${count} ${language === 'ru' ? 'задач' : 'тапсырма'}`,
      ],
    ];
    for (const [regex, replace] of patterns)
      if (regex.test(clean)) return text.replace(clean, clean.replace(regex, replace));
    return text;
  }
  return {
    translate: translate,
    getLanguage: () => language,
    setLanguage(next) {
      if (['en', 'ru', 'kk'].includes(next)) language = next;
    },
  };
}
