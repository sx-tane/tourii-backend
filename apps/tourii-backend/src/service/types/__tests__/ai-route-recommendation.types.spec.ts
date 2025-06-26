import {
  TypeGuards,
  TypeConstructors,
  Coordinates,
  RouteId,
  TouristSpotId,
  Keyword,
  ConfidenceScore,
  ProximityRadius,
} from '../ai-route-recommendation.types';

describe('AI Route Recommendation Types', () => {
  describe('TypeGuards', () => {
    describe('isValidLatitude', () => {
      it('should validate correct latitude values', () => {
        expect(TypeGuards.isValidLatitude(0)).toBe(true);
        expect(TypeGuards.isValidLatitude(45.5)).toBe(true);
        expect(TypeGuards.isValidLatitude(-89.9)).toBe(true);
        expect(TypeGuards.isValidLatitude(90)).toBe(true);
        expect(TypeGuards.isValidLatitude(-90)).toBe(true);
      });

      it('should reject invalid latitude values', () => {
        expect(TypeGuards.isValidLatitude(91)).toBe(false);
        expect(TypeGuards.isValidLatitude(-91)).toBe(false);
        expect(TypeGuards.isValidLatitude(NaN)).toBe(false);
        expect(TypeGuards.isValidLatitude(Infinity)).toBe(false);
      });
    });

    describe('isValidLongitude', () => {
      it('should validate correct longitude values', () => {
        expect(TypeGuards.isValidLongitude(0)).toBe(true);
        expect(TypeGuards.isValidLongitude(135.5)).toBe(true);
        expect(TypeGuards.isValidLongitude(-179.9)).toBe(true);
        expect(TypeGuards.isValidLongitude(180)).toBe(true);
        expect(TypeGuards.isValidLongitude(-180)).toBe(true);
      });

      it('should reject invalid longitude values', () => {
        expect(TypeGuards.isValidLongitude(181)).toBe(false);
        expect(TypeGuards.isValidLongitude(-181)).toBe(false);
        expect(TypeGuards.isValidLongitude(NaN)).toBe(false);
        expect(TypeGuards.isValidLongitude(Infinity)).toBe(false);
      });
    });

    describe('isValidConfidenceScore', () => {
      it('should validate correct confidence scores', () => {
        expect(TypeGuards.isValidConfidenceScore(0)).toBe(true);
        expect(TypeGuards.isValidConfidenceScore(0.5)).toBe(true);
        expect(TypeGuards.isValidConfidenceScore(1)).toBe(true);
        expect(TypeGuards.isValidConfidenceScore(0.999)).toBe(true);
      });

      it('should reject invalid confidence scores', () => {
        expect(TypeGuards.isValidConfidenceScore(-0.1)).toBe(false);
        expect(TypeGuards.isValidConfidenceScore(1.1)).toBe(false);
        expect(TypeGuards.isValidConfidenceScore(NaN)).toBe(false);
        expect(TypeGuards.isValidConfidenceScore(Infinity)).toBe(false);
      });
    });

    describe('isValidProximityRadius', () => {
      it('should validate correct proximity radius values', () => {
        expect(TypeGuards.isValidProximityRadius(1)).toBe(true);
        expect(TypeGuards.isValidProximityRadius(50)).toBe(true);
        expect(TypeGuards.isValidProximityRadius(200)).toBe(true);
        expect(TypeGuards.isValidProximityRadius(150.5)).toBe(true);
      });

      it('should reject invalid proximity radius values', () => {
        expect(TypeGuards.isValidProximityRadius(0)).toBe(false);
        expect(TypeGuards.isValidProximityRadius(201)).toBe(false);
        expect(TypeGuards.isValidProximityRadius(-1)).toBe(false);
        expect(TypeGuards.isValidProximityRadius(NaN)).toBe(false);
      });
    });

    describe('isValidKeyword', () => {
      it('should validate correct keywords', () => {
        expect(TypeGuards.isValidKeyword('a')).toBe(true);
        expect(TypeGuards.isValidKeyword('anime')).toBe(true);
        expect(TypeGuards.isValidKeyword('a'.repeat(50))).toBe(true);
      });

      it('should reject invalid keywords', () => {
        expect(TypeGuards.isValidKeyword('')).toBe(false);
        expect(TypeGuards.isValidKeyword('a'.repeat(51))).toBe(false);
        expect(TypeGuards.isValidKeyword(123 as any)).toBe(false);
        expect(TypeGuards.isValidKeyword(null as any)).toBe(false);
      });
    });

    describe('isValidSearchMode', () => {
      it('should validate correct search modes', () => {
        expect(TypeGuards.isValidSearchMode('all')).toBe(true);
        expect(TypeGuards.isValidSearchMode('any')).toBe(true);
      });

      it('should reject invalid search modes', () => {
        expect(TypeGuards.isValidSearchMode('invalid')).toBe(false);
        expect(TypeGuards.isValidSearchMode('')).toBe(false);
        expect(TypeGuards.isValidSearchMode('ALL')).toBe(false);
      });
    });

    describe('isValidDurationString', () => {
      it('should validate correct duration strings', () => {
        expect(TypeGuards.isValidDurationString('1-2 days')).toBe(true);
        expect(TypeGuards.isValidDurationString('3-4 hours')).toBe(true);
        expect(TypeGuards.isValidDurationString('1-1 day')).toBe(true);
        expect(TypeGuards.isValidDurationString('5-10 HOURS')).toBe(true);
      });

      it('should reject invalid duration strings', () => {
        expect(TypeGuards.isValidDurationString('2 days')).toBe(false);
        expect(TypeGuards.isValidDurationString('1-2')).toBe(false);
        expect(TypeGuards.isValidDurationString('invalid')).toBe(false);
        expect(TypeGuards.isValidDurationString('')).toBe(false);
      });
    });
  });

  describe('TypeConstructors', () => {
    describe('createRouteId', () => {
      it('should create valid route IDs', () => {
        const routeId = TypeConstructors.createRouteId('route-123');
        expect(routeId).toBe('route-123');
        // Type assertion to verify branded type
        const _typeCheck: RouteId = routeId;
      });

      it('should throw for invalid route IDs', () => {
        expect(() => TypeConstructors.createRouteId('')).toThrow('Invalid RouteId');
        expect(() => TypeConstructors.createRouteId(null as any)).toThrow('Invalid RouteId');
        expect(() => TypeConstructors.createRouteId(undefined as any)).toThrow('Invalid RouteId');
      });
    });

    describe('createTouristSpotId', () => {
      it('should create valid tourist spot IDs', () => {
        const spotId = TypeConstructors.createTouristSpotId('spot-456');
        expect(spotId).toBe('spot-456');
        // Type assertion to verify branded type
        const _typeCheck: TouristSpotId = spotId;
      });

      it('should throw for invalid tourist spot IDs', () => {
        expect(() => TypeConstructors.createTouristSpotId('')).toThrow('Invalid TouristSpotId');
        expect(() => TypeConstructors.createTouristSpotId(null as any)).toThrow('Invalid TouristSpotId');
      });
    });

    describe('createKeyword', () => {
      it('should create valid keywords', () => {
        const keyword = TypeConstructors.createKeyword('anime');
        expect(keyword).toBe('anime');
        // Type assertion to verify branded type
        const _typeCheck: Keyword = keyword;
      });

      it('should throw for invalid keywords', () => {
        expect(() => TypeConstructors.createKeyword('')).toThrow('Invalid Keyword');
        expect(() => TypeConstructors.createKeyword('a'.repeat(51))).toThrow('Invalid Keyword');
      });
    });

    describe('createCoordinates', () => {
      it('should create valid coordinates', () => {
        const coords = TypeConstructors.createCoordinates(35.6762, 139.6503);
        expect(coords.lat).toBe(35.6762);
        expect(coords.lng).toBe(139.6503);
        // Type assertion to verify branded type
        const _typeCheck: Coordinates = coords;
      });

      it('should throw for invalid latitude', () => {
        expect(() => TypeConstructors.createCoordinates(91, 139)).toThrow('Invalid latitude');
        expect(() => TypeConstructors.createCoordinates(-91, 139)).toThrow('Invalid latitude');
      });

      it('should throw for invalid longitude', () => {
        expect(() => TypeConstructors.createCoordinates(35, 181)).toThrow('Invalid longitude');
        expect(() => TypeConstructors.createCoordinates(35, -181)).toThrow('Invalid longitude');
      });
    });

    describe('createConfidenceScore', () => {
      it('should create valid confidence scores', () => {
        const score = TypeConstructors.createConfidenceScore(0.85);
        expect(score).toBe(0.85);
        // Type assertion to verify branded type
        const _typeCheck: ConfidenceScore = score;
      });

      it('should throw for invalid confidence scores', () => {
        expect(() => TypeConstructors.createConfidenceScore(-0.1)).toThrow('Invalid confidence score');
        expect(() => TypeConstructors.createConfidenceScore(1.1)).toThrow('Invalid confidence score');
      });
    });
  });

  describe('Type Safety', () => {
    it('should prevent assignment between branded types', () => {
      const routeId = TypeConstructors.createRouteId('route-123');
      const spotId = TypeConstructors.createTouristSpotId('spot-456');
      
      // These should be different types at compile time
      // @ts-expect-error - Different branded types
      const invalid: RouteId = spotId;
      
      expect(routeId).not.toBe(spotId);
    });

    it('should allow assignment to base types', () => {
      const keyword = TypeConstructors.createKeyword('anime');
      const baseString: string = keyword; // Should work
      
      expect(baseString).toBe('anime');
    });
  });

  describe('Coordinates Interface', () => {
    it('should create immutable coordinates', () => {
      const coords = TypeConstructors.createCoordinates(35.6762, 139.6503);
      
      // Should be readonly
      // @ts-expect-error - readonly property
      coords.lat = 40;
      // @ts-expect-error - readonly property  
      coords.lng = 140;
      
      expect(coords.lat).toBe(35.6762);
      expect(coords.lng).toBe(139.6503);
    });
  });

  describe('Performance', () => {
    it('should validate types quickly', () => {
      const startTime = Date.now();
      
      for (let i = 0; i < 10000; i++) {
        TypeGuards.isValidLatitude(35.6762);
        TypeGuards.isValidLongitude(139.6503);
        TypeGuards.isValidKeyword('anime');
        TypeGuards.isValidConfidenceScore(0.85);
      }
      
      const endTime = Date.now();
      expect(endTime - startTime).toBeLessThan(100); // Should complete quickly
    });

    it('should create branded types quickly', () => {
      const startTime = Date.now();
      
      for (let i = 0; i < 1000; i++) {
        TypeConstructors.createRouteId(`route-${i}`);
        TypeConstructors.createKeyword(`keyword-${i}`);
        TypeConstructors.createCoordinates(35 + i * 0.01, 139 + i * 0.01);
      }
      
      const endTime = Date.now();
      expect(endTime - startTime).toBeLessThan(50); // Should complete quickly
    });
  });

  describe('Edge Cases', () => {
    it('should handle boundary values correctly', () => {
      // Latitude boundaries
      expect(TypeGuards.isValidLatitude(90)).toBe(true);
      expect(TypeGuards.isValidLatitude(-90)).toBe(true);
      expect(TypeGuards.isValidLatitude(90.0001)).toBe(false);
      
      // Longitude boundaries
      expect(TypeGuards.isValidLongitude(180)).toBe(true);
      expect(TypeGuards.isValidLongitude(-180)).toBe(true);
      expect(TypeGuards.isValidLongitude(180.0001)).toBe(false);
      
      // Confidence score boundaries
      expect(TypeGuards.isValidConfidenceScore(0)).toBe(true);
      expect(TypeGuards.isValidConfidenceScore(1)).toBe(true);
      expect(TypeGuards.isValidConfidenceScore(0.0001)).toBe(true);
      expect(TypeGuards.isValidConfidenceScore(0.9999)).toBe(true);
    });

    it('should handle special number values', () => {
      expect(TypeGuards.isValidLatitude(Number.POSITIVE_INFINITY)).toBe(false);
      expect(TypeGuards.isValidLatitude(Number.NEGATIVE_INFINITY)).toBe(false);
      expect(TypeGuards.isValidLatitude(Number.NaN)).toBe(false);
      expect(TypeGuards.isValidLatitude(Number.MAX_SAFE_INTEGER)).toBe(false);
    });

    it('should handle unicode keywords', () => {
      expect(TypeGuards.isValidKeyword('アニメ')).toBe(true);
      expect(TypeGuards.isValidKeyword('café')).toBe(true);
      expect(TypeGuards.isValidKeyword('🎌')).toBe(true);
    });
  });
});