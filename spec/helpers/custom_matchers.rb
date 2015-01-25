RSpec::Matchers.define :have_approx_size do |sizing|
  match do |element|
    width  = sizing[:width]
    height = sizing[:height]
    tol    = sizing[:tolerance]

    element.native.style(:width ).to_i.between?(width  - tol,  width + tol) &&
    element.native.style(:height).to_i.between?(height - tol, height + tol)
  end

  failure_message do |element|
    expected = [:width, :height].map do |attr|
      "#{attr}: #{sizing[attr]} +/- #{sizing[:tolerance]};"
    end.join(' ')

    actual = [:width, :height].map do |attr|
      "#{attr}: #{element.native.style(attr)};"
    end.join(' ')

    "expected: #{expected}\n" +
    "actual:   #{actual}"
  end
end
