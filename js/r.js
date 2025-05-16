const params = new URLSearchParams(window.location.search);
const query = params.get('q');
const tab = params.get('tab') || 'all';
document.getElementById('searchInput').value = query;

const apiKey = 'AIzaSyDkI6P2MlllYSxUvIrzUNNqEqxaIIguqts';
const cx = '474461176441b4282';
let startIndex = 1;
let isLoading = false;

document.getElementById('searchForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const newQuery = document.getElementById('searchInput').value;
  window.location.href = `result.html?q=${encodeURIComponent(newQuery)}&tab=${tab}`;
});

function showLoading() {
  isLoading = true;
  const loadMoreBtn = document.getElementById('loadMore');
  loadMoreBtn.disabled = true;
  loadMoreBtn.innerHTML = '<div class="ldsp"><span class="lds"></span><p>Loading...</p></div>';
}

function hideLoading() {
  isLoading = false;
  const loadMoreBtn = document.getElementById('loadMore');
  loadMoreBtn.disabled = false;
  loadMoreBtn.textContent = 'Load More';
}

function fetchResults() {
  if (isLoading) return;
  
  showLoading();
  
  const url = new URL('https://www.googleapis.com/customsearch/v1');
  url.searchParams.set('key', apiKey);
  url.searchParams.set('cx', cx);
  url.searchParams.set('q', query);
  url.searchParams.set('start', startIndex);
  if (tab === 'images') url.searchParams.set('searchType', 'image');
  
  navigator.geolocation.getCurrentPosition(pos => {
    url.searchParams.set('gl', 'in');
    url.searchParams.set('location', `${pos.coords.latitude},${pos.coords.longitude}`);
    
    fetch(url)
      .then(res => res.json())
      .then(data => {
        hideLoading();
        if (!data.items || data.items.length === 0) {
          if (startIndex === 1) {
            document.getElementById('results').innerHTML = '<p>No results found.</p>';
          } else {
            document.getElementById('loadMore').style.display = 'none';
          }
          return;
        }
        renderResults(data.items);
        startIndex += 10;
        
        // Show or hide load more button based on whether there might be more results
        if (data.items.length < 10) {
          document.getElementById('loadMore').style.display = 'none';
        }
      })
      .catch(err => {
        hideLoading();
        document.getElementById('results').innerHTML += '<p>Error fetching  results.</p>';
      });
    
  }, () => {
    url.searchParams.set('gl', 'in');
    fetch(url)
      .then(res => res.json())
      .then(data => {
        hideLoading();
        if (!data.items || data.items.length === 0) {
          if (startIndex === 1) {
            document.getElementById('results').innerHTML = '<p>No results found.</p>';
          } else {
            document.getElementById('loadMore').style.display = 'none';
          }
          return;
        }
        renderResults(data.items);
        startIndex += 10;
        
        if (data.items.length < 10) {
          document.getElementById('loadMore').style.display = 'none';
        }
      })
      .catch(err => {
        hideLoading();
        document.getElementById('results').innerHTML += '<p>Error fetching results.</p>';
      });
  });
}

function renderResults(items) {
  const container = document.getElementById('results');
  items.forEach(item => {
    const div = document.createElement('div');
    div.className = 'result';
    const thumb = item.pagemap?.cse_thumbnail?.[0]?.src;
    const imgHTML = thumb ? `<img src="${thumb}" class="thumbnail"/>` : '';
    div.innerHTML = `
            ${imgHTML}
            <a href="${item.link}" target="_blank">${item.title}</a><br>
            <p style="display: inline-block; max-width: 30ch; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;font-size:12px;color:#ffffff;">${item.link}</p>
            <p>${item.snippet}</p>
        `;
    container.appendChild(div);
  });
}

// Initial load
document.getElementById('loadMore').addEventListener('click', fetchResults);
fetchResults();


//offline
  function updateOnlineStatus() {
    const offlineMsg = document.getElementById('ofm');
    const loadMoreBtn = document.getElementById('loadMore');

    if (!navigator.onLine) {
      offlineMsg.style.display = 'block';
      loadMoreBtn.style.display = 'none';
    } else {
      offlineMsg.style.display = 'none';
      // Only show Load More if results exist
      if (document.getElementById('results').children.length > 0) {
        loadMoreBtn.style.display = 'block';
      }
    }
  }
  window.addEventListener('load', updateOnlineStatus);
  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);

