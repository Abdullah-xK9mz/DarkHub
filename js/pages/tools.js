
  /* ===== تحويل الأرقام إلى إنجليزية إجبارياً ===== */
  function toEnNums(str) {
    if (str === null || str === undefined) return '';
    return String(str).replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));
  }

  /* ===== Search & Filter Logic ===== */
  let currentCategory = 'all';

  function filterCategory(cat, btn) {
    currentCategory = cat;
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    applyFilters();
  }

  function filterTools() {
    applyFilters();
  }

  function applyFilters() {
    const query = document.getElementById('toolSearchInput').value.trim().toLowerCase();
    const cards = document.querySelectorAll('.tools-grid > .tool-card');

    cards.forEach(card => {
      const category = card.dataset.category;
      const keywords = (card.dataset.keywords || '').toLowerCase();
      const title = card.querySelector('h3').textContent.toLowerCase();
      const desc = card.querySelector('p').textContent.toLowerCase();

      const matchesCat = (currentCategory === 'all' || category === currentCategory);
      const matchesSearch = (!query || title.includes(query) || desc.includes(query) || keywords.includes(query));

      if (matchesCat && matchesSearch) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }

  /* ===== Navigation ===== */
  const toolsNav = document.getElementById('toolsNav');
  const mainHeader = document.getElementById('mainHeader');
  const searchContainer = document.getElementById('searchContainer');
  const categoriesContainer = document.getElementById('categoriesContainer');
  const workbench = document.getElementById('workbench');

  document.querySelectorAll('.tool-card').forEach(card => {
    card.addEventListener('click', (e) => {
      const toolId = card.dataset.tool;
      if (!toolId) return; // لو رابط خارجي زي تيك توك يسيبه طبيعي
      
      e.preventDefault();
      document.querySelectorAll('.tool-section').forEach(sec => sec.classList.remove('active'));
      document.getElementById('tool-' + toolId).classList.add('active');

      toolsNav.style.display = 'none';
      mainHeader.style.display = 'none';
      searchContainer.style.display = 'none';
      categoriesContainer.style.display = 'none';
      workbench.style.display = 'block';

    });
  });

  function showHome() {
    workbench.style.display = 'none';
    toolsNav.style.display = 'grid';
    mainHeader.style.display = 'block';
    searchContainer.style.display = 'block';
    categoriesContainer.style.display = 'flex';
    applyFilters();
  }

  /* ===== 1. Image & ICO Converter ===== */
  let loadedConverterImg = null;

  function handleConverterImageSelect(e) {
    const file = e.target.files[0];
    if (!file) return;

    document.getElementById('imgConvLabel').innerText = "تم اختيار: " + file.name;

    const reader = new FileReader();
    reader.onload = function(evt) {
      const img = new Image();
      img.onload = function() {
        loadedConverterImg = img;
        document.getElementById('imgConvPreview').src = img.src;
        document.getElementById('imgConvPreviewBox').style.display = 'block';
      };
      img.src = evt.target.result;
    };
    reader.readAsDataURL(file);
  }

  function toggleIcoSizes() {
    const fmt = document.getElementById('imgTargetFormat').value;
    const sizeGrp = document.getElementById('icoSizeGroup');
    sizeGrp.style.display = (fmt === 'ico') ? 'block' : 'none';
  }

  function processImageConversion() {
    if (!loadedConverterImg) {
      alert('يرجى اختيار صورة أولاً!');
      return;
    }

    const format = document.getElementById('imgTargetFormat').value;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (format === 'ico') {
      const size = parseInt(document.getElementById('icoDimension').value) || 32;
      canvas.width = size;
      canvas.height = size;
      ctx.drawImage(loadedConverterImg, 0, 0, size, size);

      canvas.toBlob(function(blob) {
        const reader = new FileReader();
        reader.onloadend = function() {
          const pngBytes = new Uint8Array(reader.result);
          const icoHeader = new Uint8Array([
            0, 0,
            1, 0,
            1, 0,
            size >= 256 ? 0 : size, 
            size >= 256 ? 0 : size,
            0,
            0,
            1, 0,
            32, 0,
            pngBytes.length & 0xFF,
            (pngBytes.length >> 8) & 0xFF,
            (pngBytes.length >> 16) & 0xFF,
            (pngBytes.length >> 24) & 0xFF,
            22, 0, 0, 0
          ]);

          const icoBlob = new Blob([icoHeader, pngBytes], { type: 'image/x-icon' });
          const url = URL.createObjectURL(icoBlob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `icon_${size}x${size}.ico`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        };
        reader.readAsArrayBuffer(blob);
      }, 'image/png');
    } else {
      canvas.width = loadedConverterImg.width;
      canvas.height = loadedConverterImg.height;
      ctx.drawImage(loadedConverterImg, 0, 0);

      const mimeType = 'image/' + format;
      const dataUrl = canvas.toDataURL(mimeType, 0.92);
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `converted_image.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }

  /* ===== 2. Unit Converter ===== */
  const unitData = {
    length: { 'سم': 0.01, 'متر': 1, 'كم': 1000, 'إنش': 0.0254 },
    weight: { 'جم': 0.001, 'كجم': 1, 'طن': 1000, 'رطل': 0.453592 },
    temp: ['مئوية', 'فهرنهايت']
  };

  function setupUnitOptions() {
    const type = document.getElementById('unitType').value;
    const fromSel = document.getElementById('unitFromSelect');
    const toSel = document.getElementById('unitToSelect');
    fromSel.innerHTML = ''; toSel.innerHTML = '';

    const keys = type === 'temp' ? unitData.temp : Object.keys(unitData[type]);
    keys.forEach(k => {
      fromSel.innerHTML += `<option value="${k}">${k}</option>`;
      toSel.innerHTML += `<option value="${k}">${k}</option>`;
    });
    toSel.selectedIndex = 1;
    convertUnits('from');
  }

  function convertUnits(dir) {
    const type = document.getElementById('unitType').value;
    const from = document.getElementById('unitFromSelect').value;
    const to = document.getElementById('unitToSelect').value;
    const inFrom = document.getElementById('unitFromInput');
    const inTo = document.getElementById('unitToInput');

    if (dir === 'from') {
      let val = parseFloat(toEnNums(inFrom.value)) || 0;
      if (type === 'temp') {
        let res = from === 'مئوية' && to === 'فهرنهايت' ? (val * 9/5) + 32 : (from === 'فهرنهايت' && to === 'مئوية' ? (val - 32) * 5/9 : val);
        inTo.value = toEnNums(Number(res.toFixed(2)));
      } else {
        let base = val * unitData[type][from];
        let res = base / unitData[type][to];
        inTo.value = toEnNums(Number(res.toFixed(4)));
      }
    } else {
      let val = parseFloat(toEnNums(inTo.value)) || 0;
      if (type === 'temp') {
        let res = to === 'مئوية' && from === 'فهرنهايت' ? (val * 9/5) + 32 : (to === 'فهرنهايت' && from === 'مئوية' ? (val - 32) * 5/9 : val);
        inFrom.value = toEnNums(Number(res.toFixed(2)));
      } else {
        let base = val * unitData[type][to];
        let res = base / unitData[type][from];
        inFrom.value = toEnNums(Number(res.toFixed(4)));
      }
    }
  }
  setupUnitOptions();


  /* ===== 5. BMI Calculator ===== */
  function calculateBMI() {
    const w = parseFloat(toEnNums(document.getElementById('bmiWeight').value));
    const h = parseFloat(toEnNums(document.getElementById('bmiHeight').value)) / 100;
    if (!w || !h) return;
    const bmi = (w / (h * h)).toFixed(1);
    let status = '';
    if (bmi < 18.5) status = 'نقص وزن';
    else if (bmi < 25) status = 'وزن طبيعي';
    else if (bmi < 30) status = 'زيادة وزن';
    else status = 'سمنة';
    document.getElementById('bmiOutput').innerHTML = `المؤشر: <span class="en-num" dir="ltr">${toEnNums(bmi)}</span> — (${status})`;
  }
  calculateBMI();

  /* ===== 6. نظام اختيار التواريخ الموحد النافذة المنبثقة ===== */
  let currentPickerTarget = null;
  let selectedBirthDate = null;
  let selectedDiffStartDate = null;
  let selectedDiffEndDate = null;

  function openPickerModal(target) {
    currentPickerTarget = target;
    const modalTitle = document.getElementById('pickerModalTitle');
    const now = new Date();
    let currentDate = null;

    if (target === 'age') {
      modalTitle.textContent = "تحديد تاريخ الميلاد";
      currentDate = selectedBirthDate;
    } else if (target === 'diffStart') {
      modalTitle.textContent = "تحديد التاريخ الأول";
      currentDate = selectedDiffStartDate;
    } else if (target === 'diffEnd') {
      modalTitle.textContent = "تحديد التاريخ الثاني";
      currentDate = selectedDiffEndDate;
    }

    if (!currentDate) {
      document.getElementById('pDay').value = toEnNums(now.getDate());
      document.getElementById('pMonth').value = toEnNums(now.getMonth() + 1);
      document.getElementById('pYear').value = toEnNums(target === 'age' ? now.getFullYear() - 20 : now.getFullYear());
    } else {
      document.getElementById('pDay').value = toEnNums(currentDate.getDate());
      document.getElementById('pMonth').value = toEnNums(currentDate.getMonth() + 1);
      document.getElementById('pYear').value = toEnNums(currentDate.getFullYear());
    }
    document.getElementById('pickerModal').style.display = 'flex';
  }

  function closePickerModal() {
    document.getElementById('pickerModal').style.display = 'none';
  }

  function adjustPickerVal(type, delta) {
    if (type === 'day') {
      const el = document.getElementById('pDay');
      let val = (parseInt(toEnNums(el.value)) || 1) + delta;
      if (val < 1) val = 31;
      if (val > 31) val = 1;
      el.value = toEnNums(val);
    } else if (type === 'month') {
      const el = document.getElementById('pMonth');
      let val = (parseInt(toEnNums(el.value)) || 1) + delta;
      if (val < 1) val = 12;
      if (val > 12) val = 1;
      el.value = toEnNums(val);
    } else if (type === 'year') {
      const el = document.getElementById('pYear');
      let val = (parseInt(toEnNums(el.value)) || 2000) + delta;
      el.value = toEnNums(val);
    }
  }

  function clearPickerDate() {
    if (currentPickerTarget === 'age') {
      selectedBirthDate = null;
      document.getElementById('ageInputDisplay').value = '';
      document.getElementById('ageOutput').textContent = 'اختر تاريخ ميلادك';
    } else if (currentPickerTarget === 'diffStart') {
      selectedDiffStartDate = null;
      document.getElementById('diffStartDisplay').value = '';
      calcDateDiff();
    } else if (currentPickerTarget === 'diffEnd') {
      selectedDiffEndDate = null;
      document.getElementById('diffEndDisplay').value = '';
      calcDateDiff();
    }
    closePickerModal();
  }

  function confirmPickerDate() {
    const d = parseInt(toEnNums(document.getElementById('pDay').value));
    const m = parseInt(toEnNums(document.getElementById('pMonth').value));
    const y = parseInt(toEnNums(document.getElementById('pYear').value));

    if (!d || !m || !y || d < 1 || d > 31 || m < 1 || m > 12 || y < 1900) {
      alert('يرجى إدخال تاريخ صحيح');
      return;
    }

    const newDate = new Date(y, m - 1, d);

    if (currentPickerTarget === 'age') {
      selectedBirthDate = newDate;
      document.getElementById('ageInputDisplay').value = toEnNums(`${y}/${m}/${d}`);
      calculateAge();
    } else if (currentPickerTarget === 'diffStart') {
      selectedDiffStartDate = newDate;
      document.getElementById('diffStartDisplay').value = toEnNums(`${y}/${m}/${d}`);
      calcDateDiff();
    } else if (currentPickerTarget === 'diffEnd') {
      selectedDiffEndDate = newDate;
      document.getElementById('diffEndDisplay').value = toEnNums(`${y}/${m}/${d}`);
      calcDateDiff();
    }

    closePickerModal();
  }

  function calculateAge() {
    if (!selectedBirthDate) return;

    const birth = selectedBirthDate;
    const now = new Date();

    if (birth > now) {
      document.getElementById('ageOutput').textContent = "تاريخ الميلاد لا يمكن أن يكون في المستقبل!";
      return;
    }

    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const prevMonthLastDay = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
      days += prevMonthLastDay;
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    document.getElementById('ageOutput').innerHTML = `العمر: <span class="en-num" dir="ltr">${toEnNums(years)}</span> سنة، و <span class="en-num" dir="ltr">${toEnNums(months)}</span> شهر، و <span class="en-num" dir="ltr">${toEnNums(days)}</span> يوم`;
  }

  /* ===== 7. Date Difference Calculator ===== */
  function calcDateDiff() {
    const output = document.getElementById('dateDiffOutput');

    if (!selectedDiffStartDate || !selectedDiffEndDate) {
      output.textContent = "اختر التاريخين لرؤية الفارق التفصيلي";
      return;
    }

    let d1 = new Date(selectedDiffStartDate);
    let d2 = new Date(selectedDiffEndDate);

    if (d1 > d2) {
      const temp = d1;
      d1 = d2;
      d2 = temp;
    }

    let years = d2.getFullYear() - d1.getFullYear();
    let months = d2.getMonth() - d1.getMonth();
    let days = d2.getDate() - d1.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(d2.getFullYear(), d2.getMonth(), 0).getDate();
      days += prevMonth;
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    const totalDiffTime = Math.abs(d2 - d1);
    const totalDays = Math.ceil(totalDiffTime / (1000 * 60 * 60 * 24));

    output.innerHTML = `
      • الفارق بالتفصيل: <span class="en-num" dir="ltr">${toEnNums(years)}</span> سنة و <span class="en-num" dir="ltr">${toEnNums(months)}</span> شهر و <span class="en-num" dir="ltr">${toEnNums(days)}</span> يوم<br>
      • إجمالي عدد الأيام: <span class="en-num" dir="ltr">${toEnNums(totalDays.toLocaleString('en-US'))}</span> يوم
    `;
  }

