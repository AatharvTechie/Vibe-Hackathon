let menuIcon = document.querySelector(".menu-icon");
let sidebar = document.querySelector(".sidebar");
let container = document.querySelector(".container");

menuIcon.onclick = function () {
  sidebar.classList.toggle("small-sidebar");
  container.classList.toggle("large-container");
};

// Mic setup
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'en-US';
recognition.continuous = false; // We'll manually restart it
recognition.interimResults = false;

let isListening = false; // Flag to check mic state

// Create dialog box element
const dialogBox = document.createElement('div');
dialogBox.classList.add('dialog-box');
dialogBox.setAttribute('id', 'dialogBox');
document.body.appendChild(dialogBox);

// Add styles for dialog box
const style = document.createElement('style');
style.innerHTML = `
.dialog-box {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgb(70, 68, 68);
  padding: 40px;
  color: white;
  border-radius: 8px;
  box-shadow: 0 0 25px rgba(20, 144, 194, 0.7);
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.5s ease-in-out, visibility 0.5s;
  font-size: 18px;
  text-align: center;
  font-weight: bold;
  white-space: pre-wrap;
  z-index: 1000;
  overflow: hidden;
}

.dialog-box::before,
.dialog-box::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 8px;
  box-shadow: 0 0 40px rgba(20, 144, 194, 0.6);
  z-index: -1;
}

.dialog-box.show {
  opacity: 1;
  visibility: visible;
}
`;

document.head.appendChild(style);

// ✅ Only ONE function: typewriter + auto hide
function showDialog(message) {
  const dialog = document.getElementById('dialogBox');
  dialog.textContent = '';
  dialog.classList.add('show');

  let index = 0;

  function typeWriter() {
    if (index < message.length) {
      dialog.textContent += message.charAt(index);
      index++;
      setTimeout(typeWriter, 50);
    } else {
      // After complete message, hide after 1s
      setTimeout(() => {
        dialog.classList.remove('show');
      }, 2000);
    }
  }

  typeWriter();
}

// showDialog("Hey, I am Era — your Advanced AI Assistant! Here to Help You.");
function toggleListening() {
  if (!isListening) {
    isListening = true;
    recognition.start();
    showDialog("Hey, I am Era 🤖 — your Advanced AI Assistant! Here to Help You. " +
      "I am listening");
  } else {
    isListening = false;
    recognition.stop();
    // Optional: showDialog("Mic stopped."); // you can add this if you want feedback
  }
}


recognition.onresult = function (event) {
  const command = event.results[0][0].transcript.toLowerCase();
  console.log("Voice command:", command);

  const searchBox = document.getElementById("searchBox");

  // Search logic
  if (command.includes("search") || command.includes("find")) {
    let movieName = command
      .replace("search for", "")
      .replace("search", "")
      .replace("find the movie", "")
      .replace("find movie", "")
      .replace("find", "")
      .trim();

    if (searchBox) {
      searchBox.focus();
      searchBox.value = movieName;
    }
  }

  // Navigation logic
    const navKeywords = {
      "home": "nav-home",
      "go to home": "nav-home",
      "explore": "nav-explore",
      "go to explore": "nav-explore",
      "subscription": "nav-subs",
      "go to subscription": "nav-subs",
      "library": "nav-library",
      "go to library": "nav-library",
      "history": "nav-history",
      "go to history": "nav-history",
      "playlist": "nav-playlist",
      "go to playlist": "nav-playlist",
      "messages": "nav-messages",
      "go to messages": "nav-messages",
      "show more": "nav-showmore",
      "go to show more": "nav-showmore",
      "notification": "nav-notification",
      "go to notification": "nav-notification",
      "profile": "nav-profile",
      "go to profile": "nav-profile",
      "more": "nav-more",
      "go to more": "nav-more",
      "video": "nav-upload",
      "go to video": "nav-upload",
      "upload": "nav-upload",
      "go to upload": "nav-upload"
    };
    

  for (let keyword in navKeywords) {
    if (command.includes(keyword) || command.includes("go to " + keyword)) {
      handleNavSelection(navKeywords[keyword]);
      break;
    }
  }

  // Handle voice command to play a specific video
  handleVoiceCommand(command);

  // Handle scrolling commands
  if (command.includes("scroll down")) {
    window.scrollBy(0, 500); // Scroll down by 500px
  } else if (command.includes("scroll up")) {
    window.scrollBy(0, -500); // Scroll up by 500px
  }

  // Handle filter by category commands
  handleCategoryFilter(command);
};

recognition.onend = function () {
  if (isListening) {
    recognition.start();
  }
};

function handleNavSelection(navId) {
  resetNavItems();

  const selectedNav = document.getElementById(navId);
  if (!selectedNav) return;

  if (selectedNav.classList.contains("top-icon")) {
    selectedNav.classList.add("active-top-icon");
  } else {
    selectedNav.classList.add("active-nav");
  }

  selectedNav.click();
}

