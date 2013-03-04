Feature: graph settings form
  In order to manage a graph in one view
  As a graph editor
  I want to edit graph settings on the edit page

  @javascript
  Scenario: Edit graph read password
	Given I am visiting the graph edit page
    And the settings form is visible
    When I submit a description "my first graph"
    Then I see the description "my first graph" on the main index
