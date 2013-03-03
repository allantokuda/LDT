Given /I am visiting the graph edit page/ do
  graph = Graph.create(:name => "test_graph")
  visit edit_graph_path(graph.id)
end

Given /the settings form is visible/ do
  click_link 'Settings'
end

When /I submit a read password "(.*)"/ do |pass|
  fill_in 'Read password', :with => pass 
  click_button 'Save'
end

Then /I see the read password set to "(.*)"/ do |pass|
  page.should have_content 'Read password set to ' + pass
end