function resetNavItems() {
  // Reset sidebar navs
  document.querySelectorAll(".nav-item").forEach((el) => {
    el.classList.remove("active-nav");
  });

  // Reset top navs
  document.querySelectorAll(".top-icon").forEach((el) => {
    el.classList.remove("active-top-icon");
  });
}

// Render videos
// Hardcoded 20 videos with thumbnails
const sampleVideos = [
  { title: "Video Tutorial 1", channel: "Channel 1", views: "1K views", uploaded: "1 day ago", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", category: "music", thumbnail: "./images/T1.jpeg" },
  { title: "Video Tutorial 2", channel: "Channel 2", views: "1.5K views", uploaded: "2 days ago", videoUrl: "https://www.w3schools.com/html/movie.mp4", category: "live", thumbnail: "./images/T2.jpeg" },
  { title: "Video Tutorial 3", channel: "Channel 3", views: "3K views", uploaded: "3 days ago", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", category: "gaming", thumbnail: "./images/T3.jpeg" },
  { title: "Video Tutorial 4", channel: "Channel 4", views: "2.5K views", uploaded: "4 days ago", videoUrl: "https://www.w3schools.com/html/movie.mp4", category: "news", thumbnail: "./images/T4.jpeg" },
  { title: "Video Tutorial 5", channel: "Channel 5", views: "4K views", uploaded: "5 days ago", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", category: "nature", thumbnail: "./images/T5.jpeg" },
  { title: "Video Tutorial 6", channel: "Channel 6", views: "5K views", uploaded: "6 days ago", videoUrl: "https://www.w3schools.com/html/movie.mp4", category: "tech", thumbnail: "./images/T6.jpeg" },
  { title: "Video Tutorial 7", channel: "Channel 7", views: "6K views", uploaded: "7 days ago", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", category: "music", thumbnail: "./images/T7.jpeg" },
  { title: "Video Tutorial 8", channel: "Channel 8", views: "7K views", uploaded: "8 days ago", videoUrl: "https://www.w3schools.com/html/movie.mp4", category: "live", thumbnail: "./images/T8.jpeg" },
  { title: "Video Tutorial 9", channel: "Channel 9", views: "8K views", uploaded: "9 days ago", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", category: "gaming", thumbnail: "./images/T9.jpeg" },
  { title: "Video Tutorial 10", channel: "Channel 10", views: "9K views", uploaded: "10 days ago", videoUrl: "https://www.w3schools.com/html/movie.mp4", category: "news", thumbnail: "./images/T10.jpeg" },
  { title: "Video Tutorial 11", channel: "Channel 11", views: "10K views", uploaded: "11 days ago", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", category: "nature", thumbnail: "./images/T11.jpeg" },
  { title: "Video Tutorial 12", channel: "Channel 12", views: "11K views", uploaded: "12 days ago", videoUrl: "https://www.w3schools.com/html/movie.mp4", category: "tech", thumbnail: "./images/T12.jpeg" },
  { title: "Video Tutorial 13", channel: "Channel 13", views: "12K views", uploaded: "13 days ago", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", category: "music", thumbnail: "./images/T13.jpeg" },
  { title: "Video Tutorial 14", channel: "Channel 14", views: "13K views", uploaded: "14 days ago", videoUrl: "https://www.w3schools.com/html/movie.mp4", category: "live", thumbnail: "./images/T14.jpeg" },
  { title: "Video Tutorial 15", channel: "Channel 15", views: "14K views", uploaded: "15 days ago", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", category: "gaming", thumbnail: "./images/T15.jpeg" },
  { title: "Video Tutorial 16", channel: "Channel 16", views: "15K views", uploaded: "16 days ago", videoUrl: "https://www.w3schools.com/html/movie.mp4", category: "news", thumbnail: "./images/T16.jpeg" },
  { title: "Video Tutorial 17", channel: "Channel 17", views: "16K views", uploaded: "17 days ago", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", category: "nature", thumbnail: "./images/T17.jpeg" },
  { title: "Video Tutorial 18", channel: "Channel 18", views: "17K views", uploaded: "18 days ago", videoUrl: "https://www.w3schools.com/html/movie.mp4", category: "tech", thumbnail: "./images/T18.jpeg" },
  { title: "Video Tutorial 19", channel: "Channel 19", views: "18K views", uploaded: "19 days ago", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", category: "music", thumbnail: "./images/T19.jpeg" },
  { title: "Video Tutorial 20", channel: "Channel 20", views: "19K views", uploaded: "20 days ago", videoUrl: "https://www.w3schools.com/html/movie.mp4", category: "live", thumbnail: "./images/T20.jpeg" }
];

// Video data with random categories
const categories = ["music", "live", "gaming", "news", "nature", "tech"];
for (let i = 1; i <= 100; i++) {
  sampleVideos.push({
    title: `Video Tutorial ${i}`,
    channel: `Channel ${i}`,
    views: `${Math.floor(Math.random() * 1000)}K views`,
    uploaded: `${Math.floor(Math.random() * 30) + 1} days ago`,
    videoUrl: i % 2 === 0
      ? "https://www.w3schools.com/html/mov_bbb.mp4"
      : "https://www.w3schools.com/html/movie.mp4",
    category: categories[i % categories.length] // Assign category
  });
}

// DOM elements
const videoGrid = document.getElementById("videoGrid");
const videoPlayer = document.getElementById("videoPlayer");
const videoModal = document.getElementById("videoModal");
const statusText = document.getElementById("status");

// Open video in modal
function openModal(videoUrl) {
  videoPlayer.src = videoUrl;
  videoModal.style.display = "flex";
}

// Close modal
function closeModal() {
  videoModal.style.display = "none";
  videoPlayer.pause();
  videoPlayer.currentTime = 0;
}

// Modify the render function to display only the first 20 videos
async function renderVideos(videoList) {
  videoGrid.innerHTML = ""; // Clear previous content

  const limitedVideos = videoList.slice(0, 20);  // Only use the first 20 videos

  if (limitedVideos.length === 0) {
    videoGrid.innerHTML = `<p style="color: red; font-size: 18px;">No videos found for this category.</p>`;
    return;
  }

  for (const video of limitedVideos) {
    const card = document.createElement("div");
    card.className = "video-card";
    card.onclick = () => openModal(video.videoUrl);

    const img = document.createElement("img");
    img.className = "thumbnail";
    img.src = video.thumbnail;  // Use the hardcoded thumbnail

    const info = document.createElement("div");
    info.className = "video-info";

    const title = document.createElement("div");
    title.className = "title";
    title.textContent = video.title;

    const channel = document.createElement("div");
    channel.className = "channel";
    channel.textContent = video.channel;

    const meta = document.createElement("div");
    meta.className = "meta";
    meta.textContent = `${video.views} • ${video.uploaded}`;

    info.appendChild(title);
    info.appendChild(channel);
    info.appendChild(meta);

    card.appendChild(img);
    card.appendChild(info);
    videoGrid.appendChild(card);
  }
}

renderVideos(sampleVideos);  // Render the hardcoded 20 videos


function handleVoiceCommand(command) {
  const userInput = command.toLowerCase().trim();
  const videoElement = document.getElementById("videoPlayer");
  const statusText = document.getElementById("statusText"); // FIXED

  if (!statusText) return;

  const playRegex = /play (?:video )?(?:tutorial )?(\d+)/;
  const playMatch = userInput.match(playRegex);

  if (playMatch) {
    const videoNumber = parseInt(playMatch[1], 10);
    const video = sampleVideos.find(v => v.title === `Video Tutorial ${videoNumber}`);

    if (video) {
      openModal(video.videoUrl);
      videoElement.play();
      statusText.textContent = `Now playing: ${video.title}`;
    } else {
      statusText.textContent = "Video not found!";
    }
    return;
  }

  if (userInput === "stop" || userInput === "stop the video") {
    if (videoElement && !videoElement.paused) {
      videoElement.pause();
      statusText.textContent = "Video paused.";
    } else {
      statusText.textContent = "No video is currently playing.";
    }
    return;
  }

  if (userInput === "start" || userInput === "start the video") {
    if (videoElement && videoElement.paused && videoElement.src) {
      videoElement.play();
      statusText.textContent = "Video resumed.";
    } else {
      statusText.textContent = "No paused video to resume.";
    }
    return;
  }

  if (userInput === "close" || userInput === "close the video") {
    closeModal();
    statusText.textContent = "Video closed.";
    return;
  }
}

// Filter Videos by Category
function filterVideosByCategory(category) {
  if (category === "all") {
    renderVideos(sampleVideos);
  } else {
    const filtered = sampleVideos.filter(v => v.category.toLowerCase() === category);
    renderVideos(filtered);
  }
}

// Handle filter button clicks
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filterCategory = btn.textContent.toLowerCase();
    filterVideosByCategory(filterCategory);
  });
});

// Handle voice command for category filter
function handleCategoryFilter(command) {
  const categoryCommands = ["all", "music", "live", "gaming", "news", "nature", "tech"];
  categoryCommands.forEach(category => {
    if (command.includes(category)) {
      // Update the filter UI to reflect the active category 
      document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.toLowerCase() === category) {
          btn.classList.add('active');
        }
      });

      // Apply the filter
      filterVideosByCategory(category);
    }
  });
}