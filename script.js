// Initialize the map
let map;
let markers = [];
let visitedRestaurants = JSON.parse(localStorage.getItem('visitedRestaurants')) || [];
let wishlistRestaurants = JSON.parse(localStorage.getItem('wishlistRestaurants')) || [];
let currentFilter = 'all';
let currentCountryFilter = 'all';
let currentCityFilter = 'all';
let currentView = 'grid';
let currentUser = null;
let unsubscribeAuth = null;

// Custom marker icons
const defaultIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const visitedIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

function initMap() {
    map = L.map('map').setView([20, 0], 2);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 18,
    }).addTo(map);
    
    updateMarkers();
}

function updateMarkers() {
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];
    
    const filteredRestaurants = restaurants.filter(restaurant => {
        const countryMatch = currentCountryFilter === 'all' || restaurant.country === currentCountryFilter;
        const cityMatch = currentCityFilter === 'all' || restaurant.city === currentCityFilter;
        const statusMatch = currentFilter === 'all' || 
                          (currentFilter === 'visited' && isVisited(restaurant.id)) ||
                          (currentFilter === 'unvisited' && !isVisited(restaurant.id));
        return countryMatch && cityMatch && statusMatch;
    });
    
    filteredRestaurants.forEach(restaurant => {
        const icon = isVisited(restaurant.id) ? visitedIcon : defaultIcon;
        const marker = L.marker([restaurant.lat, restaurant.lng], { icon })
            .addTo(map)
            .bindPopup(createPopupContent(restaurant));
        
        marker.on('click', () => {
            showRestaurantDetails(restaurant);
        });
        
        markers.push(marker);
    });
    
    if (markers.length > 0) {
        const group = L.featureGroup(markers);
        map.fitBounds(group.getBounds().pad(0.1));
    }
}

function createPopupContent(restaurant) {
    return `
        <div class="popup-content">
            <div class="popup-title">${restaurant.name}</div>
            <div class="popup-location">${restaurant.city}, ${restaurant.country}</div>
            <button class="popup-btn" onclick="showRestaurantDetails(${JSON.stringify(restaurant).replace(/"/g, '&quot;')})">
                View Details
            </button>
        </div>
    `;
}

function showRestaurantDetails(restaurant) {
    const modal = document.getElementById('restaurantModal');
    const modalBody = document.getElementById('modalBody');
    
    const statusClass = restaurant.status === 'open' ? 'badge-open' : 'badge-closed';
    const visitedChecked = isVisited(restaurant.id) ? 'checked' : '';
    const wishlistChecked = isWishlisted(restaurant.id) ? 'checked' : '';
    
    let actions = `
        <a href="${restaurant.googleMapsUrl}" target="_blank" class="modal-btn btn-primary">
            View on Google Maps
        </a>
    `;
    
    if (restaurant.status === 'open' && restaurant.reservationUrl) {
        actions += `
            <a href="${restaurant.reservationUrl}" target="_blank" class="modal-btn btn-secondary">
                Visit Website
            </a>
        `;
    }
    
    modalBody.innerHTML = `
        <div class="modal-header-section">
            <h2 class="modal-title">${restaurant.name}</h2>
            <div class="modal-location">${restaurant.city}, ${restaurant.country}</div>
            <div class="modal-badges">
                <span class="modal-badge ${statusClass}">${restaurant.status === 'open' ? 'Currently Open' : restaurant.status === 'closed' ? 'Closed' : 'Unknown'}</span>
                <span class="modal-badge badge-cuisine">${restaurant.cuisine}</span>
            </div>
        </div>
        
        <div class="modal-section">
            <h3 class="modal-section-title">About</h3>
            <p class="modal-text">${restaurant.description}</p>
        </div>
        
        <div class="modal-section">
            <h3 class="modal-section-title">Details</h3>
            <div class="modal-detail-row">
                <span class="modal-detail-label">Show</span>
                <span class="modal-detail-value">${restaurant.show}</span>
            </div>
            <div class="modal-detail-row">
                <span class="modal-detail-label">Episode</span>
                <span class="modal-detail-value">${restaurant.episode}</span>
            </div>
            <div class="modal-detail-row">
                <span class="modal-detail-label">Address</span>
                <span class="modal-detail-value">${restaurant.address}</span>
            </div>
        </div>
        
        <div class="modal-section">
            <h3 class="modal-section-title">Track This Restaurant</h3>
            <div class="track-options">
                <label class="track-option">
                    <input type="radio" name="track-${restaurant.id}" value="none" ${!visitedChecked && !wishlistChecked ? 'checked' : ''}>
                    <span class="track-label">Not tracked</span>
                </label>
                <label class="track-option visited-option">
                    <input type="radio" name="track-${restaurant.id}" value="visited" ${visitedChecked ? 'checked' : ''}>
                    <span class="track-label">✓ I've been here</span>
                </label>
                <label class="track-option wishlist-option">
                    <input type="radio" name="track-${restaurant.id}" value="wishlist" ${wishlistChecked ? 'checked' : ''}>
                    <span class="track-label">⭐ Want to go</span>
                </label>
            </div>
            <button class="modal-btn btn-submit" onclick="submitTracking(${restaurant.id})">
                Save Selection
            </button>
        </div>
        
        <div class="modal-actions">
            ${actions}
        </div>
    `;
    
    modal.classList.add('active');
}

