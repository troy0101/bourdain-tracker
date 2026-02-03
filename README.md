# Bourdain's World - Interactive Restaurant Map

An interactive dashboard to explore and track restaurants visited by Anthony Bourdain across his various shows including "No Reservations," "Parts Unknown," and "The Layover."

## Features

- 🗺️ **Interactive Map**: Visualize all restaurant locations on a world map
- 📍 **Restaurant Details**: Click any location to see detailed information
- ✅ **Personal Checklist**: Track which restaurants you've visited
- 🔍 **Filter Options**: Filter by city and visited status
- 📊 **Progress Tracking**: See your progress with statistics
- 🍴 **Status Indicators**: Know which places are still open
- 🔗 **Reservation Links**: Direct links to reservation pages when available
- 💾 **Local Storage**: Your checklist is saved in your browser

## How to Use

1. **Open the Dashboard**: Simply open `index.html` in your web browser
2. **Explore the Map**: Click on red markers (unvisited) or green markers (visited)
3. **View Details**: Click any marker or restaurant from the list to see full details
4. **Mark as Visited**: Check the "I've been here!" checkbox to track your visits
5. **Filter Restaurants**: Use the city dropdown or status buttons to filter locations
6. **Make Reservations**: For open restaurants, click the reservation link (when available)

## Restaurant Data

The current dataset includes 15 iconic restaurants from Bourdain's travels, including:

- **Les Halles** (New York) - Where Bourdain was executive chef
- **Bun Cha Huong Lien** (Hanoi) - The Obama-Bourdain meal location
- **Sukiyabashi Jiro** (Tokyo) - Three Michelin-starred sushi
- **St. John** (London) - Fergus Henderson's nose-to-tail restaurant
- And many more...

## Customization

### Adding More Restaurants

To add more restaurants, edit the `data.js` file and add new entries to the `restaurants` array:

```javascript
{
    id: 16,
    name: "Restaurant Name",
    city: "City",
    country: "Country",
    address: "Full Address",
    lat: 0.0000, // Latitude
    lng: 0.0000, // Longitude
    show: "Show Name",
    episode: "Episode Name",
    cuisine: "Cuisine Type",
    status: "open", // or "closed" or "unknown"
    description: "Description of the restaurant",
    reservationUrl: "https://...", // Optional
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=..."
}
```

### Updating Restaurant Status

As restaurants open or close, simply update the `status` field in `data.js`:
- `"open"` - Currently operating
- `"closed"` - Permanently closed
- `"unknown"` - Status uncertain

## Technologies Used

- **Leaflet.js** - Interactive mapping library
- **OpenStreetMap** - Map tiles (free, no API key required)
- **Vanilla JavaScript** - No frameworks needed
- **LocalStorage** - Persistent checklist storage

## Browser Compatibility

Works in all modern browsers:
- Chrome/Edge
- Firefox
- Safari
- Opera

## Privacy

All data is stored locally in your browser. No information is sent to external servers.

## Future Enhancements

Potential features to add:
- Search functionality
- More restaurants from all episodes
- Integration with Google Places API for real-time status
- Export/import checklist feature
- Social sharing
- Restaurant photos
- Episode videos/clips

## Contributing

To expand the restaurant database:
1. Watch Bourdain's shows and note restaurant details
2. Find accurate coordinates using Google Maps
3. Verify current status of the restaurant
4. Add to `data.js` following the format above

## Credits

Created in memory of Anthony Bourdain (1956-2018), whose shows inspired millions to explore the world through food and culture.

## License

This is a fan project created for educational and entertainment purposes.
