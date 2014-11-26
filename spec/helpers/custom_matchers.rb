# Usage: expect(target).to respond(to: [:chain_method1, :chain_method2, ...], with: expected_value)
RSpec::Matchers.define :respond do |behavior|
  match do |element|
		# Run all the methods in [:to] in sequence, and compare the final result to expected_value
		behavior[:to].inject(element) { |object, method| object.send method } == behavior[:with]
  end

	failure_message do |element|
    %Q(expected: #{behavior[:with].inspect}\n) +
		%Q(actual:   #{behavior[:to].inject(element) { |object, method| object.send method }.inspect})
  end
end

RSpec::Matchers.define :have_svg_path_data do |expected_d|
  match do |element|
    element[:d] == expected_d
  end
	failure_message do |element|
    %Q(expected: <path d="#{expected_d}">\n) +
		%Q(actual:   <path d="#{element[:d]}">)
  end
end

# Input: hash of styles, e.g. { "color": "red", "width": "100px" }
RSpec::Matchers.define :have_styles do |styles|
  match do |element|
    styles.map do |style, value|
      element.native.style(style) == value
    end.all?
  end
	failure_message do |element|
    expected = styles.map do |style, value|
      "#{style}: #{value};"
    end.join(' ')

    actual = styles.map do |style, value|
      "#{style}: #{element.native.style(style)};"
    end.join(' ')

    "expected: #{expected}\n" +
    "actual:   #{actual}"
  end
end