function isVisited(restaurantId) {
    return visitedRestaurants.includes(restaurantId);
}

function isWishlisted(restaurantId) {
    return wishlistRestaurants.includes(restaurantId);
}

function submitTracking(restaurantId) {
    const selectedValue = document.querySelector(`input[name="track-${restaurantId}"]:checked`).value;
    
    // Remove from both lists first
    visitedRestaurants = visitedRestaurants.filter(id => id !== restaurantId);
    wishlistRestaurants = wishlistRestaurants.filter(id => id !== restaurantId);
    
    // Add to appropriate list
    if (selectedValue === 'visited') {
        visitedRestaurants.push(restaurantId);
    } else if (selectedValue === 'wishlist') {
        wishlistRestaurants.push(restaurantId);
    }
    
    // Save to localStorage
    localStorage.setItem('visitedRestaurants', JSON.stringify(visitedRestaurants));
    localStorage.setItem('wishlistRestaurants', JSON.stringify(wishlistRestaurants));
    
    // Save to Firestore if signed in
    if (currentUser && window.firebaseDB) {
        saveToFirestore(currentUser.uid);
    }
    
    // Update UI
    updateStats();
    updateRestaurantGrid();
    if (currentView === 'map') {
        updateMarkers();
    }
    
    // Close modal
    document.getElementById('restaurantModal').classList.remove('active');
    
    // Show success message
    const message = selectedValue === 'visited' ? '✓ Marked as visited!' : 
                    selectedValue === 'wishlist' ? '⭐ Added to wishlist!' : 
                    'Removed from tracking';
    showSyncStatus(message, false);
}

function toggleVisited(restaurantId) {
    const checkbox = document.getElementById(`visited-${restaurantId}`);
    
    if (visitedRestaurants.includes(restaurantId)) {
        visitedRestaurants = visitedRestaurants.filter(id => id !== restaurantId);
        checkbox.checked = false;
    } else {
        visitedRestaurants.push(restaurantId);
        checkbox.checked = true;
    }
    
    // Save to localStorage (always)
    localStorage.setItem('visitedRestaurants', JSON.stringify(visitedRestaurants));
    
    // Save to Firestore if user is signed in
    if (currentUser && window.firebaseDB) {
        saveToFirestore(currentUser.uid);
    }
    
    updateStats();
    updateRestaurantGrid();
    if (currentView === 'map') {
        updateMarkers();
    }
}

function isWishlisted(restaurantId) {
    return wishlistRestaurants.includes(restaurantId);
}

function submitTracking(restaurantId) {
    const selectedValue = document.querySelector(`input[name="track-${restaurantId}"]:checked`).value;
    
    // Remove from both lists first
    visitedRestaurants = visitedRestaurants.filter(id => id !== restaurantId);
    wishlistRestaurants = wishlistRestaurants.filter(id => id !== restaurantId);
    
    // Add to appropriate list
    if (selectedValue === 'visited') {
        visitedRestaurants.push(restaurantId);
    } else if (selectedValue === 'wishlist') {
        wishlistRestaurants.push(restaurantId);
    }
    
    // Save to localStorage
    localStorage.setItem('visitedRestaurants', JSON.stringify(visitedRestaurants));
    localStorage.setItem('wishlistRestaurants', JSON.stringify(wishlistRestaurants));
    
    // Save to Firestore if signed in
    if (currentUser && window.firebaseDB) {
        saveToFirestore(currentUser.uid);
    }
    
    // Update UI
    updateStats();
    updateRestaurantGrid();
    if (currentView === 'map') {
        updateMarkers();
    }
    
    // Close modal
    document.getElementById('restaurantModal').classList.remove('active');
    
    // Show success message
    const message = selectedValue === 'visited' ? '✓ Marked as visited!' : 
                    selectedValue === 'wishlist' ? '⭐ Added to wishlist!' : 
                    'Removed from tracking';
    showSyncStatus(message, false);
}

function updateStats() {
    const visitedCount = visitedRestaurants.length;
    const wishlistCount = wishlistRestaurants.length;
    const totalCount = restaurants.length;
    
    document.getElementById('visitedCount').textContent = visitedCount;
    document.getElementById('wishlistCount').textContent = wishlistCount;
    document.getElementById('totalCount').textContent = totalCount;
}

