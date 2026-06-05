/* main.js monblanproject*/

// Profile data
var PROFILE = {
  followers: 11787,
  following: 112,
};

// Helpers
function formatDate(d) {
  if (!d) return "";
  var dd = String(d.getDate()).padStart(2, "0");
  var mm = String(d.getMonth() + 1).padStart(2, "0");
  return dd + "-" + mm + "-" + d.getFullYear();
}

// Mock data - 1 post per day for 2016–2030
var ALL_POSTS = (function () {
  var posts = [];
  var id = 0;
  var cur = new Date(2016, 0, 1);
  var end = new Date();
  end.setHours(0, 0, 0, 0);
  while (cur <= end) {
    posts.push({
      id: id,
      thumb: "https://picsum.photos/seed/" + ((id % 200) + 10) + "/203/203",
      postDate: new Date(cur),
      likes: Math.floor(Math.random() * 200) + 10,
      comments: Math.floor(Math.random() * 50) + 1,
      likesTo: Math.floor(Math.random() * 200) + 10,
      commentsTo: Math.floor(Math.random() * 50) + 1,
      uploadDate: new Date(cur),
      type: "Image upload",
    });
    cur.setDate(cur.getDate() + 1);
    id++;
  }
  return posts;
})();

// State
var fromDate = null;
var toDate = null;
var visibleCount = 9;

// DOM refs
var postList = document.getElementById("post-list");
var btnLoad = document.getElementById("btn-load");
var clearFrom = document.getElementById("clear-from");
var clearTo = document.getElementById("clear-to");

// Filter
function getFiltered() {
  return ALL_POSTS.filter(function (p) {
    if (fromDate && p.postDate < fromDate) return false;
    if (toDate && p.postDate > toDate) return false;
    return true;
  });
}

// Icons
function heartIcon() {
  return '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>';
}

function commentIcon() {
  return '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.5 3C16.5 2.175 15.825 1.5 15 1.5H3C2.175 1.5 1.5 2.175 1.5 3V12C1.5 12.825 2.175 13.5 3 13.5H13.5L16.5 16.5V3Z" fill="currentColor"/></svg>';
}

// Render
function postRowHTML(p) {
  var toStats = toDate
    ? `<div class="post-date">${formatDate(toDate)}</div>
       <div class="post-stats">
         <span>${heartIcon()} ${p.likesTo}</span>
         <span>${commentIcon()} ${p.commentsTo}</span>
       </div>`
    : ``;

  return `
    <div class="post-row">
      <img class="post-thumb" src="${p.thumb}" alt="post ${p.id}" loading="lazy"/>
      <div class="post-row__stats-row">
        <div class="post-meta">
          <span class="post-date-top">Today</span>
          <div class="post-stats">
            <span>${heartIcon()} ${p.likes}</span>
            <span>${commentIcon()} ${p.comments}</span>
          </div>
        </div>
        <div class="post-right">
          ${toStats}
        </div>
      </div>
      <div class="post-upload">
        <div class="post-type">${p.type}</div>
        <div class="post-upload-date">${formatDate(p.uploadDate)}</div>
      </div>
    </div>
  `;
}

function renderPosts() {
  var filtered = getFiltered();
  var posts = filtered.slice(0, visibleCount);
  postList.innerHTML = posts.length
    ? posts.map(postRowHTML).join("")
    : '<p style="padding:20px;color:#8a9aaa;text-align:center">No posts in the selected range</p>';
  btnLoad.style.display =
    filtered.length > visibleCount ? "inline-block" : "none";
  var statPosts = document.querySelector('.stat-posts');
  var statFollowers = document.querySelector('.stat-followers');
  var statFollowing = document.querySelector('.stat-following');
  if (statPosts) statPosts.textContent = filtered.length;
  if (statFollowers) statFollowers.textContent = PROFILE.followers.toLocaleString('en-US');
  if (statFollowing) statFollowing.textContent = PROFILE.following;
}

// Flatpickr - from
var fpFrom = flatpickr("#date-from", {
  dateFormat: "d_m_Y",
  appendTo: document.querySelector('.header'),
  minDate: new Date(2016, 0, 1),
  maxDate: new Date(),
  monthSelectorType: "static",
  prevArrow: '«',
  nextArrow: '»',
  locale: {
    weekdays: {
      shorthand: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
      longhand: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    }
  },
  onChange: function (sel) {
    fromDate = sel[0] || null;
    clearFrom.classList.toggle("visible", !!sel[0]);
    visibleCount = 9;
    renderPosts();
  },
});

// Flatpickr - to
var fpTo = flatpickr("#date-to", {
  dateFormat: "d_m_Y",
  appendTo: document.querySelector('.header'),
  minDate: new Date(2016, 0, 1),
  maxDate: new Date(),
  monthSelectorType: "static",
  prevArrow: '«',
  nextArrow: '»',
  locale: {
    weekdays: {
      shorthand: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
      longhand: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    }
  },
  onChange: function (sel) {
    toDate = sel[0] || null;
    clearTo.classList.toggle("visible", !!sel[0]);
    visibleCount = 9;
    renderPosts();
  },
});

// Calendar icon handlers
document
  .querySelector("#wrap-from .icon-cal")
  .addEventListener("click", function () {
    fpFrom.open();
  });
document
  .querySelector("#wrap-to  .icon-cal")
  .addEventListener("click", function () {
    fpTo.open();
  });

// Clear handlers
clearFrom.addEventListener("click", function () {
  fpFrom.clear();
  fromDate = null;
  clearFrom.classList.remove("visible");
  visibleCount = 9;
  renderPosts();
});

clearTo.addEventListener("click", function () {
  fpTo.clear();
  toDate = null;
  clearTo.classList.remove("visible");
  visibleCount = 9;
  renderPosts();
});

// Load more
btnLoad.addEventListener("click", function () {
  visibleCount += 9;
  renderPosts();
});

// View toggle
function setView(view, btn) {
  document.querySelectorAll(".view-btn").forEach(function (b) {
    b.classList.remove("active");
  });
  btn.classList.add("active");
  if (view === "grid") {
    postList.classList.add("grid-view");
  } else {
    postList.classList.remove("grid-view");
  }
}

window.setView = setView;

// Init
renderPosts();