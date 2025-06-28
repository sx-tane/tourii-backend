# 🎯 Frontend Integration Guide - 3-Step Route Discovery

## Complete Implementation Guide for Frontend Developers

### 🌟 User Experience Flow

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  1. REGION      │ --> │  2. INTERESTS   │ --> │  3. ROUTES      │
│  SELECTION      │     │  (HASHTAGS)     │     │  DISCOVERY      │
└─────────────────┘     └─────────────────┘     └─────────────────┘
     "Where?"              "What interests?"       "Your routes!"
```

---

## 📱 Complete React/Next.js Implementation

### **Step 1: Region Selection Component**

```tsx
// components/RegionSelector.tsx
import { useState, useEffect } from 'react';

interface Region {
  name: string;
  routeCount: number;
  popularHashtags: string[];
}

export function RegionSelector({ onRegionSelect }: { onRegionSelect: (region: string) => void }) {
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAvailableRegions();
  }, []);

  const fetchAvailableRegions = async () => {
    try {
      // API Call: GET /routes
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/routes`, {
        headers: {
          'x-api-key': process.env.NEXT_PUBLIC_API_KEY,
          'accept-version': '1.0.0'
        }
      });
      
      const routes = await response.json();
      
      // Extract and count regions
      const regionMap = new Map<string, Set<string>>();
      routes.forEach(route => {
        if (route.region) {
          if (!regionMap.has(route.region)) {
            regionMap.set(route.region, new Set());
          }
          // Collect hashtags for preview
          route.touristSpotList?.forEach(spot => {
            spot.touristSpotHashtag?.forEach(tag => {
              regionMap.get(route.region).add(tag);
            });
          });
        }
      });

      // Transform to Region objects
      const regionData: Region[] = Array.from(regionMap.entries()).map(([name, hashtags]) => ({
        name,
        routeCount: routes.filter(r => r.region === name).length,
        popularHashtags: Array.from(hashtags).slice(0, 3)
      }));

      setRegions(regionData.sort((a, b) => b.routeCount - a.routeCount));
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch regions:', error);
      setLoading(false);
    }
  };

  return (
    <div className="region-selector">
      <h2>🗾 Where do you want to explore?</h2>
      <p>Select a region to discover personalized routes</p>
      
      {loading ? (
        <div className="loading">Loading regions...</div>
      ) : (
        <div className="region-grid">
          {regions.map((region) => (
            <button
              key={region.name}
              onClick={() => onRegionSelect(region.name)}
              className="region-card"
            >
              <h3>{region.name}</h3>
              <p>{region.routeCount} routes available</p>
              <div className="hashtag-preview">
                {region.popularHashtags.map(tag => (
                  <span key={tag} className="mini-tag">#{tag}</span>
                ))}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
```

### **Step 2: Interest Selection Component (Hashtags)**

```tsx
// components/InterestSelector.tsx
import { useState, useEffect } from 'react';

interface HashtagOption {
  name: string;
  count: number;
  category?: string;
}

interface InterestSelectorProps {
  region: string;
  onInterestsSelect: (interests: string[]) => void;
}

export function InterestSelector({ region, onInterestsSelect }: InterestSelectorProps) {
  const [hashtags, setHashtags] = useState<HashtagOption[]>([]);
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRegionalHashtags();
  }, [region]);

  const fetchRegionalHashtags = async () => {
    try {
      // API Call: POST /ai/routes/hashtags/available
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/routes/hashtags/available`, {
        method: 'POST',
        headers: {
          'x-api-key': process.env.NEXT_PUBLIC_API_KEY,
          'accept-version': '1.0.0',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ region })
      });

      const data = await response.json();
      
      // Categorize hashtags for better UX
      const categorizedHashtags = data.topHashtags.map(tag => ({
        ...tag,
        category: getHashtagCategory(tag.hashtag)
      }));

      setHashtags(categorizedHashtags);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch hashtags:', error);
      setLoading(false);
    }
  };

  const getHashtagCategory = (hashtag: string): string => {
    const categories = {
      food: ['food', 'ramen', 'sushi', 'restaurant', 'cafe', 'グルメ'],
      culture: ['temple', 'shrine', 'traditional', 'history', '寺', '神社'],
      nature: ['nature', 'park', 'mountain', 'beach', '自然', '公園'],
      activity: ['shopping', 'nightlife', 'entertainment', 'anime', 'manga'],
      relaxation: ['onsen', 'spa', 'relax', '温泉']
    };

    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => hashtag.toLowerCase().includes(keyword))) {
        return category;
      }
    }
    return 'other';
  };

  const toggleHashtag = (hashtag: string) => {
    setSelectedHashtags(prev => 
      prev.includes(hashtag) 
        ? prev.filter(h => h !== hashtag)
        : [...prev, hashtag]
    );
  };

  const handleContinue = () => {
    if (selectedHashtags.length > 0) {
      onInterestsSelect(selectedHashtags);
    }
  };

  return (
    <div className="interest-selector">
      <h2>🎯 What interests you in {region}?</h2>
      <p>Select hashtags that match your interests (choose at least 1)</p>

      {loading ? (
        <div className="loading">Loading interests...</div>
      ) : (
        <>
          <div className="hashtag-categories">
            {['food', 'culture', 'nature', 'activity', 'relaxation'].map(category => {
              const categoryTags = hashtags.filter(h => h.category === category);
              if (categoryTags.length === 0) return null;

              return (
                <div key={category} className="category-section">
                  <h4>{category.charAt(0).toUpperCase() + category.slice(1)}</h4>
                  <div className="hashtag-list">
                    {categoryTags.map(hashtag => (
                      <button
                        key={hashtag.name}
                        onClick={() => toggleHashtag(hashtag.name)}
                        className={`hashtag-chip ${
                          selectedHashtags.includes(hashtag.name) ? 'selected' : ''
                        }`}
                      >
                        #{hashtag.name} ({hashtag.count})
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="selection-summary">
            <p>Selected: {selectedHashtags.length} interests</p>
            <button 
              onClick={handleContinue}
              disabled={selectedHashtags.length === 0}
              className="continue-button"
            >
              Find Routes →
            </button>
          </div>
        </>
      )}
    </div>
  );
}
```

### **Step 3: Route Discovery Component**

```tsx
// components/RouteDiscovery.tsx
import { useState } from 'react';

interface RouteDiscoveryProps {
  region: string;
  interests: string[];
}

interface RouteOptions {
  proximityRadiusKm: number;
  maxRoutes: number;
  minSpotsPerCluster: number;
  maxSpotsPerCluster: number;
}

export function RouteDiscovery({ region, interests }: RouteDiscoveryProps) {
  const [options, setOptions] = useState<RouteOptions>({
    proximityRadiusKm: 50,
    maxRoutes: 5,
    minSpotsPerCluster: 2,
    maxSpotsPerCluster: 8
  });
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const searchRoutes = async () => {
    setLoading(true);
    try {
      // API Call: POST /ai/routes/recommendations
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/routes/recommendations`, {
        method: 'POST',
        headers: {
          'x-api-key': process.env.NEXT_PUBLIC_API_KEY,
          'accept-version': '1.0.0',
          'x-user-id': getUserId(), // Optional for rate limiting
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          keywords: interests,
          mode: 'any', // or 'all' for strict matching
          region: region,
          ...options
        })
      });

      const data = await response.json();
      setResults(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch routes:', error);
      setLoading(false);
    }
  };

  return (
    <div className="route-discovery">
      <h2>🗺️ Customize Your Route Discovery</h2>
      
      {/* Options Panel */}
      <div className="options-panel">
        <div className="option-group">
          <label>Search Radius</label>
          <input
            type="range"
            min="10"
            max="100"
            value={options.proximityRadiusKm}
            onChange={(e) => setOptions({...options, proximityRadiusKm: parseInt(e.target.value)})}
          />
          <span>{options.proximityRadiusKm} km</span>
        </div>

        <div className="option-group">
          <label>Maximum Routes</label>
          <select 
            value={options.maxRoutes}
            onChange={(e) => setOptions({...options, maxRoutes: parseInt(e.target.value)})}
          >
            {[3, 5, 10, 15, 20].map(n => (
              <option key={n} value={n}>{n} routes</option>
            ))}
          </select>
        </div>

        <div className="option-group">
          <label>Spots per Route</label>
          <div className="range-inputs">
            <input
              type="number"
              min="1"
              max="10"
              value={options.minSpotsPerCluster}
              onChange={(e) => setOptions({...options, minSpotsPerCluster: parseInt(e.target.value)})}
            />
            <span>to</span>
            <input
              type="number"
              min="2"
              max="15"
              value={options.maxSpotsPerCluster}
              onChange={(e) => setOptions({...options, maxSpotsPerCluster: parseInt(e.target.value)})}
            />
          </div>
        </div>

        <button onClick={searchRoutes} disabled={loading} className="search-button">
          {loading ? 'Discovering Routes...' : '🔍 Discover Routes'}
        </button>
      </div>

      {/* Results Display */}
      {results && (
        <div className="results-section">
          <div className="results-summary">
            <h3>Found {results.summary.totalRoutesReturned} Amazing Routes!</h3>
            <p>
              {results.summary.existingRoutesFound} curated routes + 
              {results.summary.aiRoutesGenerated} AI-generated routes
            </p>
          </div>

          {/* Existing Routes Section */}
          {results.existingRoutes.length > 0 && (
            <div className="route-section">
              <h4>✨ Popular Existing Routes</h4>
              <div className="route-grid">
                {results.existingRoutes.map(route => (
                  <RouteCard key={route.modelRouteId} route={route} type="existing" />
                ))}
              </div>
            </div>
          )}

          {/* AI Generated Routes Section */}
          {results.generatedRoutes.length > 0 && (
            <div className="route-section">
              <h4>🤖 AI-Generated Routes Just for You</h4>
              <div className="route-grid">
                {results.generatedRoutes.map(route => (
                  <RouteCard key={route.modelRouteId} route={route} type="ai" />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Route Card Component
function RouteCard({ route, type }: { route: any; type: 'existing' | 'ai' }) {
  return (
    <div className={`route-card ${type}`}>
      <div className="route-header">
        <h5>{route.routeName}</h5>
        {type === 'ai' && <span className="ai-badge">AI Generated</span>}
      </div>
      
      <p className="route-desc">{route.regionDesc}</p>
      
      <div className="route-stats">
        <span>📍 {route.spotCount} spots</span>
        {route.estimatedDuration && <span>⏱️ {route.estimatedDuration}</span>}
        {route.confidenceScore && <span>⭐ {(route.confidenceScore * 100).toFixed(0)}% match</span>}
      </div>

      <div className="route-spots">
        {route.touristSpots.slice(0, 3).map((spot, idx) => (
          <div key={idx} className="spot-preview">
            {spot.touristSpotName}
          </div>
        ))}
        {route.touristSpots.length > 3 && (
          <div className="more-spots">+{route.touristSpots.length - 3} more</div>
        )}
      </div>

      <button className="view-route-btn">View Full Route →</button>
    </div>
  );
}
```

---

## 🎨 Complete App Integration

```tsx
// app/discover/page.tsx
import { useState } from 'react';
import { RegionSelector } from '@/components/RegionSelector';
import { InterestSelector } from '@/components/InterestSelector';
import { RouteDiscovery } from '@/components/RouteDiscovery';

export default function DiscoverPage() {
  const [step, setStep] = useState(1);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const handleRegionSelect = (region: string) => {
    setSelectedRegion(region);
    setStep(2);
  };

  const handleInterestsSelect = (interests: string[]) => {
    setSelectedInterests(interests);
    setStep(3);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  return (
    <div className="discover-page">
      {/* Progress Bar */}
      <div className="progress-bar">
        <div className={`step ${step >= 1 ? 'active' : ''}`}>1. Region</div>
        <div className={`step ${step >= 2 ? 'active' : ''}`}>2. Interests</div>
        <div className={`step ${step >= 3 ? 'active' : ''}`}>3. Routes</div>
      </div>

      {/* Step Content */}
      <div className="step-content">
        {step === 1 && (
          <RegionSelector onRegionSelect={handleRegionSelect} />
        )}
        
        {step === 2 && (
          <>
            <button onClick={handleBack} className="back-button">← Back</button>
            <InterestSelector 
              region={selectedRegion}
              onInterestsSelect={handleInterestsSelect}
            />
          </>
        )}
        
        {step === 3 && (
          <>
            <button onClick={handleBack} className="back-button">← Back</button>
            <RouteDiscovery 
              region={selectedRegion}
              interests={selectedInterests}
            />
          </>
        )}
      </div>
    </div>
  );
}
```

---

## 📊 What to Expect from Each API Call

### **1. GET /routes**
```json
// Returns array of all routes
[
  {
    "modelRouteId": "MRT-123",
    "routeName": "Tokyo Food Paradise",
    "region": "Tokyo",
    "touristSpotList": [
      {
        "touristSpotHashtag": ["food", "ramen", "sushi"]
      }
    ]
  }
  // ... more routes
]
```

### **2. POST /ai/routes/hashtags/available**
```json
// Request
{ "region": "Tokyo" }

// Response
{
  "hashtags": ["food", "temple", "anime", "shopping", "nature"],
  "totalCount": 45,
  "topHashtags": [
    { "hashtag": "food", "count": 25 },
    { "hashtag": "anime", "count": 18 },
    { "hashtag": "temple", "count": 15 }
  ],
  "region": "Tokyo",
  "message": "Found 45 unique hashtags in Tokyo"
}
```

### **3. POST /ai/routes/recommendations**
```json
// Request
{
  "keywords": ["food", "anime"],
  "mode": "any",
  "region": "Tokyo",
  "proximityRadiusKm": 50,
  "maxRoutes": 5,
  "minSpotsPerCluster": 2,
  "maxSpotsPerCluster": 8
}

// Response
{
  "existingRoutes": [
    {
      "modelRouteId": "MRT-existing-123",
      "routeName": "Akihabara Food & Anime Tour",
      "region": "Tokyo",
      "isAiGenerated": false,
      "spotCount": 5,
      "touristSpots": [...]
    }
  ],
  "generatedRoutes": [
    {
      "modelRouteId": "MRT-ai-456",
      "routeName": "Tokyo Anime Gastronomy Experience",
      "estimatedDuration": "2-3 days",
      "confidenceScore": 0.9,
      "touristSpots": [...]
    }
  ],
  "summary": {
    "existingRoutesFound": 1,
    "aiRoutesGenerated": 2,
    "totalRoutesReturned": 3
  }
}
```

---

## 🎯 UI/UX Best Practices

### **1. Loading States**
- Show skeleton loaders while fetching data
- Display progress indicators for AI generation
- Cache region data for faster subsequent loads

### **2. Error Handling**
```tsx
try {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
} catch (error) {
  // Show user-friendly error message
  showToast('Unable to load routes. Please try again.');
}
```

### **3. Responsive Design**
- Mobile-first approach with touch-friendly controls
- Collapsible options panel on mobile
- Swipeable route cards

### **4. Performance**
- Debounce option changes
- Lazy load route images
- Virtual scrolling for large result sets

---

## 🚀 Advanced Features

### **Save User Preferences**
```tsx
// Save selected region and interests
localStorage.setItem('userPreferences', JSON.stringify({
  favoriteRegion: selectedRegion,
  favoriteInterests: selectedInterests,
  lastSearch: new Date().toISOString()
}));
```

### **Route Comparison**
```tsx
// Allow users to compare multiple routes
const [compareList, setCompareList] = useState<string[]>([]);

const addToCompare = (routeId: string) => {
  if (compareList.length < 3) {
    setCompareList([...compareList, routeId]);
  }
};
```

### **Share Functionality**
```tsx
const shareRoute = (route: any) => {
  const shareUrl = `https://tourii.app/routes/${route.modelRouteId}`;
  const shareText = `Check out this amazing route: ${route.routeName} in ${route.region}!`;
  
  if (navigator.share) {
    navigator.share({
      title: route.routeName,
      text: shareText,
      url: shareUrl
    });
  }
};
```

---

## 🎨 CSS Styling Example

```css
/* Modern, clean design */
.region-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  cursor: pointer;
}

.region-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
}

.hashtag-chip {
  display: inline-block;
  padding: 8px 16px;
  margin: 4px;
  border-radius: 20px;
  background: #f0f0f0;
  border: 2px solid transparent;
  transition: all 0.2s ease;
}

.hashtag-chip.selected {
  background: #4A90E2;
  color: white;
  border-color: #4A90E2;
}

.route-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.route-card.ai {
  border: 2px solid #9B59B6;
}

.ai-badge {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}
```

---

## 📱 Mobile Optimization

```tsx
// Detect mobile and adjust UI
const isMobile = window.innerWidth <= 768;

// Mobile-specific adjustments
{isMobile ? (
  <SwipeableRouteCards routes={results} />
) : (
  <RouteGrid routes={results} />
)}
```

---

## 🔧 Environment Variables

```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_API_KEY=dev-key
NEXT_PUBLIC_API_VERSION=1.0.0
```

---

This complete implementation provides a smooth, intuitive user experience for discovering both existing and AI-generated routes through a guided 3-step process!