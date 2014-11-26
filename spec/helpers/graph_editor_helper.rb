  def refresh
    # edit to a special value and then don't save it, to give Capybara something to wait for
    # to know when the page has reloaded
    find('#graph-name').set '(reloading)'
    visit current_path
    expect(find('#graph-name').value).to_not eq '(reloading)'
  end

  def save
    find('#save-button').click
    expect(find('#save-message')).to have_content 'Saved'
  end

  def expect_graph_name(expected_name)
    expect(find('#graph-name').value).to eq expected_name
    expect(page.title).to eq expected_name
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
    expect(find("#endpoint-#{endpoint_id}")[:d]).to eq path_data
  end

  def set_label(endpoint_id, label_text)
    find('#label-button').click
    find("#click-area-#{endpoint_id}").click
    find("#label-input-#{endpoint_id}").set label_text
    finish_editing
  end

  def expect_label(endpoint_id, label_text)
    expect(find("#label-#{endpoint_id}").text).to eq label_text
  end

  def expect_entity_name(entity_id, entity_name)
    expect(find("#entity-#{entity_id} .entity-heading .entity-name").text).to eq entity_name
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
    expect(find(element_selector).native.location.x).to eq expected_x
    expect(find(element_selector).native.location.y).to eq expected_y
  end

  def endpoint_location(endpoint_id)
    path = find("#endpoint-#{endpoint_id}")[:d]
    /M(\d+,\d+)m/.match(path).captures[0].split(',').map &:to_i
  end

  def window_size(width, height)
    page.driver.browser.manage.window.resize_to(width, height)
  end

  def set_attributes(entity_id, attributes_text)
    find("#entity-#{entity_id} .entity-body").double_click
    find("#entity-#{entity_id} .entity-body .attribute-input").set attributes_text
    finish_editing
  end

  def expect_attribute(entity_id, attribute_num, attribute_text, is_identifier=false)
    attribute_selector = "#entity-#{entity_id}-attribute-#{attribute_num}"
    expect(find(attribute_selector)).to have_content attribute_text

    if is_identifier
      expect(find(attribute_selector)[:class].split(' ')).to include "identifier"
    else
      expect(find(attribute_selector)[:class].split(' ')).to_not include "identifier"
    end
  end
