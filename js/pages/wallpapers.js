
      // تخزين بيانات كل الصور مصنفة
      const categoriesData = {
        anime: [
          "https://i.postimg.cc/RZpZPdFh/tiktok-image-12.jpg",
          "https://i.postimg.cc/JzYzTxnh/tiktok-image-14.jpg",
          "https://i.postimg.cc/rwZwhjmy/tiktok-image-15.jpg",
          "https://i.postimg.cc/T3N3k0ww/tiktok-image-6-(1).jpg",
          "https://i.postimg.cc/g2t2MsJ2/tiktok-image-8-(1).jpg",
          "https://i.postimg.cc/26mJgY08/photo-anime-1.jpg",
          "https://i.postimg.cc/Px4cj77M/photo-anime-10.jpg",
          "https://i.postimg.cc/yx8GYPqQ/photo-anime-11.jpg",
          "https://i.postimg.cc/KjpHKMxL/photo-anime-12.png",
          "https://i.postimg.cc/d3Nx7yw0/photo-anime-13.jpg",
          "https://i.postimg.cc/VvZVSCmq/photo-anime-14.jpg",
          "https://i.postimg.cc/wxwP4SL6/photo-anime-15.jpg",
          "https://i.postimg.cc/jqM93GPV/photo-anime-16.jpg",
          "https://i.postimg.cc/8PsY2tmT/photo-anime-17.jpg",
          "https://i.postimg.cc/TYhszCJ5/photo-anime-2.png",
          "https://i.postimg.cc/k49ZLCT5/photo-anime-3.jpg",
          "https://i.postimg.cc/RFR8BYYc/photo-anime-4.png",
          "https://i.postimg.cc/Y93VHPP8/photo-anime-5.jpg",
          "https://i.postimg.cc/RF982mgN/photo-anime-6.jpg",
          "https://i.postimg.cc/mDRqK4mH/photo-anime-7.jpg",
          "https://i.postimg.cc/503GVrr0/photo-anime-8.jpg",
          "https://i.postimg.cc/T2tSNZmt/photo-anime-9.png"
        ],
        football: [
          "https://i.postimg.cc/qMfnwkF9/tiktok-image-10.jpg",
          "https://i.postimg.cc/tC0PkXfQ/tiktok-image-6.jpg",
          "https://i.postimg.cc/tC0PkXf0/tiktok-image-8.jpg",
          "https://i.postimg.cc/sgPx4dtw/tiktok-image-3-(1).jpg",
          "https://i.postimg.cc/9fWMxg2H/tiktok-image-5.jpg",
          "https://i.postimg.cc/q7kRmDTW/tiktok-image-11.jpg",
          "https://i.postimg.cc/cL7CByVh/tiktok-image-8-(2).jpg",
          "https://i.postimg.cc/bvzJ6VhB/tiktok-image-8.jpg",
          "https://i.postimg.cc/tgXTrvjD/tiktok-image-1.jpg",
          "https://i.postimg.cc/s2VXnHr0/tiktok-image-14.jpg",
          "https://i.postimg.cc/kgNGv3kW/tiktok-image-7-(1).jpg",
          "https://i.postimg.cc/0N8QtXsn/tiktok-image-2-(1).jpg",
          "https://i.postimg.cc/cJsHDkWW/tiktok-image-9.jpg",
          "https://i.postimg.cc/LsHXyQpw/tiktok-image-4.jpg",
          "https://i.postimg.cc/CKF1vrgv/tiktok-image-12.jpg",
          "https://i.postimg.cc/W4239YvK/tiktok-image-6.jpg",
          "https://i.postimg.cc/1z9tW7QK/tiktok-image-8-(1).jpg",
          "https://i.postimg.cc/pd2T0cvH/tiktok-image-3.jpg",
          "https://i.postimg.cc/XYKqkSTk/tiktok-image-5-(1).jpg",
          "https://i.postimg.cc/bvzJ6Vh7/tiktok-image-7.jpg",
          "https://i.postimg.cc/N0gMNCc1/tiktok-image-4-(1).jpg",
          "https://i.postimg.cc/Gpc2MgCG/tiktok-image-14-(1).jpg",
          "https://i.postimg.cc/vZCwqpRG/photo-football-1.jpg",
          "https://i.postimg.cc/SK8FwDqV/photo-football-10.jpg",
          "https://i.postimg.cc/25vRP2mh/photo-football-11.jpg",
          "https://i.postimg.cc/7L78pmDR/photo-football-12.jpg",
          "https://i.postimg.cc/26DRmh80/photo-football-13.jpg",
          "https://i.postimg.cc/xdHDWtYh/photo-football-14.jpg",
          "https://i.postimg.cc/Zq3t1VZX/photo-football-15.jpg",
          "https://i.postimg.cc/0QsRxD2n/photo-football-16.jpg",
          "https://i.postimg.cc/Kz2SFBvw/photo-football-17.jpg",
          "https://i.postimg.cc/pTHbxzX0/photo-football-18.jpg",
          "https://i.postimg.cc/PxjshYrF/photo-football-19.jpg",
          "https://i.postimg.cc/3xzQSPM0/photo-football-2.jpg",
          "https://i.postimg.cc/1tQhPw3P/photo-football-20.jpg",
          "https://i.postimg.cc/vBsFMfHp/photo-football-21.jpg",
          "https://i.postimg.cc/DwR3jtV0/photo-football-3.jpg",
          "https://i.postimg.cc/Cx9pPWyd/photo-football-4.jpg",
          "https://i.postimg.cc/kgLP1kr4/photo-football-5.jpg",
          "https://i.postimg.cc/JzSC69wk/photo-football-6.jpg",
          "https://i.postimg.cc/VNMQ3D1j/photo-football-7.jpg",
          "https://i.postimg.cc/K8ChqdXT/photo-football-8.jpg",
          "https://i.postimg.cc/9fT5vJVJ/photo-football-9.jpg",
          "https://i.postimg.cc/nhKrGb6T/tiktok-image-6-(1).jpg"
        ],
        cars: [
          "https://i.postimg.cc/nc7zGY9h/1-(1).jpg",
          "https://i.postimg.cc/Bn0vYL2z/1-(10).jpg",
          "https://i.postimg.cc/Vk8NGrjm/1-(11).jpg",
          "https://i.postimg.cc/g2W0SXvc/1-(12).jpg",
          "https://i.postimg.cc/2SD5cb4k/1-(13).jpg",
          "https://i.postimg.cc/vZtZpYzF/1-(14).jpg",
          "https://i.postimg.cc/7ZnZpHVq/1-(15).jpg",
          "https://i.postimg.cc/fRfR6zKQ/1-(16).jpg",
          "https://i.postimg.cc/T3J3Zd9X/1-(17).jpg",
          "https://i.postimg.cc/s2fgzk6B/1-(19).jpg",
          "https://i.postimg.cc/SN8sf7Yn/1-(2).jpg",
          "https://i.postimg.cc/RZLZjSR6/1-(20).jpg",
          "https://i.postimg.cc/YCzCJrxJ/1-(3).png",
          "https://i.postimg.cc/2SD5cbnw/1-(4).jpg",
          "https://i.postimg.cc/Hs5x9485/1-(5).jpg",
          "https://i.postimg.cc/X7FJkcB2/1-(7).jpg",
          "https://i.postimg.cc/4xg3L7pS/1-(8).jpg",
          "https://i.postimg.cc/dVY0HkGX/1-(9).jpg",
          "https://i.postimg.cc/R004ychQ/1-(18).jpg",
          "https://i.postimg.cc/ydMKDtjB/1-(21).png",
          "https://i.postimg.cc/zff86nvx/1-(22).png",
          "https://i.postimg.cc/vmmbkWTk/1-(23).jpg",
          "https://i.postimg.cc/DzznHq0M/1-(24).jpg",
          "https://i.postimg.cc/s20srvZ1/1-(25).jpg",
          "https://i.postimg.cc/fbgDNJ0t/1-(26).jpg",
          "https://i.postimg.cc/s20srvZ2/1-(27).png",
          "https://i.postimg.cc/wvyHTgh1/1-(28).png",
          "https://i.postimg.cc/wvyHTghJ/1-(29).png",
          "https://i.postimg.cc/TwLGYfry/1-(30).png"
        ],
        nature: [
         "https://i.postimg.cc/QMscFjRD/Aha-Tik-wallp4-k-3defe102-ea15-40a4-87f2-fab53c57f380.jpg",
          "https://i.postimg.cc/8CHMWqS1/Aha-Tik-wallp4-k-481cfa33-e105-4688-8947-29267e9106e1.jpg",
          "https://i.postimg.cc/d0BrdzYY/Aha-Tik-wallp4-k-5f3bdccd-9cf6-4367-9025-14fab6e60d89.jpg",
          "https://i.postimg.cc/fbKmX6NQ/Aha-Tik-wallp4-k-86f75850-4f0c-4750-9754-9202bdf8cc0d.jpg",
          "https://i.postimg.cc/xdRMHW2j/Aha-Tik-wallp4-k-a4994e10-adea-4e6d-89bd-50a5ba60450f.jpg",
          "https://i.postimg.cc/nLkB76Jh/Aha-Tik-wallp4-k-adb93870-ee11-483a-a629-4b849eab678e.jpg",
          "https://i.postimg.cc/JzVsfdWw/2-(1).jpg",
          "https://i.postimg.cc/DwkS9YKK/2-(2).jpg",
          "https://i.postimg.cc/vZF4JSdw/2-(3).jpg",
          "https://i.postimg.cc/kgQ2qF7Y/2-(4).jpg",
          "https://i.postimg.cc/DwkS9YKT/2-(5).jpg",
          "https://i.postimg.cc/W1GdT6sf/2-(6).jpg",
          "https://i.postimg.cc/Nj6KB7Qz/2-(7).jpg",
          "https://i.postimg.cc/g2VxmqG5/2-(8).jpg",
          "https://i.postimg.cc/GmF4dJcd/2-(11).jpg"
        ],
        cosmos: [
          "https://i.postimg.cc/90yD0GG1/3-(1).jpg",
          "https://i.postimg.cc/nVmj3t6x/3-(2).jpg",
          "https://i.postimg.cc/1RFnvZLZ/3-(3).jpg",
          "https://i.postimg.cc/yx0DxFF5/3-(4).jpg",
          "https://i.postimg.cc/ZYNBwh1S/3-(5).jpg",
          "https://i.postimg.cc/76jvNt3B/img1787983147764.jpg",
          "https://i.postimg.cc/nc48vkCw/img1787983091841.jpg",
          "https://i.postimg.cc/CLGyjNRp/img1787983117521.jpg",
          "https://i.postimg.cc/pXfNDZmt/img1787983135114.jpg",
          "https://i.postimg.cc/kXQrxc2C/img1787983152895.jpg",
          "https://i.postimg.cc/nc48vkXn/img1787983158989.jpg",
          "https://i.postimg.cc/RZ4kGHtC/img1787983188615.jpg",
          "https://i.postimg.cc/K8x6QMMd/img1787983191957.jpg",
          "https://i.postimg.cc/x1nwgzmz/tiktok-image-10.jpg",
          "https://i.postimg.cc/Vkmx4Ctt/tiktok-image-11.jpg",
          "https://i.postimg.cc/Qdh2ST71/tiktok-image-13.jpg",
          "https://i.postimg.cc/XYLTPYKv/tiktok-image-14.jpg",
          "https://i.postimg.cc/Bn4rNKFW/tiktok-image-2.jpg",
          "https://i.postimg.cc/0yPTZwS8/tiktok-image-2-(1).jpg",
          "https://i.postimg.cc/Dwn95XGy/tiktok-image-3.jpg",
          "https://i.postimg.cc/W1TBSkZj/tiktok-image-4.jpg",
          "https://i.postimg.cc/7ZwFX2zZ/tiktok-image-4-(1).jpg",
          "https://i.postimg.cc/8zN2w6v5/tiktok-image-4-(2).jpg",
          "https://i.postimg.cc/K8x6QMTm/tiktok-image-6.jpg",
          "https://i.postimg.cc/dVwbnyC3/tiktok-image-7.jpg",
          "https://i.postimg.cc/RZ4kGHtW/tiktok-image-8.jpg",
          "https://i.postimg.cc/52bhpCzF/tiktok-image-9.jpg"
        ]
      };

      // دالة خلط عشوائي (Fisher-Yates Shuffle)
      function shuffleArray(array) {
        let arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
          let j = Math.floor(Math.random() * (i + 1));
          [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
      }

      // إنشاء عنصر كارت خلفية مع تفعيل التحميل الكسول (Lazy Loading) لضمان نعومة السكرول
      function createWallpaperCard(url) {
        const card = document.createElement('div');
        card.className = 'wallpaper-card';

        const imgContainer = document.createElement('div');
        imgContainer.className = 'wallpaper-img-container';
        imgContainer.onclick = () => openLightbox(url);

        const img = document.createElement('img');
        img.src = url;
        img.alt = 'Wallpaper';
        img.loading = 'lazy'; // ميزة تمنع تهنيج السكرول وتحمل الصور حسب ظهورها
        imgContainer.appendChild(img);

        const btn = document.createElement('button');
        btn.className = 'download-btn-overlay';
        btn.textContent = 'تحميل ⬇️';
        btn.onclick = (e) => {
          e.stopPropagation();
          downloadImage(url);
        };

        card.appendChild(imgContainer);
        card.appendChild(btn);
        return card;
      }

      // فلترة وعرض الصور
      function filterCategory(category, btnElement) {
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        btnElement.classList.add('active');

        const container = document.getElementById('dynamic-gallery-container');
        container.innerHTML = '';

        const galleryGrid = document.createElement('div');
        galleryGrid.className = 'gallery';

        if (category === 'all') {
          let allImages = [];
          Object.values(categoriesData).forEach(arr => {
            allImages = allImages.concat(arr);
          });
          const shuffledImages = shuffleArray(allImages);

          shuffledImages.forEach(url => {
            galleryGrid.appendChild(createWallpaperCard(url));
          });
        } else {
          if (categoriesData[category]) {
            categoriesData[category].forEach(url => {
              galleryGrid.appendChild(createWallpaperCard(url));
            });
          }
        }

        container.appendChild(galleryGrid);
      }

      let currentLightboxSrc = '';

      function openLightbox(imgSrc) {
        currentLightboxSrc = imgSrc;
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightbox-img');
        lightboxImg.src = imgSrc;
        lightbox.style.display = 'flex';
      }

      function closeLightbox() {
        document.getElementById('lightbox').style.display = 'none';
      }

      function downloadCurrentLightbox() {
        if (currentLightboxSrc) {
          downloadImage(currentLightboxSrc);
        }
      }

      // دالة التحميل عبر Fetch / Blob
      async function downloadImage(url) {
        try {
          const response = await fetch(url, { mode: 'cors' });
          const blob = await response.blob();
          const blobUrl = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = blobUrl;
          const filename = url.split('/').pop().split('?')[0] || 'wallpaper.jpg';
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(blobUrl);
          document.body.removeChild(a);
        } catch (error) {
          const a = document.createElement('a');
          a.href = url;
          a.target = '_blank';
          a.download = '';
          a.click();
        }
      }

      document.getElementById('lightbox').addEventListener('click', function(e) {
        if (e.target === this) {
          closeLightbox();
        }
      });

      // التحميل التلقائي لصفحة "الكل" عند فتح الموقع لأول مرة
      window.onload = function() {
        const allBtn = document.querySelector('.filter-btn');
        if (allBtn) {
          filterCategory('all', allBtn);
        }
      };
    