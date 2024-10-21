const LanguageSwitcher = {
    template: `
      <div>
        <span class="label-text">{{ $t('languageLabel') }}</span>
        <label class="toggle-switch">
          <input type="checkbox" @change="switchLanguage" :checked="isChecked">
          <span class="slider"></span>
        </label>
      </div>
    `,
    computed: {
      isChecked() {
        return this.$i18n.locale === 'uk';
      }
    },
    methods: {
      switchLanguage() {
        this.$i18n.locale = this.$i18n.locale === 'en' ? 'uk' : 'en';
        this.$emit('lang-switched');
      }
    }
  };