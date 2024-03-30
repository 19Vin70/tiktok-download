document.addEventListener('DOMContentLoaded', () => {
    const menuIcon = document.getElementById('menu-icon');
    const closeIcon = document.getElementById('close-icon');
    const navbarContainer = document.querySelector('.navbar');

    menuIcon.addEventListener('click', () => {
        menuIcon.style.display = 'none';
        closeIcon.style.display = 'block';
        navbarContainer.style.display = 'flex';
    });

    closeIcon.addEventListener('click', () => {
        menuIcon.style.display = 'block';
        closeIcon.style.display = 'none';
        navbarContainer.style.display = 'none';
    });

    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                document.querySelectorAll('.section').forEach(section => {
                    section.style.display = 'none';
                });
                targetSection.style.display = 'flex';
            }
            menuIcon.style.display = 'block';
            closeIcon.style.display = 'none';
            navbarContainer.style.display = 'none';
        });
    });

    const homeSection = document.getElementById('home');
    if (homeSection) {
        homeSection.style.display = 'flex';
    }

    document.querySelectorAll('.section').forEach(section => {
        if (section !== homeSection) {
            section.style.display = 'none';
        }
    });

    const ttdlForm = document.getElementById('ttdlForm');

    ttdlForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const videoUrlInput = ttdlForm.querySelector('input[name="url"]');
        const videoUrl = videoUrlInput.value.trim();
        if (videoUrl) {
            try {
                const apiUrl = `https://deku-rest-api.replit.app/tiktokdl?url=${encodeURIComponent(videoUrl)}`;
                const response = await fetch(apiUrl);
                const data = await response.json();
                if (data.result) {
                    console.log('TikTok video download URL:', data.result);
                    const videoDataResponse = await fetch(data.result);
                    const videoDataBlob = await videoDataResponse.blob();
                    const downloadLink = document.createElement('a');
                    downloadLink.href = window.URL.createObjectURL(videoDataBlob);
                    downloadLink.download = 'tiktok_video.mp4';
                    downloadLink.click();
                } else {
                    console.error('TikTok video download error:', data.error || 'Unknown error');
                }
            } catch (error) {
                console.error('Error:', error.message);
            }
        } else {
            console.error('Please enter a TikTok video URL');
        }
    } );
    
    const fileInput = document.getElementById("filedl-input");
    const fileDownloadBtn = document.getElementById("file-download-btn"); 

    fileDownloadBtn.addEventListener("click", e => {
        e.preventDefault();
        fileDownloadBtn.innerText = "Downloading file...";
        fetchFile(fileInput.value);
    });

    function fetchFile(url) {
        fetch(url)
            .then(res => res.blob())
            .then(file => {
                let tempUrl = URL.createObjectURL(file);
                const aTag = document.createElement("a");
                aTag.href = tempUrl;
                aTag.download = url.substring(url.lastIndexOf('/') + 1); 
                document.body.appendChild(aTag);
                aTag.click();
                fileDownloadBtn.innerText = "Download File";
                URL.revokeObjectURL(tempUrl);
                aTag.remove();
            })
            .catch(() => {
                alert("Failed to download file!");
                fileDownloadBtn.innerText = "Download File";
            });
    }
});
