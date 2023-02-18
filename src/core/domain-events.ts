import EventEmitter from "events";

export const eventsNames = {
  audio: {
    removedAudio: "removed_audio",
    removePaddingWorlds: "remove-padding_audio",
    removedWorlds: "removed-padding_audio",
    add: "add_audio",
    covertWorldToAudio: "converted_world_audio",
  },
  video: {
    add: "add_audio",
  },
  subtitle: {
    write: "write_subtitle",
    read: "read_subtitle",
    toSRT: "words_to_srt",
  },

  translate: {
    end: "translated",
  },
  errors: {
    internalError: "server_error",
    error: "app_error",
  },
};

export const domainEvent = new EventEmitter();
