Feature: graph settings form
  In order to manage a graph in one view
  As a graph editor
  I want to edit graph settings on the edit page

  Scenario: Edit graph read password
	Given I am visiting the graph edit page
    And the settings form is visible
    When I submit a read password "dishwasher"
    Then I see the read password set to "dishwasher"
