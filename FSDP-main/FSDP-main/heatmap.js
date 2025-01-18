const map = L.map('map').setView([1.3521, 103.8198], 12); // Initial view for Singapore

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Fetch heatmap data from the backend API
fetch('/api/heatmap-data')
    .then(response => {
        if (!response.ok) {
            throw new Error(`Network error: ${response.status} - ${response.statusText}`);
        }
        return response.json(); // Parse JSON response
    })
    .then(data => {
        console.log("Raw Heatmap data fetched:", data);

        // Validate and filter data to ensure valid latitude and longitude
        const filteredData = data.filter(point => point.latitude && point.longitude);
        if (filteredData.length === 0) {
            console.warn("No valid heatmap data points available.");
            return;
        }

        console.log("Filtered Heatmap data:", filteredData);

        // Add markers to the map with popups and zoom functionality
        filteredData.forEach(point => {
            const marker = L.marker([point.latitude, point.longitude]).addTo(map);

            // Add popup content with complete information
            const popupContent = `
                <b>ID:</b> ${point.id || 'N/A'}<br>
                <b>Scam Type:</b> ${point.scam_type || 'N/A'}<br>
                <b>Description:</b> ${point.description || 'N/A'}<br>
                <b>Latitude:</b> ${point.latitude}<br>
                <b>Longitude:</b> ${point.longitude}<br>
                <b>Timestamp:</b> ${point.timestamp || 'N/A'}
            `;
            marker.bindPopup(popupContent);

            // Zoom into the location when the marker is clicked
            marker.on('click', () => {
                map.setView([point.latitude, point.longitude], 15);
            });

            // Show popup on hover
            marker.on('mouseover', () => {
                marker.openPopup();
            });

            marker.on('mouseout', () => {
                marker.closePopup();
            });
        });

        // Prepare heatmap points with amplified intensity
        const heatmapPoints = filteredData.map(point => [
            point.latitude,
            point.longitude,
            point.intensity || 1 // Default intensity to 1 if undefined
        ]);
        console.log("Heatmap points for rendering:", heatmapPoints);

        // Add heatmap layer with configuration
        L.heatLayer(heatmapPoints, {
            radius: 30,       // Adjusted radius for heatmap circles
            blur: 2,          // Reduced blur for sharper heatmap circles
            maxZoom: 12,      // Set maximum zoom for heatmap rendering
            maxOpacity: 1.0,  // Ensure heatmap colors are fully opaque
            gradient: {       // Define gradient colors for heatmap
                0.1: '#440000',
                0.4: '#880000',
                0.6: '#cc0000',
                0.8: '#ff3300',
                1.0: '#ff6600'
            }
        }).addTo(map);

        // Adjust map to fit all heatmap points
        const bounds = L.latLngBounds(filteredData.map(point => [point.latitude, point.longitude]));
        map.fitBounds(bounds);
    })
    .catch(err => console.error("Error loading heatmap data:", err));
