'use strict';

describe('Side', function() {
  var topSide, bottomSide, leftSide, rightSide, r1, r2, partner1, partner2,
  endpoint1, endpoint2, parentEntity, weakerEntity, strongerEntity;

  beforeEach(function() {
    parentEntity = new window.Entity({id: 0, name: 'subject' , x:  0, y:  0, width: 100, height: 80});

    // These entities are labeled 'weaker' and 'stronger' in the sense of how
    // hard they pull toward the bottom right edge of the parent entity based
    // on their current coordinates. The strong one's endpoint should get
    // preference.
    weakerEntity   = new window.Entity({id: 1, name: 'weaker'  , x:400, y:100, width: 100, height: 80});
    strongerEntity = new window.Entity({id: 2, name: 'stronger', x:400, y:300, width: 100, height: 80});

    r1 = new window.Relationship(0);
    r2 = new window.Relationship(1);

    endpoint1 = new window.Endpoint({
      entity:       parentEntity,
      otherEntity:  weakerEntity,
      relationship: r1,
    });

    endpoint2 = new window.Endpoint({
      entity:       parentEntity,
      otherEntity:  strongerEntity,
      relationship: r2,
    });

    partner1 = new window.Endpoint({
      entity:       weakerEntity,
      otherEntity:  parentEntity,
      relationship: r1,
      label: '',
      symbol: ''
    });

    partner2 = new window.Endpoint({
      entity:       strongerEntity,
      otherEntity:  parentEntity,
      relationship: r2,
      label: '',
      symbol: ''
    });

    topSide    = parentEntity.sides['top'];
    bottomSide = parentEntity.sides['bottom'];
    leftSide   = parentEntity.sides['left'];
    rightSide  = parentEntity.sides['right'];
  });

  it('accepts endpoints', function() {
    topSide.addEndpoint(endpoint1);
    expect(topSide.endpoints[0]).toBe(endpoint1);
  });

  it('removes endpoints', function() {
    topSide.addEndpoint(endpoint1);
    topSide.removeEndpoint(endpoint1);
    expect(topSide.endpoints.length).toBe(0);
  });

  /* TODO add to an e2e test
  describe('after negotiation', function() {
    beforeEach(function() {
      rightSide.addEndpoint(endpoint1); //add weaker one first
      rightSide.addEndpoint(endpoint2);
      endpoint2.negotiateCoordinates();
    });

    it('has prioritized its endpoints based on the amount the related entities are offset from center', function() {
      expect(rightSide.endpoints[0].otherEntity.name).toBe(strongerEntity.name);
      expect(rightSide.endpoints[1].otherEntity.name).toBe(weakerEntity.name);
    });

    it('has negotiated the best positions for its endpoints', function() {
      expect(endpoint2.y - endpoint1.y).toBe(20);
      expect(endpoint2.x - endpoint1.x).toBe(0);
    });
  });
  */
});
