// Определение сообщений для локализации
const messages = {
    en: {
      title: 'One-dimensional cutting problem',
      h2:'Initial data of the workpiece',
      h22:'Details',
      h23:'Cutting results',
      input1:'Length of workpiece (mm):',
      input2:'Number of blanks:',
      input3:'Cutting tool thickness (gap between parts) (mm):',
      input4:'Detail ',
      input4_1:': Length (mm)',
      input5:'Quantity',
      input6:'Comment',
      button1:'Delete',
      button2:'Add detail',
      button3:'Calculate cutting',
      button4:'Save to CSV',
      text1: 'Total length of blanks:',
      mm:" mm",
      text2:'Total length of parts:',
      text3:'Number of repetitions:',
      text5:'Remainder:',
      text6:'Percentage of unused balances:',
      text7:'Total parts:',
      unit:' things',
      text8:'Located: ',
      text9:'Not located: ',
      languageLabel: 'UK'
    },
    uk: {
      title: 'Одновимірне завдання розкрою',
      h2:'Вихідні дані заготівлі',
      h22:'Деталі',
      h23:'Результати розкрою',
      input1:'Довжина заготівлі (мм):',
      input2:'Кількість заготовок:',
      input3:'Товщина різального інструменту (зазор між деталями) (мм):',
      input4:'Деталь ',
      input4_1:': Довжина (мм)',
      input5:'Кількість',
      input6:'Коментар',
      button1:'Видалити деталь',
      button2:'Додати деталь',
      button3:'Розрахувати розкрий',
      button4:'Зберегти у CSV',
      text1: 'Сумарна довжина заготовок: ',
      mm:" мм",
      text2:'Сумарна довжина деталей: ',
      text3:'Число повторів: ',
      text5:'Залишок: ',
      text6:'Відсоток невикористаних залишків:',
      text7:'Всього деталей: ',
      unit:' штук',
      text8:'Розташовано: ',
      text9:'Не розташовано: ',
      languageLabel: 'EN'
    },
    ru: {
      title: 'Одномерная задача раскроя',
      h2:'Исходные данные заготовки',
      h22:'Детали',
      h23:'Результаты раскроя',
      input1:'Длина заготовки (мм):',
      input2:'Количество заготовок:',
      input3:'Толщина режущего инструмента (зазор между деталями) (мм):',
      input4:'Деталь ',
      input4_1:': Длина (мм)',
      input5:'Количество',
      input6:'Комментарий',
      button1:'Удалить деталь',
      button2:'Добавить деталь',
      button3:'Рассчитать раскрой',
      button4:'Сохранить в CSV',
      text1: 'Суммарная длина заготовок:',
      mm:" мм",
      text2:'Суммарная длина деталей:',
      text3:'Число повторов: ',
      text5:'Остаток: ',
      text6:'Процент неиспользованных остатков:',
      text7:'Всего деталей: ',
      unit:' штук',
      text8:'Расположено: ',
      text9:'Не расположено: ',
      languageLabel: 'UK'
    },
  };
  
  // Инициализация Vue i18n для локализации
  const i18n = VueI18n.createI18n({
    locale: 'en', // Стартовый язык
    messages,
  });
  const { ref, computed } = Vue;
  
  
  
  // Создаем Vue приложение
  const app = Vue.createApp({
    components: {
      'language-switcher': LanguageSwitcher,
      'content-section': ContentSection
    }
  });
  
  // Монтируем приложение с поддержкой локализации
  app.use(i18n);
  app.mount('#app');
  