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
