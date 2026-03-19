module ApplicationHelper
  def formatted_duration(seconds)
    return "0:00" if seconds.to_i <= 0

    hours = seconds / 3600
    minutes = (seconds % 3600) / 60
    remainder = seconds % 60

    if hours > 0
      "#{hours}:%02d:%02d" % [minutes, remainder]
    else
      "#{minutes}:%02d" % remainder
    end
  end

  def album_meta_line(album)
    [album.artist, album.year].compact_blank.join(" \u2022 ")
  end

  def album_cover_transition_name(album)
    "album-cover-#{album.id}"
  end
end
