const ContentSection = {
    template: `
    <h1>{{ $t('title') }}</h1>

    <div class="form-group">
      <h2>{{ $t('h2') }}</h2>
      <label for="stockLength">{{ $t('input1') }}</label>
      <input type="number" v-model="stockLength" id="stockLength" min="1" />
      <label for="stockQuantity">{{ $t('input2') }}</label>
      <input
        type="number"
        v-model="stockQuantity"
        id="stockQuantity"
        min="1"
      />
      <div class="form-group">
        <label for="gap">{{ $t('input3') }}</label>
        <input type="number" v-model="gap" id="gap" min="0" step="0.1" />
      </div>
      <p>{{ $t('text1')+ stockLength*stockQuantity + $t('mm')}}</p>
      <p>{{ $t('text2')+ totalLength + $t('mm')}}</p>
    </div>

    <div class="form-group">
      <h2>{{ $t('h22') }}</h2>
      <div v-for="(detail, index) in details" :key="index">
        <label>{{ $t('input4') +index + 1 +$t('input4_1')}}</label>
        <input type="number" v-model="detail.length" min="1" />
        <label>{{ $t('input5') }}</label>
        <input type="number" v-model="detail.quantity" min="1" />
        <label>{{ $t('input6') }}</label>
        <input
          type="text"
          v-model="detail.comment"
          placeholder="comment"
        />
        <button @click="removeDetail(index)">{{ $t('button1') }}</button>
      </div>
      <button @click="addDetail">{{ $t('button2') }}</button>
    </div>

    <button @click="calculateCutting">{{ $t('button3') }}</button>
    <button @click="saveToCSV">{{ $t('button4') }}</button>
    <input style="width: 10cm;" type="file" @change="loadFromCSV" accept=".csv" />

    <div v-if="cuttingPlan.length > 0" class="cutting-visual">
      <h2>{{ $t('h23') }}</h2>
      <div
        v-for="(stock, stockIndex) in uniqueCuttingPlans"
        :key="stockIndex"
        class="bar"
      >
        <div>{{ $t('text3') + stock.repeats }}</div>
        <div
          v-for="(segment, index) in stock.segments"
          :key="index"
          class="segment"
          :style="{ width: segment.width + '%', left: segment.left + '%' }"
        >
          №{{ segment.position }} L={{ segment.length }} мм <br />
          {{segment.comment}}
        </div>
        <div
          v-if="stock.remainder > 0"
          class="remainder"
          :style="{ width: stock.remainderWidth + '%', left: stock.remainderLeft + '%' }"
        >
        {{ $t('text5') + stock.remainder + $t('mm') }}
        </div>
      </div>

      <div class="result">
      {{ $t('text6') }} {{ unusedPercentage.toFixed(2) }}%
      </div>

      <div class="result">
        {{ $t('text7') + totalDetails + $t('unit') }}<br />
        {{ $t('text8') + placedDetails + $t('unit') }}<br />
        {{ $t('text9') + (totalDetails - placedDetails) + $t('unit')  }}
      </div>
    </div>
    `,
    setup() {
        const gap = ref(5);// Общее значение зазора для всех деталей
        const stockLength = ref(6000); // Длина заготовки (в мм)
        const stockQuantity = ref(1); // Количество заготовок
        const details = ref([]); // Список деталей
        const cuttingPlan = ref([]); // Результат раскроя

        // Добавить деталь
        const addDetail = () => {
          details.value.push({
            length: 500,
            quantity: 1,
            comment: "",
          });
        };

        // Удалить деталь
        const removeDetail = (index) => {
          details.value.splice(index, 1);
        };

        // Рассчитать раскрой
        const calculateCutting = () => {
          // Сортировка деталей по длине по убыванию перед расчетом
          details.value.sort((a, b) => b.length - a.length);

          let currentStockIndex = 0;

          // Очистка плана раскроя
          cuttingPlan.value = [];
          for (let i = 0; i < stockQuantity.value; i++) {
            cuttingPlan.value.push({
              segments: [],
              remainder: stockLength.value,
              remainderWidth: 100,
              remainderLeft: 0,
            });
          }

          let totalPlaced = 0; // Количество расположенных деталей

          // Создание копии массива деталей для изменения количества в процессе
          let remainingDetails = details.value.map((detail) => ({
            ...detail,
            remainingQuantity: detail.quantity,
          }));

          while (
            currentStockIndex < stockQuantity.value &&
            remainingDetails.some((detail) => detail.remainingQuantity > 0)
          ) {
            const stock = cuttingPlan.value[currentStockIndex];

            // Поиск первой детали, которая поместится на текущую заготовку
            const fittingDetailIndex = remainingDetails.findIndex(
              (detail) =>
                detail.remainingQuantity > 0 &&
                detail.length + gap.value <= stock.remainder
            );

            if (fittingDetailIndex !== -1) {
              // Если нашли деталь, которая помещается
              const detail = remainingDetails[fittingDetailIndex];
              const left = 100 - (stock.remainder / stockLength.value) * 100;
              const width = ((detail.length + gap.value) / stockLength.value) * 100; // Учет зазораs

              stock.segments.push({
                length: detail.length,
                width: width,
                left: left,
                position: fittingDetailIndex + 1, // Номер позиции
                comment: detail.comment,
              });

              stock.remainder -= (detail.length + gap.value); // Уменьшаем остаток с учетом зазора
              stock.remainderWidth =
                (stock.remainder / stockLength.value) * 100;
              stock.remainderLeft = 100 - stock.remainderWidth ;

              // Уменьшаем количество оставшихся деталей
              detail.remainingQuantity--;
              totalPlaced++;
            } else {
              // Если не нашли подходящей детали, переходим к следующей заготовке
              currentStockIndex++;
            }
          }

          // Обновляем количество размещенных деталей
          placedDetails.value = totalPlaced;
        };

        // Общее количество деталей
        const totalDetails = computed(() => {
          return details.value.reduce(
            (sum, detail) => sum + detail.quantity,
            0
          );
        });

        // Общее суммарная длинна деталей
        const totalLength = computed(() => {
          return details.value.reduce(
            (sum, detail) => sum + detail.quantity * detail.length,
            0
          );
        });

        // Подсчет количества деталей
        const countedDetails = computed(() => {
          const counts = {};
          details.value.forEach((detail) => {
            if (!counts[detail.length]) {
              counts[detail.length] = { totalQuantity: 0 };
            }
            counts[detail.length].totalQuantity += detail.quantity;
          });
          return Object.entries(counts).map(([length, data]) => ({
            length: length,
            totalQuantity: data.totalQuantity,
          }));
        });

        // Процент неиспользованных остатков
        const unusedPercentage = computed(() => {
          const totalLength = stockLength.value * stockQuantity.value;
          const usedLength = cuttingPlan.value.reduce((total, stock) => {
            return (
              total +
              stock.segments.reduce(
                (segTotal, segment) => segTotal + segment.length,
                0
              )
            );
          }, 0);
          return ((totalLength - usedLength) / totalLength) * 100;
        });

        // Количество размещенных деталей
        const placedDetails = ref(0);

        // Логика для нахождения уникальных планов раскроя
        const uniqueCuttingPlans = computed(() => {
          const uniquePlans = [];
          cuttingPlan.value.forEach((stock) => {
            const existingPlan = uniquePlans.find(
              (plan) =>
                JSON.stringify(plan.segments) ===
                JSON.stringify(stock.segments)
            );
            if (existingPlan) {
              existingPlan.repeats++;
            } else {
              uniquePlans.push({ ...stock, repeats: 1 });
            }
          });
          return uniquePlans;
        });

        // Сохранить в CSV (обновлено)
        const saveToCSV = () => {
          const csvContent =
            "data:text/csv;charset=utf-8," +
            "Length,Quantity,Comment\n" +
            details.value
              .map(
                (detail) =>
                  `${detail.length},${detail.quantity},"${detail.comment}"`
              )
              .join("\n");
          const encodedUri = encodeURI(csvContent);
          const link = document.createElement("a");
          link.setAttribute("href", encodedUri);
          link.setAttribute("download", "detali.csv");
          document.body.appendChild(link);
          link.click();
        };

        // Загрузить из CSV (обновлено)
        const loadFromCSV = (event) => {
          const file = event.target.files[0];
          const reader = new FileReader();
          reader.onload = (e) => {
            const text = e.target.result;
            const rows = text.split("\n").slice(1); // Пропустить заголовок
            rows.forEach((row) => {
              const [length, quantity, comment] = row.split(",");
              if (length && quantity) {
                details.value.push({
                  length: parseInt(length),
                  quantity: parseInt(quantity),
                  comment: comment.replace(/"/g, ""), // Удаление кавычек
                });
              }
            });
          };
          reader.readAsText(file);
        };

        return {
          stockLength,
          stockQuantity,
          details,
          cuttingPlan,
          addDetail,
          removeDetail,
          calculateCutting,
          countedDetails,
          unusedPercentage,
          saveToCSV,
          loadFromCSV,
          placedDetails,
          totalDetails,
          totalLength,
          uniqueCuttingPlans,
          gap,
        };
      },
  };