function populateCountryFilter() {
    const countries = [...new Set(restaurants.map(r => r.country))].sort();
    const countryFilter = document.getElementById('countryFilter');
    
    countries.forEach(country => {
        const option = document.createElement('option');
        option.value = country;
        option.textContent = country;
        countryFilter.appendChild(option);
    });
}

function populateCityFilter(filterByCountry = 'all') {
    const cityFilter = document.getElementById('cityFilter');
    cityFilter.innerHTML = '<option value="all">All Cities</option>';
    
    let cities;
    if (filterByCountry === 'all') {
        cities = [...new Set(restaurants.map(r => r.city))].sort();
    } else {
        cities = [...new Set(restaurants.filter(r => r.country === filterByCountry).map(r => r.city))].sort();
    }
    
    cities.forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        cityFilter.appendChild(option);
    });
}

function updateRestaurantGrid() {
    const container = document.getElementById('restaurantGrid');
    
    const filteredRestaurants = restaurants.filter(restaurant => {
        const countryMatch = currentCountryFilter === 'all' || restaurant.country === currentCountryFilter;
        const cityMatch = currentCityFilter === 'all' || restaurant.city === currentCityFilter;
        const statusMatch = currentFilter === 'all' || 
                          (currentFilter === 'visited' && isVisited(restaurant.id)) ||
                          (currentFilter === 'wishlist' && isWishlisted(restaurant.id)) ||
                          (currentFilter === 'unvisited' && !isVisited(restaurant.id) && !isWishlisted(restaurant.id));
        return countryMatch && cityMatch && statusMatch;
    });
    
    filteredRestaurants.sort((a, b) => {
        // First sort by status (open first, closed last)
        if (a.status !== b.status) {
            return a.status === 'open' ? -1 : 1;
        }
        // Then by country
        if (a.country !== b.country) return a.country.localeCompare(b.country);
        // Then by city
        if (a.city !== b.city) return a.city.localeCompare(b.city);
        // Finally by name
        return a.name.localeCompare(b.name);
    });
    
    container.innerHTML = filteredRestaurants.map(restaurant => {
        const statusClass = restaurant.status === 'open' ? 'badge-open' : 'badge-closed';
        const visitedClass = isVisited(restaurant.id) ? 'visited' : '';
        const wishlistClass = isWishlisted(restaurant.id) ? 'wishlist' : '';
        
        const cardImage = restaurant.logoUrl ? 
            `<div class="card-image" style="background-image: url('${restaurant.logoUrl}'); background-size: cover; background-position: center;"></div>` :
            `<div class="card-image">🍴</div>`;
        
        return `
            <div class="restaurant-card ${visitedClass} ${wishlistClass}" data-status="${restaurant.status}" onclick="showRestaurantDetails(${JSON.stringify(restaurant).replace(/"/g, '&quot;')})">
                ${cardImage}
                <div class="card-content">
                    <div class="card-header">
                        <h3 class="card-title">${restaurant.name}</h3>
                        <div class="card-location">${restaurant.city}, ${restaurant.country}</div>
                    </div>
                    <div class="card-meta">
                        <span class="card-badge ${statusClass}">${restaurant.status === 'open' ? 'Currently Open' : 'Closed'}</span>
                        <span class="card-badge badge-cuisine">${restaurant.cuisine}</span>
                    </div>
                    <div class="card-show">${restaurant.show}</div>
                </div>
            </div>
        `;
    }).join('');
}

function switchView(view) {
    currentView = view;
    const gridView = document.getElementById('gridView');
    const mapView = document.getElementById('mapView');
    const viewBtns = document.querySelectorAll('.view-btn');
    
    viewBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === view);
    });
    
    if (view === 'grid') {
        gridView.style.display = 'block';
        mapView.style.display = 'none';
    } else {
        gridView.style.display = 'none';
        mapView.style.display = 'block';
        if (!map) {
            initMap();
        } else {
            setTimeout(() => {
                map.invalidateSize();
                updateMarkers();
            }, 100);
        }
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    initializeAuth();
    populateCountryFilter();
    populateCityFilter();
    updateStats();
    updateRestaurantGrid();
    
    // Country filter
    document.getElementById('countryFilter').addEventListener('change', (e) => {
        currentCountryFilter = e.target.value;
        currentCityFilter = 'all';
        populateCityFilter(currentCountryFilter);
        updateRestaurantGrid();
        if (currentView === 'map' && map) {
            updateMarkers();
        }
    });
    
    // City filter
    document.getElementById('cityFilter').addEventListener('change', (e) => {
        currentCityFilter = e.target.value;
        updateRestaurantGrid();
        if (currentView === 'map' && map) {
            updateMarkers();
        }
    });
    
    // Status filter chips
    document.querySelectorAll('.filter-chip').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-chip').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter = e.target.dataset.filter;
            updateRestaurantGrid();
            if (currentView === 'map' && map) {
                updateMarkers();
            }
        });
    });
    
    // View toggle
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const view = e.currentTarget.dataset.view;
            switchView(view);
        });
    });
    
    // Modal close
    const modal = document.getElementById('restaurantModal');
    const closeBtn = document.querySelector('.modal-close');
    const overlay = document.querySelector('.modal-overlay');
    
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });
    
    overlay.addEventListener('click', () => {
        modal.classList.remove('active');
    });
});

