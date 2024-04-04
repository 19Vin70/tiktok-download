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
            
    let question = document.getElementById("questionInput").value;
    let userID = localStorage.getItem("userID"); 
            
    if (!userID) {
        userID = Math.floor(Math.random() * 1000); 
        localStorage.setItem("userID", userID); 
    }
    
    let selectedModel = document.getElementById("ai-select").value;
    let apiUrl;
    switch (selectedModel) {
        case "gpt4":
            apiUrl = "https://deku-rest-api.replit.app/gpt4";
            break;
        case "gemini":
            apiUrl = "https://deku-rest-api.replit.app/gemini";
            break;
        case "llama":
            apiUrl = "https://deku-rest-api.replit.app/llama-70b";
            break;
        case "gemma":
            apiUrl = "https://deku-rest-api.replit.app/gemma-7b";
            break;
        case "qwen":
            apiUrl = "https://deku-rest-api.replit.app/qwen-72b";
            break;
        default:
            apiUrl = "https://deku-rest-api.replit.app/gpt4";
    }
            
    let xhr = new XMLHttpRequest();
    xhr.open("GET", apiUrl + "?prompt=" + encodeURIComponent(question) + "&uid=" + userID);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            let response = JSON.parse(xhr.responseText);
            displayResponse(response[selectedModel]); 
        }
    };
    xhr.send();
});

function displayResponse(response) {
    let messagesContainer = document.querySelector( ".messages" );
    messagesContainer.innerHTML = "";

    let messageElement = document.createElement("div");
    messageElement.classList.add("message");
    messageElement.innerHTML = "<p>" + response + "</p>";
    messagesContainer.appendChild(messageElement);
}






document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("generate-button").addEventListener("click", function (event) {
        let inputField = document.getElementById("imagegen-input");
        let prompt = inputField.value;
        let modelSelect = document.getElementById("model-select");
        let selectedModel = modelSelect.options[modelSelect.selectedIndex].value;
        let apiUrl;

        if (selectedModel === "dalle") {
            apiUrl = "https://deku-rest-api.replit.app/dalle?prompt=" + encodeURIComponent(prompt);
        } else if (selectedModel === "dallev2") {
            apiUrl ="https://deku-rest-api.replit.app/dallev2?prompt=" + encodeURIComponent(prompt);s
        } else if (selectedModel === "sdxl") {
            apiUrl = "https://deku-rest-api.replit.app/sdxl?prompt=" + encodeURIComponent(prompt) + "&styles=1";
        } else if ( selectedModel === "openjourney" ) {
            apiUrl = "https://deku-rest-api.replit.app/openjourney?prompt=" + encodeURIComponent(prompt);
        } else if ( selectedModel === "emi" ) {
            apiUrl = "https://deku-rest-api.replit.app/emi?prompt=" + encodeURIComponent(prompt);
        } else if ( selectedModel === "render" ) {
            apiUrl = "https://deku-rest-api.replit.app/render?prompt=" + encodeURIComponent(prompt);
        } else if (selectedModel === "pixart") {
            apiUrl = "https://deku-rest-api.replit.app/pixart?prompt=" + encodeURIComponent(prompt) + "&styles=1";
        } else {
            console.error("Invalid model selected.");
            return;
        }

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
                let imageURL = URL.createObjectURL(blob);
                displayImage(imageURL);
                setDownloadLink(imageURL);
            })
            .catch(error => {
                console.error("Error:", error);
            });
    });

    function displayImage(imageUrl) {
        let previewDiv = document.querySelector(".imagegen-preview");
        previewDiv.innerHTML = "";
        let imgElement = document.createElement("img");
        imgElement.src = imageUrl;
        previewDiv.appendChild(imgElement);
    }

    function setDownloadLink(imageUrl) {
        let downloadLink = document.getElementById("download-link");
        if (!downloadLink) {
            console.error("Download link element not found.");
            return;
        }
        downloadLink.href = imageUrl;
        downloadLink.style.display = "block";
    }
});





async function GetReels() {
    let url = document.getElementById('fbUrl').value.trim(); 
    let reelId = extractReelId(url);
    let apiUrl = "https://deku-rest-api.replit.app/facebook?url=https://web.facebook.com/reel/" + reelId;

    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error('Failed to fetch video URL. Please check your URL and try again.');
        }

        const responseData = await response.json(); 

        const videoUrl = responseData.result;

        if (!videoUrl) {
            throw new Error('Video URL not found in the response. Please check your URL and try again.');
        }

        downloadVideo( videoUrl );
        
        document.getElementById('fbUrl').value = "";
    } catch (error) {
        console.error('Error fetching video:', error);
        alert(error.message);
    }
}

function downloadVideo(videoUrl) {
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/'; 
    const proxiedUrl = proxyUrl + videoUrl;

    fetch(proxiedUrl)
        .then(response => response.blob())
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'facebook_video.mp4';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        })
        .catch(error => {
            console.error('Error downloading video:', error);
            alert('Error downloading video. Please try again.');
        });
}

function extractReelId(url) {
    let parts = url.split('/');
    return parts[parts.length - 1];
}










let conversationHistory = []; 
let userName = null; 

document.getElementById('kabeForm').addEventListener('submit', function(event) {
    event.preventDefault();

    let message = document.getElementById('kabeInput').value;
    let corsProxy = "https://cors-anywhere.herokuapp.com/";

    if (!userName) {
        userName = message;
        conversationHistory.push({ sender: 'user', message: message }); 
        appendMessage(`Nice to meet you, ${userName}! How can I assist you?`);
    } else {
        fetch(`${corsProxy}https://api.popcat.xyz/chatbot?msg=${encodeURIComponent(message)}&owner=Marvin+Quillo+Saiko&botname=Kabe`)
        .then(response => response.json())
        .then(data => {
            conversationHistory.push({ sender: 'user', message: message }); 
            conversationHistory.push({ sender: 'kabe', message: data.response }); 
            appendMessage(data.response);
        })
        .catch(error => console.error('Error:', error));
    }

    document.getElementById('kabeInput').value = '';
});

