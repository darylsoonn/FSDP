


// Initialize the map 
const map = L.map('map').setView([1.3521, 103.8198], 2); // Set zoom level to 2 for a global view 
 
// Add OpenStreetMap tiles 
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { 
    attribution: '© OpenStreetMap contributors', 
}).addTo(map); 
 
// Function to fetch and display heatmap data 
const fetchHeatmapData = (filters = {}) => { 
    const query = new URLSearchParams(filters).toString(); // Convert filters to query string 
 
    // Log the generated API endpoint for debugging 
    console.log(`/api/heatmap-data?${query}`); 
 
    fetch(`/api/heatmap-data?${query}`) 
        .then((response) => { 
            if (!response.ok) { 
                throw new Error(`Network error: ${response.status} - ${response.statusText}`); 
            } 
            return response.json(); // Parse JSON response 
        }) 
        .then((data) => { 
            console.log("Raw Heatmap data fetched:", data); 
 
            // Clear existing layers from the map (except the tile layer) 
            map.eachLayer((layer) => { 
                if (!(layer instanceof L.TileLayer)) { 
                    map.removeLayer(layer); 
                } 
            }); 
 
            // Validate and filter data to ensure valid latitude and longitude 
            const filteredData = data.filter((point) => point.latitude && point.longitude); 
 
            if (filteredData.length === 0) { 
                console.warn("No valid heatmap data points available."); 
                alert("No results found for the selected filters."); 
                return; 
            } 
 
            console.log("Filtered Heatmap data:", filteredData); 
 
            // Add markers to the map with popups and zoom functionality 
            filteredData.forEach((point) => { 
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
            const heatmapPoints = filteredData.map((point) => [ 
                point.latitude, 
                point.longitude, 
                point.intensity ? point.intensity * 2 : 1.0, // Amplify intensity for better visibility 
            ]); 
 
            console.log("Heatmap points for rendering:", heatmapPoints); 
 
            // Add heatmap layer with configuration 
            L.heatLayer(heatmapPoints, { 
                radius: 50, // Larger radius for better visibility in global view 
                blur: 30,   // More blur to avoid overlapping 
                maxZoom: 12, // Set maximum zoom for heatmap rendering 
                gradient: { // Define gradient colors for heatmap 
                    0.1: '#006400', // Dark green for low intensity 
                    0.3: '#ffcc00', // Yellow for medium-low intensity 
                    0.5: '#ff6600', // Orange for medium intensity 
                    0.8: '#ff0000', // Red for high intensity 
                    1.0: '#800000', // Dark red for very high intensity


}, 
            }).addTo(map); 
 
            // Adjust map to fit all heatmap points 
            const bounds = L.latLngBounds(filteredData.map((point) => [point.latitude, point.longitude])); 
            map.fitBounds(bounds); 
        }) 
        .catch((err) => { 
            console.error("Error loading heatmap data:", err); 
            alert("Failed to load heatmap data. Please try again."); 
        }); 
}; 
 
// Function to fetch and display OCBC branches 
const fetchOcbcBranches = () => { 
    fetch('/api/ocbc-branches') 
    .then((response) => { 
        if (!response.ok) { 
            throw new Error(`Network error: ${response.status} - ${response.statusText}`); 
        } 
        return response.json(); 
    }) 
    .then((branches) => { 
        console.log("Fetched OCBC Branch data:", branches); 
 
        // Clear existing layers from the map (except the tile layer) 
        map.eachLayer((layer) => { 
            if (!(layer instanceof L.TileLayer)) { 
                map.removeLayer(layer); 
            } 
        }); 
 
        // Add markers for branches 
        branches.forEach((branch) => { 
            const marker = L.marker([branch.latitude, branch.longitude], { 
                icon: L.divIcon({ 
                    className: 'custom-div-icon', 
                    html: '<div style="background-color: red; width: 15px; height: 15px; border-radius: 50%;"></div>', 
                    iconSize: [15, 15], 
                    iconAnchor: [7.5, 7.5], 
                }), 
            }).addTo(map); 
 
            marker.bindPopup(` 
                <b>Branch Name:</b> ${branch.name}<br> 
                <b>Address:</b> ${branch.address}<br> 
                <b>Opening Hours:</b> ${branch.openingHours}<br> 
                <b>Remarks:</b> ${branch.remark} 
            `); 
        }); 
 
        // Fit map to markers 
        const bounds = L.latLngBounds(branches.map((branch) => [branch.latitude, branch.longitude])); 
        map.fitBounds(bounds); 
    }) 
    .catch((err) => { 
        console.error("Error loading OCBC branches:", err); 
        alert("Failed to load OCBC branches. Please try again."); 
    }); 
}; 
 
// Button event listeners for toggling between heatmap and OCBC branches 
document.getElementById("applyFilters").addEventListener("click", () => { 
    const startDate = document.getElementById("startDate").value; 
    const endDate = document.getElementById("endDate").value; 
    const scamType = document.getElementById("scamType").value; 
 
    // Call fetchHeatmapData with filters 
    fetchHeatmapData({ startDate, endDate, scamType }); 
}); 
 
// Add event listeners for switching between sections 
document.getElementById("scamHeatButton").addEventListener("click", () => { 
    document.getElementById("filters").style.display = "block"; // Show filters for heatmap 
    fetchHeatmapData(); 
}); 
 
document.getElementById("ocbcBranchesButton").addEventListener("click", () => { 
    document.getElementById("filters").style.display = "none"; // Hide filters for branches 
    fetchOcbcBranches(); 
}); 
 
// Fetch and display initial heatmap data (default view) 
fetchHeatmapData();

