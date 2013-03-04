Given /^I am visiting the graph edit page$/ do
  graph = Graph.create(:name => "test_graph")
  visit edit_graph_path(graph.id)
end

Given /^the settings form is visible$/ do
  click_link 'Settings'
end

When /^I submit a description "(.*)"$/ do |desc|
  fill_in 'Description', :with => desc
  click_button 'Save'
end

Then /^I see the description "(.*)" on the main index$/ do |desc|
  visit graphs_path
  page.should have_content desc
end
