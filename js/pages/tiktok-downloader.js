
document.getElementById('pasteBtn').addEventListener('click', pasteFromClipboard);
document.getElementById('pasteBtn').addEventListener('touchend', function(e) {
    e.preventDefault();
    pasteFromClipboard();
});

async function pasteFromClipboard() {
    const input = document.getElementById('linksInput');
    input.focus();

    if (navigator.clipboard && navigator.clipboard.readText) {
        try {
            const text = await navigator.clipboard.readText();
            if (text) {
                input.value = input.value ? input.value.trim() + '\n' + text.trim() : text.trim();
                return;
            }
        } catch (err) {
            console.log('Permission declined or blocked');
        }
    }

    try {
        document.execCommand('insertText', false, await navigator.clipboard.readText());
    } catch (e) {
        input.select();
    }
}

async function processLinks() {
    const input = document.getElementById('linksInput').value.trim();
    const resultsContainer = document.getElementById('results');
    const loader = document.getElementById('loader');

    if (!input) {
        alert('من فضلك ادخل رابط واحد على الأقل');
        return;
    }

    let links = input.split('\n').map(l => l.trim()).filter(l => l.length > 0);

    if (links.length > 5) {
        alert('تم تحديد أول 5 روابط فقط بناءً على الحد الأقصى');
        links = links.slice(0, 5);
    }

    resultsContainer.innerHTML = '';
    loader.style.display = 'block';

    for (let i = 0; i < links.length; i++) {
        await fetchTikTokData(links[i]);
    }

    loader.style.display = 'none';
}

// الدالة المحدثة لاصطياد أعلى جودة متوفرة من الـ API بدقة تامة
async function fetchTikTokData(url) {
    const resultsContainer = document.getElementById('results');

    try {
        const response = await fetch('https://www.tikwm.com/api/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                url: url,
                hd: '1'
            })
        });

        const resData = await response.json();

        if (resData.code !== 0 || !resData.data) {
            showErrorCard(url, 'تعذر جلب البيانات، تأكد من صحة الرابط');
            return;
        }

        const item = resData.data;

        // فحص وتتبع كافة المسارات المحتملة لأعلى جودة فيديو متاحة
        const videoUrl =
            item.hdplay ||
            item.play ||
            item.no_watermark ||
            item.video?.hd ||
            item.video?.url ||
            item.video?.play;

        const musicUrl =
            item.music ||
            item.music_info?.play ||
            null;

        const card = document.createElement('div');
        card.className = 'card';

        // التعامل مع ألبوم الصور بجودتها الكاملة
        if (item.images && item.images.length > 0) {
            let imagesHTML = '';
            item.images.forEach((imgUrl, index) => {
                imagesHTML += `
                    <div class="image-item">
                        <img src="${imgUrl}" alt="صورة ${index + 1}" onclick="openModal('${imgUrl}')">
                        <button onclick="downloadFile('${imgUrl}', 'tiktok_image_${index + 1}.jpeg', this)" class="btn-action" style="font-size: 0.75rem; padding: 8px; margin-top: 5px;">تنزيل أصلي</button>
                        <button onclick="openModal('${imgUrl}')" class="btn-action btn-preview" style="font-size: 0.75rem; padding: 6px; margin-top: 4px;">🔍 معاينة</button>
                    </div>
                `;
            });

            card.innerHTML = `
                <div class="card-header">
                    <img class="thumb" src="${item.cover}" alt="غلاف" onclick="openModal('${item.cover}')">
                    <div class="card-title">
                        <strong>[ألبوم صور أصلي] (${item.images.length} صور)</strong><br>
                        ${item.title || 'بدون عنوان'}
                    </div>
                </div>
                <div><strong>اختر الصور للتحميل بجودة كاملة:</strong></div>
                <div class="images-gallery">${imagesHTML}</div>
            `;
        } 
        // التعامل مع الفيديو العادي بأعلى دقة HD
        else if (videoUrl) {
            card.innerHTML = `
                <div class="card-header">
                    <img class="thumb" src="${item.cover}" alt="غلاف" onclick="openModal('${item.cover}')">
                    <div class="card-title">
                        <strong>[فيديو HD أصلي]</strong><br>
                        ${item.title || 'بدون عنوان'}
                    </div>
                </div>
                <div class="actions-group">
                    <button onclick="downloadFile('${videoUrl}', 'tiktok_hd_video.mp4', this)" class="btn-action">🎬 تحميل فيديو HD</button>
                    ${musicUrl ? `<button onclick="downloadFile('${musicUrl}', 'tiktok_audio.mp3', this)" class="btn-action btn-audio">🎵 تحميل صوت</button>` : ''}
                    <button onclick="toggleVideoPreview(this, '${videoUrl}')" class="btn-action btn-preview">👁️ معاينة</button>
                </div>
                <div class="video-container" style="display:none;"></div>
            `;
        } else {
            showErrorCard(url, 'لم يتم العثور على رابط فيديو صالح');
            return;
        }

        resultsContainer.appendChild(card);

    } catch (err) {
        showErrorCard(url, 'حدث خطأ أثناء الاتصال بالسيرفر');
    }
}

// دالة التنزيل التي تجبر المتصفح على تنزيل الملف الخام بدقة أصلية كاملة
async function downloadFile(fileUrl, fileName, btnElement) {
    btnElement.innerText = 'جاري التحميل... ⏳';
    btnElement.disabled = true;

    try {
        const response = await fetch(fileUrl, { mode: 'cors' });
        const blob = await response.blob();
        
        const blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = blobUrl;
        a.download = fileName;
        
        document.body.appendChild(a);
        a.click();
        
        window.URL.revokeObjectURL(blobUrl);
        document.body.removeChild(a);

        btnElement.innerText = 'تم التحميل ✅';
        btnElement.classList.add('downloaded');
    } catch (error) {
        const a = document.createElement('a');
        a.href = fileUrl;
        a.target = '_blank';
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        btnElement.innerText = 'تم التحميل ✅';
        btnElement.classList.add('downloaded');
    }
}

function showErrorCard(url, message) {
    const resultsContainer = document.getElementById('results');
    const card = document.createElement('div');
    card.className = 'card';
    card.style.borderColor = '#ef4444';
    card.innerHTML = `<div style="color: #ef4444;">❌ <strong>خطأ:</strong> ${message}<br><small>${url}</small></div>`;
    resultsContainer.appendChild(card);
}

function toggleVideoPreview(btn, videoUrl) {
    const card = btn.closest('.card');
    const container = card.querySelector('.video-container');

    if (container.style.display === 'none') {
        container.innerHTML = `<video class="preview-video" controls autoplay src="${videoUrl}"></video>`;
        container.style.display = 'block';
        btn.innerText = '❌ إخفاء';
    } else {
        container.innerHTML = '';
        container.style.display = 'none';
        btn.innerText = '👁️ معاينة';
    }
}

function openModal(imgSrc) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    modal.style.display = 'flex';
    modalImg.src = imgSrc;
}

function closeModal() {
    const modal = document.getElementById('imageModal');
    modal.style.display = 'none';
}
