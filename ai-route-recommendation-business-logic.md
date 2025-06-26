# AI-Powered Route Recommendation System - Business Logic Design

## Business Context

Create an intelligent route recommendation system that:
1. **Finds tourist spots** matching user's interest hashtags
2. **Groups nearby spots** into logical travel routes  
3. **Uses AI (GPT)** to generate route names, descriptions, and content
4. **Creates new model_route entries** with AI-generated content

## Core Business Logic

### 1. Route Discovery Flow

```
User Input: Keywords/Hashtags (e.g., "animation", "scenery")
    ↓
Find Matching Tourist Spots by Hashtags
    ↓
Group Spots by Geographic Proximity
    ↓
AI Generates Route Content for Each Group
    ↓
Create New Model Route Records
    ↓
Return Recommendations to User
```

### 2. Domain Model Extensions

#### Enhanced Model Route Entity
```typescript
// Existing model_route table columns that AI will populate:
- route_name         // AI-generated: "Anime Pilgrimage Adventure"
- region_desc        // AI-generated: "Discover iconic animation studios..."
- recommendation[]   // AI-generated: ["animation", "pilgrimage", "culture"]
```

#### Tourist Spot Filtering
```typescript
// Use existing tourist_spot.tourist_spot_hashtag[] for matching
- hashtag matching logic: ANY or ALL mode
- geographic clustering by coordinates
- proximity threshold: configurable radius (e.g., 50km)
```

## Detailed Business Rules

### Rule 1: Tourist Spot Discovery
**Input**: User keywords array (e.g., ["animation", "scenery"])
**Process**:
```pseudocode
FOR each keyword in userKeywords:
    spots = findTouristSpotsByHashtag(keyword)
    relevantSpots.add(spots)

// Apply matching mode
IF mode == "ALL":
    finalSpots = spots that contain ALL keywords in hashtags
ELSE: // mode == "ANY"  
    finalSpots = spots that contain ANY keyword in hashtags

RETURN finalSpots with relevance scores
```

### Rule 2: Geographic Clustering
**Input**: List of tourist spots with coordinates
**Process**:
```pseudocode
clusters = []
proximityRadius = 50 // kilometers

FOR each spot in filteredSpots:
    foundCluster = false
    
    FOR each cluster in clusters:
        avgLat = average(cluster.spots.latitude)
        avgLng = average(cluster.spots.longitude)
        distance = calculateDistance(spot.coordinates, [avgLat, avgLng])
        
        IF distance <= proximityRadius:
            cluster.spots.add(spot)
            foundCluster = true
            BREAK
    
    IF NOT foundCluster:
        clusters.add(newCluster(spot))

// Filter clusters with minimum 2 spots
viableClusters = clusters.filter(cluster => cluster.spots.length >= 2)
RETURN viableClusters
```

### Rule 3: AI Content Generation
**Input**: Cluster of tourist spots + user keywords
**Process**:
```pseudocode
FOR each cluster in viableClusters:
    spotNames = cluster.spots.map(spot => spot.name)
    spotHashtags = cluster.spots.flatMap(spot => spot.hashtags)
    commonHashtags = findCommonHashtags(spotHashtags)
    
    aiPrompt = buildPrompt({
        userKeywords: userKeywords,
        spotNames: spotNames,
        commonHashtags: commonHashtags,
        region: cluster.spots[0].region,
        spotCount: cluster.spots.length
    })
    
    aiResponse = callGPTAPI(aiPrompt)
    
    routeContent = parseAIResponse(aiResponse) {
        routeName: string,
        regionDesc: string, 
        recommendations: string[],
        estimatedDuration: string
    }
    
    cluster.aiGeneratedContent = routeContent
    
RETURN clustersWithContent
```

### Rule 4: Model Route Creation
**Input**: Clusters with AI-generated content
**Process**:
```pseudocode
newRoutes = []

FOR each cluster in clustersWithContent:
    // Calculate route metadata
    centerCoords = calculateCenterPoint(cluster.spots)
    region = determineRegion(cluster.spots)
    
    // Create new model route entity
    modelRoute = new ModelRouteEntity({
        // AI-generated content
        routeName: cluster.aiGeneratedContent.routeName,
        regionDesc: cluster.aiGeneratedContent.regionDesc,
        recommendation: cluster.aiGeneratedContent.recommendations,
        
        // Calculated metadata  
        region: region,
        regionLatitude: centerCoords.lat,
        regionLongitude: centerCoords.lng,
        regionBackgroundMedia: selectRepresentativeImage(cluster.spots),
        
        // System metadata
        storyId: null, // Standalone route
        insUserId: "ai-system",
        insDateTime: now(),
        updUserId: "ai-system", 
        updDateTime: now()
    })
    
    // Save to database
    savedRoute = modelRouteRepository.createModelRoute(modelRoute)
    
    // Link tourist spots to new route (optional - or keep as recommendations)
    FOR each spot in cluster.spots:
        spot.modelRouteId = savedRoute.id
        modelRouteRepository.updateTouristSpot(spot)
    
    newRoutes.add(savedRoute)

RETURN newRoutes
```