// Make functions globally accessible
window.showRestaurantDetails = showRestaurantDetails;
window.toggleVisited = toggleVisited;
window.submitTracking = submitTracking;
window.submitTracking = submitTracking;

// ==================== FIREBASE AUTHENTICATION ====================

function initializeAuth() {
    if (!window.firebaseAuth) {
        console.log('Firebase not configured. Using localStorage only.');
        return;
    }

    const signInBtn = document.getElementById('signInBtn');
    const signOutBtn = document.getElementById('signOutBtn');
    const userInfo = document.getElementById('userInfo');

    // Sign in with Google
    signInBtn.addEventListener('click', async () => {
        try {
            const provider = new firebase.auth.GoogleAuthProvider();
            await firebase.auth().signInWithPopup(provider);
            showSyncStatus('✓ Signed in successfully', false);
        } catch (error) {
            console.error('Sign in error:', error);
            showSyncStatus('✗ Sign in failed', true);
        }
    });

    // Sign out
    signOutBtn.addEventListener('click', async () => {
        try {
            await firebase.auth().signOut();
            showSyncStatus('✓ Signed out', false);
        } catch (error) {
            console.error('Sign out error:', error);
        }
    });

    // Listen for auth state changes
    unsubscribeAuth = firebase.auth().onAuthStateChanged(async (user) => {
        currentUser = user;
        
        if (user) {
            // User signed in
            signInBtn.style.display = 'none';
            userInfo.style.display = 'flex';
            document.getElementById('userName').textContent = user.displayName || 'User';
            document.getElementById('userPhoto').src = user.photoURL || 'https://via.placeholder.com/40';
            
            // Load visited restaurants from Firestore
            await loadVisitedFromFirestore(user.uid);
            showSyncStatus('✓ Synced with cloud', false);
        } else {
            // User signed out
            signInBtn.style.display = 'flex';
            userInfo.style.display = 'none';
            
            // Load from localStorage
            visitedRestaurants = JSON.parse(localStorage.getItem('visitedRestaurants')) || [];
            updateStats();
            updateRestaurantGrid();
            if (currentView === 'map' && map) {
                updateMarkers();
            }
        }
    });
}

async function loadVisitedFromFirestore(uid) {
    if (!window.firebaseDB) return;
    
    try {
        const docRef = firebase.firestore().collection('users').doc(uid);
        const doc = await docRef.get();
        
        if (doc.exists) {
            const data = doc.data();
            visitedRestaurants = data.visitedRestaurants || [];
            wishlistRestaurants = data.wishlistRestaurants || [];
        } else {
            // First time sign in - migrate localStorage data
            visitedRestaurants = JSON.parse(localStorage.getItem('visitedRestaurants')) || [];
            wishlistRestaurants = JSON.parse(localStorage.getItem('wishlistRestaurants')) || [];
            if (visitedRestaurants.length > 0 || wishlistRestaurants.length > 0) {
                await saveToFirestore(uid);
                showSyncStatus('✓ Migrated local data to cloud', false);
            }
        }
        
        updateStats();
        updateRestaurantGrid();
        if (currentView === 'map' && map) {
            updateMarkers();
        }
    } catch (error) {
        console.error('Error loading from Firestore:', error);
        showSyncStatus('✗ Failed to load from cloud', true);
    }
}

async function saveToFirestore(uid) {
    if (!window.firebaseDB || !uid) return;
    
    try {
        await firebase.firestore().collection('users').doc(uid).set({
            visitedRestaurants: visitedRestaurants,
            wishlistRestaurants: wishlistRestaurants,
            lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
    } catch (error) {
        console.error('Error saving to Firestore:', error);
        showSyncStatus('✗ Failed to sync', true);
    }
}

function showSyncStatus(message, isError) {
    const existingStatus = document.querySelector('.sync-status');
    if (existingStatus) {
        existingStatus.remove();
    }
    
    const status = document.createElement('div');
    status.className = 'sync-status' + (isError ? ' error' : '');
    status.textContent = message;
    document.body.appendChild(status);
    
    setTimeout(() => {
        status.remove();
    }, 3000);
}
