Feature: graph parameter editor
  In order to manage a graph in one view
  As a graph editor
  I want to edit graph parameters on the edit page

  Scenario: Edit graph read password
    Given I am viewing the graph edit page
    And I have loaded a graph that is saved
    And the parameter form is visible
    When I change the read password to "dishwasher"
    Then I see the read password change to "dishwasher"