## AI Prompt Engineering

### GPT Prompt Template
```
System: You are a travel route curator specializing in creating engaging travel experiences.

User Context:
- User interests: {userKeywords}
- Tourist spots found: {spotNames}
- Common themes: {commonHashtags}
- Region: {region}
- Number of spots: {spotCount}

Generate a cohesive travel route with:
1. Route Name: Creative, engaging name (max 100 chars)
2. Region Description: Compelling overview (max 500 chars)  
3. Recommendations: 3-5 relevant hashtags/themes
4. Estimated Duration: Based on spot count

Output Format:
{
  "routeName": "...",
  "regionDesc": "...", 
  "recommendations": ["...", "...", "..."],
  "estimatedDuration": "2-3 days"
}

Make it exciting and authentic to Japanese tourism!
```

## API Design (Business Logic Only)

### Endpoint: `/api/routes/ai-recommendations`

#### Request
```typescript
{
  keywords: string[],           // ["animation", "scenery"]
  mode: "all" | "any",         // matching mode
  region?: string,             // optional region filter
  proximityRadius?: number,    // km radius for clustering (default: 50)
  minSpotsPerRoute?: number,   // minimum spots to form route (default: 2)
  maxRoutes?: number          // limit generated routes (default: 5)
}
```

#### Response  
```typescript
{
  generatedRoutes: [{
    id: string,                // new model route ID
    name: string,              // AI-generated name
    description: string,       // AI-generated description
    recommendations: string[], // AI-generated hashtags
    region: string,
    spotCount: number,
    estimatedDuration: string,
    touristSpots: [            // spots included in route
      {
        id: string,
        name: string,
        hashtags: string[],
        matchedKeywords: string[],
        coordinates: { lat, lng }
      }
    ],
    metadata: {
      aiGenerated: true,
      generatedAt: DateTime,
      sourceKeywords: string[],
      confidenceScore: number   // 0-1 based on keyword relevance
    }
  }],
  summary: {
    totalSpots: number,        // spots found matching keywords
    clustersFormed: number,    // geographic groups created
    routesGenerated: number    // successful AI route generations
  }
}
```

## Caching Strategy

### Cache Keys
```
ai-spots-by-keywords:{keywords-hash}     // TTL: 30min
ai-route-generation:{cluster-hash}       // TTL: 24h  
popular-keyword-combinations             // TTL: 6h
```

### Cache Invalidation
- Clear spots cache when tourist_spot records updated
- Clear generation cache when new routes created
- Proactive cache warming for popular keyword combinations

## Error Handling

### New Error Codes
```typescript
E_TB_AI_001: "No tourist spots found matching keywords"
E_TB_AI_002: "Insufficient spots for route generation" 
E_TB_AI_003: "Geographic clustering failed"
E_TB_AI_004: "AI content generation failed"
E_TB_AI_005: "Route creation failed" 
E_TB_AI_006: "AI API rate limit exceeded"
```

## Performance Considerations

### Rate Limiting
- **AI API calls**: 10 requests per minute per user
- **Route generation**: 3 routes per hour per user
- **Keyword searches**: 20 requests per minute per user

### Optimization Strategies
1. **Precompute popular clusters** for common keyword combinations
2. **Batch AI requests** when generating multiple routes
3. **Cache geographic calculations** for tourist spot coordinates
4. **Use GPT-4o-mini** for cost efficiency while maintaining quality

## Implementation Phases

### Phase 1: Core Logic (Week 1)
- Tourist spot hashtag search
- Geographic clustering algorithm  
- Basic AI prompt integration

### Phase 2: AI Enhancement (Week 2)
- Advanced prompt engineering
- Response parsing and validation
- Error handling and retries

### Phase 3: Performance & UX (Week 3)
- Caching implementation
- Rate limiting
- Response optimization

### Phase 4: Production Polish (Week 4)  
- Monitoring and analytics
- A/B testing different prompts
- Cost optimization

## Success Metrics

### Quality Metrics
- **AI content quality**: Manual review score > 8/10
- **Route relevance**: User engagement rate > 70%
- **Keyword matching accuracy**: > 90% relevant spots included

### Performance Metrics  
- **API response time**: < 5 seconds for route generation
- **AI generation success rate**: > 95%
- **Cost per route**: < $0.10 (including AI API costs)

### Business Metrics
- **User adoption**: 40% of searches use AI recommendations
- **Route creation**: 100+ new AI routes per week
- **User satisfaction**: 4.5/5 rating for AI-generated content

---

This system leverages AI to transform scattered tourist spots into coherent, engaging travel experiences while maintaining the existing domain architecture and database structure.