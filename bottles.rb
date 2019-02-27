MAX = 9;

class Bottles
  def verse(number)
    <<-STRING
#{pluralize_bottle(number, true)} of beer on the wall, #{pluralize_bottle(number)} of beer.
#{ending(number)}
STRING
  end

  def verses(first, second)
    range = (second..first).to_a.reverse

    range.map do |r|
      verse(r)
    end.join("\n") + "\n"
  end

  def song
    verses(MAX,0)
  end

  def pluralize_bottle(count, capital = false)
    if count >= 2
      "#{count} bottles"
    elsif count == 1
      "#{count} bottle"
    else
      "#{capital ? "N" : "n"}o more bottles"
    end
  end

  def article(count)
    if count > 1
      "one"
    else
      "it"
    end
  end

  def ending(count)
    if count == 0
      "Go to the store and buy some more, 99 bottles of beer on the wall."
    else
      "Take #{article(count)} down and pass it around, #{pluralize_bottle(count - 1)} of beer on the wall."
    end
  end
end

puts Bottles.new.song
# ruby -e 'require "./bottles"; puts Bottles.new.song'