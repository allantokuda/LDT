  def refresh
    # edit to a special value and then don't save it, to give Capybara something to wait for
    # to know when the page has reloaded
    find('#graph-name').set '(reloading)'
    visit current_path
    expect(find('#graph-name')).not_to respond(to: [:value], with: '(reloading)')
  end

  def save
    find('#save-button').click
    expect(find('#save-message')).to have_content 'Saved'
  end

  def expect_graph_name(expected_name)
    expect(find('#graph-name')).to respond(to: [:value], with: expected_name)
    expect(page).to respond(to: [:title], with: expected_name)
  end

  def create_entity(x,y)
    find('#new-entity-button').click
    find('#canvas').click_at(x,y)
  end

  def delete_entity(entity_id)
    find('#delete-item-button').click
    find("#entity-#{entity_id} .select-shield").click
  end

  def rename_entity(entity_id, name)
    # 'click_at' and 'double_click' are defined in spec_helper.rb
    find("#entity-#{entity_id} .entity-heading .entity-name").double_click
    find("#entity-#{entity_id} .entity-heading .entity-name-input").set name
    finish_editing
  end

  def move_entity(entity_id, dx, dy)
    find("#entity-#{entity_id} .entity-heading .entity-name").drag(dx, dy)
  end

  def finish_editing
    # finish editing by clicking on an unoccupied location on the canvas
    find('#canvas').click_at(1,1)
  end

  def create_relationship(entity_id1, entity_id2)
    find('#new-relationship-button').click
    find("#entity-#{entity_id1} .select-shield").click
    find("#entity-#{entity_id2} .select-shield").click
  end

  def delete_relationship(relationship_id)
    find('#delete-item-button').click
    find("#click-path-#{relationship_id}").click
  end

  def expect_arrowhead(endpoint_id, path_data)
    expect(find("#endpoint-#{endpoint_id}")).to have_svg_path_data path_data
  end

  def set_label(endpoint_id, label_text)
    find('#label-button').click
    find("#click-area-#{endpoint_id}").click
    find("#label-input-#{endpoint_id}").set label_text
    finish_editing
  end

  def expect_label(endpoint_id, label_text)
    expect(find("#label-#{endpoint_id}")).to respond(to: [:text], with: label_text)
  end

  def expect_entity_name(entity_id, entity_name)
    expect(find("#entity-#{entity_id} .entity-heading .entity-name")).to respond(to: [:text], with: entity_name)
  end

  def wiggle_entity(entity_id)
    find("#entity-#{entity_id}").drag( 10, 10)
    find("#entity-#{entity_id}").drag(-10,-10)
  end

  def change_degree(endpoint_id)
    find('#chickenfoot-button').click
    find("#click-area-#{endpoint_id}").click
  end

  def check_location(element_selector, expected_x, expected_y)
    expect(find(element_selector)).to respond(to: [:native, :location, :x], with: expected_x)
    expect(find(element_selector)).to respond(to: [:native, :location, :y], with: expected_y)
  end
