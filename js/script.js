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


function download() {
    let link = document.getElementById('link').value;
    let format = document.getElementById('format').value;

    if (link != "") {
        let url;
        if (link.includes("https://youtu.be/")) {
            url = link.replace("https://youtu.be/", "https://www.youtube.com/embed/");
        } else if (link.includes("https://www.youtube.com/watch?v=")) {
            url = link.replace("https://www.youtube.com/watch?v=", "https://www.youtube.com/embed/");
        } else if (link.includes("https://youtube.com/shorts/")) {
            url = link.replace("https://youtube.com/shorts/", "https://www.youtube.com/embed/").replace("?feature=share", "");
        }

        if (url) {
            let downloadUrl = `https://loader.to/api/button/?url=${encodeURIComponent(link)}&f=${format}`;
            let iframe = `<iframe style="width: 100%; height: 50px; border: hidden; overflow: hidden; outline: none;" scrolling="no" src="${downloadUrl}"></iframe>`;
            document.querySelector('.result2').innerHTML = iframe;
        } else {
            alert("Invalid YouTube video link!");
        }
    } else {
        alert("Please enter a YouTube video link!");
    }
}


function Get() {
    let youtubeUrl = document.getElementById('youtubeUrl').value.trim();
    
    if (!isValidUrl(youtubeUrl)) {
        alert('Please enter a valid YouTube URL.');
        return;
    }
    
    let videoID = getVideoID(youtubeUrl);
    if (!videoID) {
        alert('Unable to extract video ID from the URL.');
        return;
    }
    
    downloadMusic(videoID);
}

function isValidUrl(url) {
    let regex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?.*v=|.*\/v\/|embed\/|v\/))?([\w\-]{11})(\&.*)?$/;
    return regex.test(url);
}

function getVideoID(url) {
    let match = url.match(/(?:v=|\/)([\w\-]{11})(?:\S+)?$/);
    return match ? match[1] : null;
}

function downloadMusic(videoID) {
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '2b929025ddmshd3302ab633a818cp1ab4cdjsne14ca95e2a8d',
            'X-RapidAPI-Host': 'youtube-mp36.p.rapidapi.com'
        }
    };

    let urlLink = 'https://youtube-mp36.p.rapidapi.com/dl?id=' + videoID;
    fetch(urlLink, options)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            const downloadLink = data.link;
            const anchor = document.createElement("a");
            anchor.href = downloadLink;
            anchor.download = 'MWC.mp3';
            document.body.appendChild(anchor);
            anchor.click();
            document.body.removeChild(anchor);
        })
        .catch(err => console.error('Error downloading music:', err));
}





const textarea = document.querySelector("textarea"),
voiceList = document.querySelector(".select"),
speechBtn = document.getElementById("speech");

let synth = speechSynthesis,
isSpeaking = true;

voices();

function voices(){
    for(let voice of synth.getVoices()){
        let selected = voice.name === "Google US English" ? "selected" : "";
        let option = `<option value="${voice.name}" ${selected}>${voice.name} (${voice.lang})</option>`;
        voiceList.insertAdjacentHTML("beforeend", option);
    }
}

synth.addEventListener("voiceschanged", voices);

function textToSpeech(text){
    let utterance = new SpeechSynthesisUtterance(text);
    for(let voice of synth.getVoices()){
        if(voice.name === voiceList.value){
            utterance.voice = voice;
        }
    }
    synth.speak(utterance);
}

speechBtn.addEventListener("click", e => {
    e.preventDefault();
    
    if (textarea.value !== "") {
        if (!synth.speaking) {
            textToSpeech(textarea.value);
        }
        
        if (textarea.value.length > 80) {
            if (isSpeaking) {
                synth.resume();
                isSpeaking = false;
                speechBtn.innerText = "Pause Speech";
            } else {
                synth.pause();
                isSpeaking = true;
                speechBtn.innerText = "Resume Speech";
            }
        }
    }
});







document.getElementById("aiForm").addEventListener("submit", function(event) {
    event.preventDefault(); 
            
    var question = document.getElementById("questionInput").value;
            
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://deku-rest-api.replit.app/gpt4?prompt=" + encodeURIComponent(question) + "&uid=100");
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            displayResponse(response.gpt4); 
        }
    };
    xhr.send();
});

function displayResponse(response) {
    var messagesContainer = document.querySelector( ".messages" );
    messagesContainer.innerHTML = "";

    var messageElement = document.createElement("div");
    messageElement.classList.add("message");
    messageElement.innerHTML = "<p>" + response + "</p>";
    messagesContainer.appendChild(messageElement);
}






document.addEventListener( "DOMContentLoaded", function ()
{
    document.getElementById("generate-button").addEventListener("click", function(event) {
    var inputField = document.getElementById("imagegen-input");
    var prompt = inputField.value;
    var apiUrl = "https://deku-rest-api.replit.app/dalle?prompt=" + encodeURIComponent(prompt);


    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch");
            }
            const reader = response.body.getReader();
            return new ReadableStream({
                start(controller) {
                    function pump() {
                        reader.read().then(({ done, value }) => {
                            if (done) {
                                controller.close();
                                return;
                            }
                            controller.enqueue(value);
                            pump();
                        }).catch(error => {
                            console.error('Error reading response body:', error);
                            controller.error(error)
                        });
                    }
                    pump();
                }
            });
        })
        .then(stream => new Response(stream))
        .then(response => response.blob())
        .then(blob => {
            var imageURL = URL.createObjectURL(blob);
            displayImage(imageURL);
            setDownloadLink(imageURL);
        })
        .catch(error => {
            console.error("Error:", error);
        });
    });

    function displayImage(imageUrl) {
        var previewDiv = document.querySelector(".imagegen-preview");
        previewDiv.innerHTML = ""; 
        var imgElement = document.createElement("img");
        imgElement.src = imageUrl;
        previewDiv.appendChild(imgElement);
    }

    function setDownloadLink(imageUrl) {
        var downloadLink = document.getElementById("download-link");
        if (!downloadLink) {
            console.error("Download link element not found.");
            return;
        }
        downloadLink.href = imageUrl;
        downloadLink.style.display = "block"; 
    }
})