function appendMessage(message) {
    let messagesDiv = document.getElementById( 'messages' );
    messagesDiv.innerHTML = '';
    let messageElement = document.createElement('p');
    messageElement.textContent = message;
    messagesDiv.appendChild(messageElement);
}











document.getElementById( 'ghForm' ).addEventListener( 'submit', function ( event )
{
    event.preventDefault();
    
    let corsProxy = "https://cors-anywhere.herokuapp.com/";

    const username = document.getElementById( 'ghInput' ).value.trim();
    const apiUrl = `${ corsProxy }https://api.popcat.xyz/github/${ username }`;
        

    fetch( apiUrl )
        .then( response => response.json() )
        .then( data =>
        {
            const html = `
                <img src="${ data.avatar }" alt="Avatar" style="width: 100px; height: 100px; border-radius: 50%;">
                <div style="z-index: 99;">
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr);">
                        <p><strong>Name:</strong>  ${ data.name }</p>
                        <p><strong>Account Type:</strong>  ${ data.account_type }</p>
                    </div>
                    <p><strong>Company:</strong>  ${ data.company }</p>
                    <p><strong>Website:</strong>  <a href="${ data.blog }" target="_blank">${ data.blog }</a></p>
                    <p><strong>Location:</strong>  ${ data.location }</p>
                    <p><strong>Email:</strong>  ${ data.email }</p>
                    <p><strong>Bio:</strong>  ${ data.bio }</p>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr);">
                        <p><strong>Twitter:</strong>  ${ data.twitter }</p>
                        <p><strong>Public Repos:</strong>  ${ data.public_repos }</p>
                        <p><strong>Public Gists:</strong>  ${ data.public_gists }</p>
                        <p><strong>Followers:</strong>   ${ data.followers }</p>
                        <p><strong>Following:</strong> ${ data.following }</p>
                    </div>
                    <p><strong>Created At:</strong>  ${ data.created_at }</p>
                    <p><strong>Updated At:</strong>  ${ data.updated_at }</p>
                </div>
            `;
                
            document.getElementById( 'ghpreview' ).innerHTML = html;
        } )
        .catch( error =>
        {
            console.error( 'Error fetching data:', error );
            document.getElementById( 'ghpreview' ).innerHTML = '<p>Error fetching data. Please try again later.</p>';
        } );
} );









document.getElementById('weatherForm').addEventListener('submit', function(event) {
    event.preventDefault();
    let placeName = document.getElementById('weatherInput').value;
    fetchWeather(placeName);
});

function fetchWeather ( placeName )
{
    let corsProxy = "https://cors-anywhere.herokuapp.com/";
    let apiUrl = `${corsProxy}https://api.popcat.xyz/weather?q=` + encodeURIComponent(placeName);

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            displayWeather(data);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });
}

function displayWeather(data) {
    let weather = data[0];

    let weatherPreview = document.getElementById('weatherpreview');
    weatherPreview.innerHTML = `
        <h3>${weather.location.name}</h3>
        <p>Current Temperature: ${weather.current.temperature}°C</p>
        <p>Condition: ${weather.current.skytext}</p>
        <p>Humidity: ${weather.current.humidity}%</p>
        <p>Wind: ${weather.current.winddisplay}</p>
        <img src="${weather.current.imageUrl}" alt="Weather Icon">
    `;

    let forecast = weather.forecast;
    let forecastHTML = '<h4>Forecast:</h4><ul>';
    forecast.forEach(day => {
        forecastHTML += `<li>${day.date}: ${day.skytextday}, High: ${day.high}°C, Low: ${day.low}°C</li>`;
    });
    forecastHTML += '</ul>';

    weatherPreview.innerHTML += forecastHTML;
}









document.getElementById("searchAnythingForm").addEventListener("submit", function(event) {
    event.preventDefault(); 

    var searchQuery = document.getElementById( "searchAnythingInput" ).value.trim();
    let corsProxy = "https://cors-anywhere.herokuapp.com/";

    fetch(`${corsProxy}https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`)
    .then(response => response.text())
    .then(html => {
        var parser = new DOMParser();
        var doc = parser.parseFromString(html, 'text/html');
        
        var searchResults = doc.querySelectorAll('.g');

        var previewDiv = document.getElementById("searchAnythingPreview");
        previewDiv.innerHTML = "";

        for (var i = 0; i < Math.min(searchResults.length, 5); i++) {
            var result = searchResults[i];
            var linkElement = result.querySelector('a');
            var titleElement = result.querySelector('h3');
            var snippetElement = result.querySelector('.s');

            if (linkElement && titleElement && snippetElement) {
                var link = linkElement.href;
                var title = titleElement.innerText;
                var snippet = snippetElement.innerText;

                var resultDiv = document.createElement("div");
                resultDiv.classList.add("searchResult");

                var titleElement = document.createElement("h3");
                titleElement.textContent = title;

                var snippetElement = document.createElement("p");
                snippetElement.textContent = snippet;

                var linkElement = document.createElement("a");
                linkElement.href = link;
                linkElement.textContent = "Read More";

                resultDiv.appendChild(titleElement);
                resultDiv.appendChild(snippetElement);
                resultDiv.appendChild(linkElement);

                previewDiv.appendChild(resultDiv);
            } else {
                console.error("Missing elements in search result:", result);
            }
        }
    })
    .catch(error => console.error('Error fetching search results:', error));
});








